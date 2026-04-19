// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  RioProfileRepository,
  UniversityProfileRepository,
  UniversityRioRepository,
  UserRepository,
} from '../repositories';
import {Roles, Success, VerificationStatus} from '../schema';
import {AddRioToUniInput, RioProfileInput} from '../schema/inputs';
import {RioProfile, RioProfilesData} from '../schema/rio.type';
import {
  HasherService,
  JwtService,
  SmtpMailService,
  UtilService,
} from '../services';

export class RioController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(RioProfileRepository)
    private rioProfileRepo: RioProfileRepository,

    @repository(UniversityRioRepository)
    private universityRioRepository: UniversityRioRepository,
    @repository(UserRepository)
    private userRepo: UserRepository,

    @service(HasherService)
    private hasherService: HasherService,

    @service(UtilService)
    private utilService: UtilService,

    @service(SmtpMailService)
    private mailService: SmtpMailService,

    @service(JwtService)
    private jwtService: JwtService,
    @repository(UniversityProfileRepository)
    private universityProfileRepository: UniversityProfileRepository,
  ) {}

  async createAllUserAndProfile(
    context: any,
    rioProfiles: AddRioToUniInput[],
    universityProfileId: string,
  ): Promise<RioProfile[]> {
    const transaction = await this.rioProfileRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const rioProfileList: RioProfile[] = [];
      const rioCreatedDetails: {
        username: string;
        password: string;
        firstName: string;
        lastName: string;
        id: string;
      }[] = [];
      for (const rio of rioProfiles) {
        const {email, firstName, lastName} = rio;
        const username = email.toLowerCase();
        const exists = await this.userRepo.findOne({where: {username}});
        if (exists)
          throw new HttpErrors.Conflict(
            `User already exists with same email used for rio account ${username}`,
          );
        const randomPassword = this.utilService.generateRandomNumber(8);

        const password = await this.hasherService.hashPassword(randomPassword);
        const rioCreated = await this.userRepo.create(
          {
            username,
            password,
            roleId: Roles.RIO,
            verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
          },
          {transaction},
        );

        rioCreatedDetails.push({
          password: randomPassword,
          username,
          firstName,
          lastName,
          id: rioCreated.id,
        });

        const rioProfile = await this.rioProfileRepo.create(
          {
            email: username,
            firstName: firstName,
            lastName: lastName,
            // universityProfileId,
            userId: rioCreated.id,
          },
          {transaction},
        );
        rioProfileList.push(rioProfile);
      }
      await transaction.commit();

      for (const rio of rioCreatedDetails) {
        const {username, id, firstName, lastName} = rio;
        const jwtSetPasswordToken =
          await this.jwtService.generateSetupPasswordToken({
            userId: id,
            email: username,
          });
        try {
          const RIO_PORTAL_BASE_URL =
            process.env.ADMIN_BASE_URL ?? 'http://eduapply-admin.doerz.dev/';

          await this.mailService.sendSetupPasswordLink({
            name: `${firstName || ''} ${lastName || ''}`,
            to: username,
            //foronted should have a route to setup-student-password with param token
            link: `${RIO_PORTAL_BASE_URL}/setup-rio-password?token=${jwtSetPasswordToken}`,
          });
        } catch (error) {
          this.logger.error(error);
        }

        // this.mailService.sendPasswordAndEmail({
        //   name: `${firstName || ''} ${lastName || ''}`,
        //   password: rio?.password,
        //   to: rio?.username,
        // });
      }
      return rioProfileList;
    } catch (error) {
      await transaction.rollback();

      this.logger.error('create rio user', error);
      throw error;
    }
  }

  // async addRioProfile(
  //   context: any,
  //   rioProfileInput: RioProfileInput,
  // ): Promise<RioProfile> {
  //   const transaction = await this.rioProfileRepo.dataSource.beginTransaction(
  //     IsolationLevel.READ_COMMITTED,
  //   );
  //   try {
  //     const {email, firstName, lastName} = rioProfileInput;
  //     const universityProfile = await this.universityProfileRepository.findById(
  //       rioProfileInput?.universityProfileId,
  //     );
  //     if (!universityProfile)
  //       throw HttpErrors.NotFound('university does not exist');

  //     const rioUser = await this.userRepo.findOne({where: {username: email}});
  //     if (rioUser)
  //       throw new HttpErrors.Conflict(
  //         `User already exists with same email used for rio account ${email}`,
  //       );

  //     const randomPassword = this.utilService.generateRandomNumber(8);
  //     const password = await this.hasherService.hashPassword(randomPassword);
  //     const rioCreated = await this.userRepo.create(
  //       {
  //         username: email,
  //         password,
  //         roleId: Roles.RIO,
  //         verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
  //       },
  //       {transaction},
  //     );
  //     const rioProfile = await this.rioProfileRepo.create({
  //       ...rioProfileInput,
  //       userId: rioCreated.id,
  //       universityProfileId: rioProfileInput.universityProfileId,
  //     });
  //     await transaction.commit();
  //     const jwtSetPasswordToken =
  //       await this.jwtService.generateSetupPasswordToken({
  //         userId: rioCreated?.id,
  //         email: email,
  //       });
  //     try {
  //       const RIO_PORTAL_BASE_URL =
  //         process.env.ADMIN_BASE_URL ?? 'http://eduapply-admin.doerz.dev/';

  //       await this.mailService.sendSetupPasswordLink({
  //         name: `${firstName || ''} ${lastName || ''}`,
  //         to: email,
  //         //foronted should have a route to setup-student-password with param token
  //         link: `${RIO_PORTAL_BASE_URL}/setup-rio-password?token=${jwtSetPasswordToken}`,
  //       });
  //     } catch (error) {
  //       this.logger.error(error);
  //     }

  //     return rioProfile;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
  async addRio(
    context: any,
    rioProfileInput: RioProfileInput,
  ): Promise<RioProfile> {
    const transaction = await this.rioProfileRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const {email, firstName, lastName} = rioProfileInput;
      // const universityProfile = await this.universityProfileRepository.findById(
      //   rioProfileInput.universityProfileId,
      // );
      // if (!universityProfile)
      //   throw HttpErrors.NotFound('university does not exist');

      const rioUser = await this.userRepo.findOne({where: {username: email}});
      if (rioUser)
        throw new HttpErrors.Conflict(
          `User already exists with same email used for rio account ${email}`,
        );

      const randomPassword = this.utilService.generateRandomNumber(8);

      const password = await this.hasherService.hashPassword(randomPassword);

      const rioCreated = await this.userRepo.create(
        {
          username: email,
          password,
          roleId: Roles.RIO,
          verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
        },
        {transaction},
      );
      const rioProfile = await this.rioProfileRepo.create({
        ...rioProfileInput,
        userId: rioCreated.id,
      });
      await transaction.commit();
      const jwtSetPasswordToken =
        await this.jwtService.generateSetupPasswordToken({
          userId: rioCreated?.id,
          email: email,
        });
      try {
        const RIO_PORTAL_BASE_URL =
          process.env.ADMIN_BASE_URL ?? 'http://eduapply-admin.doerz.dev/';

        await this.mailService.sendSetupPasswordLink({
          name: `${firstName || ''} ${lastName || ''}`,
          to: email,
          //foronted should have a route to setup-student-password with param token
          link: `${RIO_PORTAL_BASE_URL}/setup-rio-password?token=${jwtSetPasswordToken}`,
        });
      } catch (error) {
        this.logger.error(error);
      }

      return rioProfile;
    } catch (err) {
      throw err;
    }
  }
  async edit(
    context: any,
    rioProfileid: string,
    rioProfileInput: RioProfileInput,
  ): Promise<RioProfile> {
    const transaction = await this.rioProfileRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const rioProfile = await this.rioProfileRepo.findById(rioProfileid);
      if (!rioProfile)
        throw new HttpErrors.NotFound(
          `Rio profile with id ${rioProfileid} not found`,
        );

      const {email, firstName, lastName} = rioProfileInput;
      const username = email.toLowerCase();

      if (username !== rioProfile.email) {
        const exists = await this.userRepo.findOne({where: {username}});
        if (exists)
          throw new HttpErrors.Conflict(
            `User already exists with same email used for rio account ${username}`,
          );
        const updateUserEmail = await this.userRepo.updateById(
          rioProfile.userId,
          {username},
          {transaction},
        );
      }

      const updatedProfile = await this.rioProfileRepo.updateById(
        rioProfileid,
        {
          firstName,
          lastName,
          email: username,
          updatedAt: Date.now(),
        },
        {transaction},
      );

      await transaction.commit();

      return {
        ...rioProfile,
        email: username,
        firstName,
        lastName,
        updatedAt: new Date(Date.now()),
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('editCourse', error);
      throw error;
    }
  }

  async deleteById(context: any, rioProfileId: string): Promise<Success> {
    const transaction = await this.rioProfileRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const rioProfile = await this.rioProfileRepo.findById(rioProfileId);

      if (!rioProfile)
        throw new HttpErrors.NotFound(
          `Rio profile with id ${rioProfileId} not found`,
        );
      const rioUser = await this.userRepo.findOne({
        where: {username: rioProfile.email},
      });
      if (!rioUser) throw HttpErrors.NotFound(`Rio user  not found`);
      await this.userRepo.deleteById(rioUser.id, {transaction});
      await this.rioProfileRepo.deleteById(rioProfileId, {transaction});

      await this.universityRioRepository.deleteAll({rioProfileId});
      await transaction.commit();
      return {
        success: true,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('rio deleteById', error);
      throw error;
    }
  }

  async getRios(context: any): Promise<RioProfilesData> {
    try {
      const rioProfiles = await this.rioProfileRepo.find();
      const total = await this.rioProfileRepo.count();
      return {rioProfiles, total: total.count};
    } catch (err) {
      throw err;
    }
  }

  async getRio(context: any, rioId: string): Promise<RioProfile> {
    try {
      const rioProfile = await this.rioProfileRepo.findById(rioId);
      if (!rioProfile) throw HttpErrors.NotFound('Rio profile not found');

      return rioProfile;
    } catch (err) {
      throw err;
    }
  }

  async assignRio(
    context: any,
    universityId: string,
    rioId: string,
  ): Promise<Success> {
    try {
      const universityProfile = await this.universityProfileRepository.findById(
        universityId,
      );
      if (!universityProfile)
        throw HttpErrors.NotFound('University profile not found');
      const rioProfile = await this.rioProfileRepo.findById(rioId);
      if (!rioProfile) throw HttpErrors.NotFound('Rio profile not found');

      await this.universityRioRepository.create({
        universityProfileId: universityId,
        rioProfileId: rioId,
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async deleteAssignRio(
    context: any,
    universityId: string,
    rioId: string,
  ): Promise<Success> {
    try {
      const universityProfile = await this.universityProfileRepository.findById(
        universityId,
      );
      if (!universityProfile)
        throw HttpErrors.NotFound('University profile not found');
      const rioProfile = await this.rioProfileRepo.findById(rioId);
      if (!rioProfile) throw HttpErrors.NotFound('Rio profile not found');

      const universityRio = await this.universityRioRepository.findOne({
        where: {
          and: [{universityProfileId: universityId}, {rioProfileId: rioId}],
        },
      });
      if (!universityRio)
        throw HttpErrors.NotFound(
          'rio not assigned to this university not found',
        );

      await this.universityRioRepository.deleteById(universityRio.id);
      return {success: true};
    } catch (err) {
      throw err;
    }
  }
}
