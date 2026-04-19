import {inject} from '@loopback/core';
import {
  arg,
  GraphQLBindings,
  ID,
  mutation,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {VerificationController} from '../controllers';
import {EmailVerificationStatus, ResetPasswordCodeStatus} from '../schema';

@resolver()
export class VerificationResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.VerificationController')
    private verificationController: VerificationController,
  ) {}

  @mutation(returns => EmailVerificationStatus)
  async sendEmailVerificationCode(
    @arg('email') email: string,
  ): Promise<EmailVerificationStatus> {
    return this.verificationController.sendEmailVerificationCode(
      this.resolverData.context,
      email,
    );
  }

  @mutation(returns => ResetPasswordCodeStatus)
  async sendPasswordResetCode(
    @arg('email') email: string,
  ): Promise<ResetPasswordCodeStatus> {
    return this.verificationController.sendPasswordResetCode(
      this.resolverData.context,
      email,
    );
  }

  @mutation(returns => EmailVerificationStatus)
  async verifyEmailCode(
    @arg('verificationId', type => ID) verificationId: string,
    @arg('code') code: string,
  ): Promise<EmailVerificationStatus> {
    return this.verificationController.verifyEmailCode(
      this.resolverData.context,
      verificationId,
      code,
    );
  }

  @mutation(returns => EmailVerificationStatus)
  async resendEmailVerificationCode(
    @arg('verificationId', type => ID) verificationId: string,
  ): Promise<EmailVerificationStatus> {
    return this.verificationController.resendEmailVerificationCode(
      this.resolverData.context,
      verificationId,
    );
  }

  @mutation(returns => EmailVerificationStatus)
  async resendPasswordResetCode(
    @arg('verificationId', type => ID) verificationId: string,
  ): Promise<EmailVerificationStatus> {
    return this.verificationController.resendPasswordResetCode(
      this.resolverData.context,
      verificationId,
    );
  }
}
