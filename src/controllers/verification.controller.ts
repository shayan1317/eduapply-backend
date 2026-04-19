// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  ProfileRepository,
  UserRepository,
  VerificationRepository,
} from '../repositories';
import {
  EmailVerificationStatus,
  ResetPasswordCodeStatus,
  VerificationStatus,
} from '../schema';
import {SmtpMailService, UtilService} from '../services';

export class VerificationController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @repository(ProfileRepository)
    private profileRepo: ProfileRepository,

    @repository(VerificationRepository)
    private verificationRepo: VerificationRepository,

    @service(SmtpMailService)
    private mailService: SmtpMailService,

    @service(UtilService)
    private utilService: UtilService,
  ) {}

  async sendEmailVerificationCode(
    context: any,
    email: string,
  ): Promise<EmailVerificationStatus> {
    try {
      const user = await this.userRepo.findOne({
        where: {username: email.toLowerCase()},
      });
      if (user && user.verificationStatus === VerificationStatus.VERIFIED)
        throw new HttpErrors.Conflict(
          'User with the same email address already exists',
        );
      const code = this.utilService.generateRandomNumber(4);

      const verification = await this.verificationRepo.create({
        code,
        email,
        status: VerificationStatus.CODE_SENT,
      });
      if (process?.env?.NODE_ENV) {
        await this.mailService.sendEmailVerificationCode(email, code);
      }

      return {
        status: VerificationStatus.CODE_SENT,
        verificationId: verification.id,
      };
    } catch (error) {
      this.logger.error('SendEmailVerificationCodeError', error);
      throw error;
    }
  }

  async sendPasswordResetCode(
    context: any,
    email: string,
  ): Promise<ResetPasswordCodeStatus> {
    try {
      const user = await this.userRepo.findOne({
        where: {username: email.toLowerCase()},
      });
      if (!user) throw new HttpErrors.NotFound('user does not exist for email');

      const code = this.utilService.generateRandomNumber(4);

      const verification = await this.verificationRepo.create({
        code,
        email,
        status: VerificationStatus.RESET_PASSWORD_CODE_SENT,
      });
      if (!verification)
        throw new HttpErrors.NotFound('Verification record not found');

      if (process?.env?.NODE_ENV) {
        await this.mailService.sendPasswordResetEmail(email, code, email);
      }
      return {
        status: VerificationStatus.RESET_PASSWORD_CODE_SENT,
        verificationId: verification.id,
        // firstName: profile.firstName,
        // lastName: profile.lastName,
        email: email,
      };
    } catch (error) {
      this.logger.error('SendResetPasswordCode error', error);
      throw error;
    }
  }

  async verifyEmailCode(
    context: any,
    verificationId: string,
    code: string,
  ): Promise<EmailVerificationStatus> {
    const transaction = await this.verificationRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const verification = await this.verificationRepo.findById(verificationId);
      if (!verification)
        throw new HttpErrors.NotFound('Verification record not found');
      if (verification.code !== code)
        throw new HttpErrors.Conflict('Invalid code. Please try again');
      await this.verificationRepo.updateById(
        verificationId,
        {status: VerificationStatus.VERIFIED},
        {transaction},
      );
      const user = await this.userRepo.findOne({
        where: {username: verification.email.toLowerCase()},
      });
      if (!user) throw new HttpErrors.NotFound('user with email not found');
      await this.userRepo.updateById(
        user.id,
        {
          verificationStatus: VerificationStatus.VERIFIED,
          updatedAt: new Date().toString(),
        },
        {transaction},
      );
      await transaction.commit();
      return {
        status: VerificationStatus.VERIFIED,
        verificationId: verification.id,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('VerifyEmailCodeError', error);
      throw error;
    }
  }

  async resendEmailVerificationCode(
    context: any,
    verificationId: string,
  ): Promise<EmailVerificationStatus> {
    try {
      const verification = await this.verificationRepo.findById(verificationId);
      if (!verification)
        throw new HttpErrors.NotFound('Verification record not found');
      const code = this.utilService.generateRandomNumber(4);

      if (process?.env?.NODE_ENV) {
        await this.mailService.sendEmailVerificationCode(
          verification.email,
          code,
        );
      }
      await this.verificationRepo.updateById(verificationId, {
        status: VerificationStatus.CODE_SENT,
        code,
      });
      return {status: VerificationStatus.CODE_SENT, verificationId};
    } catch (error) {
      this.logger.error('ResendEmailVerificationCodeError', error);
      throw error;
    }
  }

  async resendPasswordResetCode(
    context: any,
    verificationId: string,
  ): Promise<EmailVerificationStatus> {
    try {
      const verification = await this.verificationRepo.findById(verificationId);
      if (!verification)
        throw new HttpErrors.NotFound('Verification record not found');
      const profile = await this.profileRepo.findOne({
        where: {email: verification.email.toLowerCase()},
      });
      if (!profile)
        throw new HttpErrors.NotFound('Profile does not exist with email');

      const code = this.utilService.generateRandomNumber(4);
      if (process?.env?.NODE_ENV) {
        await this.mailService.sendPasswordResetEmail(
          verification.email,
          code,
          `${profile.firstName} ${profile.lastName}`,
        );
      }
      await this.verificationRepo.updateById(verificationId, {
        status: VerificationStatus.RESET_PASSWORD_CODE_SENT,
        code,
      });

      return {
        status: VerificationStatus.RESET_PASSWORD_CODE_SENT,
        verificationId,
      };
    } catch (error) {
      this.logger.error('ResendPasswordCodeError', error);
      throw error;
    }
  }
}
