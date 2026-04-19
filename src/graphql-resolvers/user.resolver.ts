import {Success} from './../schema/generic.type';
import {UpdateInfoOutput} from './../schema/user.type';

import {inject} from '@loopback/core';
import {
  arg,
  authorized,
  GraphQLBindings,
  mutation,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {UserController} from '../controllers';
import {AuthenticatedUser, Roles, SignupAdmin} from '../schema';
import {
  CreateAdminUserInput,
  CredentialsInput,
  ResetPasswordInput,
  UpdateUserInput,
} from '../schema/inputs';
@resolver()
export class UserResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.UserController')
    private userController: UserController,
  ) {}

  @query(returns => String)
  async ping(): Promise<String> {
    return 'pong';
  }

  @mutation(returns => SignupAdmin)
  async adminSignup(
    @arg('user') user: CreateAdminUserInput,
  ): Promise<SignupAdmin> {
    return this.userController.adminSignUp(this.resolverData.context, user);
  }

  @mutation(returns => AuthenticatedUser)
  async loginAdmin(
    @arg('credentials') credentials: CredentialsInput,
  ): Promise<AuthenticatedUser> {
    return this.userController.loginAdmin(
      this.resolverData.context,
      credentials,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
    Roles.STUDENT,
  ])
  @mutation(returns => UpdateInfoOutput)
  async infoUpdate(
    @arg('userInfo') userInfo: UpdateUserInput,
  ): Promise<UpdateInfoOutput> {
    return this.userController.updateUserInfo(
      this.resolverData.context,
      userInfo,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
    Roles.STUDENT,
  ])
  @query(returns => UpdateInfoOutput)
  async getInfo(): Promise<UpdateInfoOutput> {
    return this.userController.getUserInfo(this.resolverData.context);
  }
  @mutation(returns => Success)
  async resetPassword(
    @arg('resetPassword') resetPasswordInput: ResetPasswordInput,
  ): Promise<Success> {
    return this.userController.resetPassword(
      this.resolverData.context,
      resetPasswordInput,
    );
  }

  @mutation(returns => Success)
  async setupPassword(
    @arg('newPassword') newPassword: string,
    @arg('token') token: string,
  ): Promise<Success> {
    return this.userController.setupPassword(
      this.resolverData.context,
      newPassword,
      token,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
    Roles.STUDENT,
  ])
  @mutation(returns => Success)
  async changeUserPassword(
    @arg('currentPassword') currentPassword: string,
    @arg('newPassword')
    newPassword: string,
  ): Promise<Success> {
    return this.userController.changePassword(
      this.resolverData.context,
      currentPassword,
      newPassword,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
    Roles.STUDENT,
  ])
  @mutation(returns => Success)
  async updatePassword(
    @arg('currentPassword') currentPassword: string,
    @arg('newPassword')
    newPassword: string,
  ): Promise<Success> {
    return this.userController.updatePassword(
      this.resolverData.context,
      currentPassword,
      newPassword,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
    Roles.STUDENT,
  ])
  @mutation(returns => Success)
  async updateRegistrationToken(
    @arg('registrationToken') registrationToken: string,
  ): Promise<Success> {
    return this.userController.updateRegistrationToken(
      this.resolverData.context,
      registrationToken,
    );
  }
}
