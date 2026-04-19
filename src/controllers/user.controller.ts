import {RioProfileRepository} from './../repositories/rio-profile.repository';
// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  Profile,
  ProfileRelations,
  RioProfile,
  RioProfileRelations,
  User,
} from '../models';
import {
  AgentProfileRepository,
  ProfileRepository,
  StaffProfileRepository,
  StudentProfileRepository,
  UserRepository,
  VerificationRepository,
} from '../repositories';
import {
  AuthenticatedUser,
  BooleanResult,
  Roles,
  SignupAdmin,
  Success,
  UpdateInfoOutput,
  VerificationStatus,
} from '../schema';
import {
  CreateAdminUserInput,
  CredentialsInput,
  ResetPasswordInput,
  UpdateUserInput,
} from '../schema/inputs';
import {HasherService, JwtService, MyUserService} from '../services';
import {VerificationController} from './verification.controller';

export class UserController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @repository(ProfileRepository)
    private profileRepo: ProfileRepository,
    @repository(StaffProfileRepository)
    private staffProfileRepository: StaffProfileRepository,

    @repository(AgentProfileRepository)
    private agentProfileRepository: AgentProfileRepository,

    @repository(VerificationRepository)
    private verificationRepo: VerificationRepository,

    @repository(RioProfileRepository)
    private rioProfileRepo: RioProfileRepository,

    @repository(StudentProfileRepository)
    private studentProfileRepo: StudentProfileRepository,

    @inject('controllers.VerificationController')
    private verificationController: VerificationController,

    @service(HasherService)
    private hasherService: HasherService,

    @service(MyUserService)
    private userService: MyUserService,

    @service(HasherService)
    public hasher: HasherService,

    @service(JwtService)
    private jwtService: JwtService,
  ) { }

  async adminSignUp(
    context: any,
    userInput: CreateAdminUserInput,
  ): Promise<SignupAdmin> {
    const transaction = await this.userRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const {firstName, lastName, superAdminSecret} = userInput;
      const username = userInput.username.toLowerCase();
      if (superAdminSecret !== process.env.SUPER_ADMIN_SECRET ?? '123QWEasd!@#')
        throw new HttpErrors.Forbidden('something went wrong try again');
      const user = await this.userRepo.findOne({where: {username}});

      const password = await this.hasherService.hashPassword(
        userInput.password,
      );
      let newUser: User | null = null;
      let adminProfile: Profile | null = null;
      const userVerificationStatus = user?.verificationStatus || 'NOT_ASSIGNED';
      switch (userVerificationStatus) {
        case VerificationStatus.NOT_ASSIGNED:
          newUser = await this.userRepo.create(
            {
              username,
              password,
              roleId: Roles.ADMIN,
              verificationStatus: VerificationStatus.CODE_SENT,
            },
            {transaction},
          );
          const lastRecord = await this.profileRepo.findOne({
            order: ['adminNumber DESC'],
          });
          adminProfile = await this.profileRepo.create(
            {
              firstName,
              lastName,
              adminNumber: lastRecord ? lastRecord.adminNumber + 1 : 1,
              email: userInput.username,
              userId: newUser.id,
            },
            {transaction},
          );
          await this.verificationController.sendEmailVerificationCode(
            context,
            username,
          );
          break;
        case VerificationStatus.VERIFIED:
        case VerificationStatus.RESET_PASSWORD_CODE_SENT:
          throw new HttpErrors.Conflict(
            'User with the same email address already exists',
          );
        case VerificationStatus.FAILED:
        case VerificationStatus.CODE_SENT:
          throw new HttpErrors.Forbidden('Please verify your account');
      }
      if (!newUser || !adminProfile)
        throw new HttpErrors.InternalServerError(
          'Something went wrong, try again later',
        );
      const securityProfile = this.userService.convertToUserProfile(newUser);
      const token = await this.jwtService.generateToken(securityProfile);
      await transaction.commit();
      return {
        //@ts-ignore
        user: newUser,
        success: true,
        token: token,
        adminProfile,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('SignUpError', error);
      throw error;
    }
  }

  async loginAdmin(
    context: any,
    credentials: CredentialsInput,
  ): Promise<AuthenticatedUser> {
    try {
      const user = await this.userService.verifyCredentials(credentials);
      const securityProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(securityProfile);
      let adminProfile: (Profile & ProfileRelations) | null = null;
      let rioProfile: (RioProfile & RioProfileRelations) | null = null;
      if (user.roleId === Roles.RIO) {
        rioProfile = await this.rioProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!rioProfile)
          throw new HttpErrors.NotFound(
            `Rio Profile does not exist for ${credentials.username}`,
          );
      } else {
        adminProfile = await this.profileRepo.findOne({
          where: {userId: user.id},
        });
        if (!adminProfile)
          throw new HttpErrors.NotFound(
            `Admin Profile does not exist for ${credentials.username}`,
          );
      }
      return {
        //@ts-ignore
        user: user,
        token,
        adminProfile: adminProfile || undefined,
        rioProfile: rioProfile || undefined,
      };
    } catch (error) {
      this.logger.error('LoginError', error);
      throw error;
    }
  }

  async updateUserInfo(
    context: any,
    userInfo: UpdateUserInput,
  ): Promise<UpdateInfoOutput> {
    try {
      const {username, firstName, lastName, photo} = userInfo;
      const user: User = context.user;
      const userProfile = await this.userRepo.findById(user.id);
      if (!userProfile) throw HttpErrors.NotFound('user not found');

      await this.userRepo.updateById(user.id, {
        username,
        updatedAt: Date.now(),
      });
      if (user.roleId === Roles.STUDENT) {
        const student = await this.studentProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!student) throw HttpErrors.NotFound('Student not found');

        await this.studentProfileRepo.updateById(student.id, {
          email: username,
          firstname: firstName,
          lastname: lastName,
          photo: photo,
          updatedAt: Date.now(),
        });
        const studentProfile = await this.studentProfileRepo.findById(
          student.id,
        );
        //@ts-ignore
        return {user: userProfile, studentProfile: studentProfile};
      } else if (user.roleId === Roles.ADMIN) {
        const admin = await this.profileRepo.findOne({
          where: {userId: user.id},
        });
        if (!admin) throw HttpErrors.NotFound('Admin not found');
        // await this.userRepo.updateById(user.id, {
        //   username,
        //   updatedAt: Date.now(),
        // });
        await this.profileRepo.updateById(admin.id, {
          email: username,
          firstName: firstName,
          lastName: lastName,
          photo: photo,
          updatedAt: Date.now(),
        });
        const adminProfile = await this.profileRepo.findById(admin.id);

        //@ts-ignore
        return {user: userProfile, adminProfile: adminProfile};
      } else if (user.roleId === Roles.RIO) {
        const rio = await this.rioProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!rio) throw HttpErrors.NotFound('Rio not found');

        await this.rioProfileRepo.updateById(rio.id, {
          email: username,
          firstName: firstName,
          lastName: lastName,
          photo,
          updatedAt: Date.now(),
        });
        const rioProfile = await this.rioProfileRepo.findById(rio.id);

        //@ts-ignore
        return {user: userProfile, rioProfile};
      } else if (user.roleId === Roles.AGENT) {
        const agent = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agent) throw HttpErrors.NotFound('Agent not found');
        // await this.userRepo.updateById(user.id, {
        //   username,
        //   updatedAt: Date.now(),
        // });
        await this.agentProfileRepository.updateById(agent.id, {
          name: `${firstName} ${lastName}`,
          email: username,

          photo: photo,

          updatedAt: Date.now(),
        });
        const agentProfile = await this.agentProfileRepository.findById(
          agent.id,
        );
        //@ts-ignore
        return {user: userProfile, agentProfile};
      } else if (user?.roleId === Roles.STAFF) {
        const staff = await this.staffProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!staff) throw HttpErrors.NotFound('staff not found');
        // await this.userRepo.updateById(user.id, {
        //   username,
        //   updatedAt: Date.now(),
        // });
        await this.staffProfileRepository.updateById(staff.id, {
          name: `${firstName} ${lastName}`,
          workEmail: username,
          photo: photo,

          updatedAt: Date.now(),
        });
        const staffProfile = await this.staffProfileRepository.findById(
          staff.id,
        );
        //@ts-ignore
        return {user: userProfile, staffProfile};
      } else {
        return {
          //@ts-ignore
          user: userProfile,
        };
      }
    } catch (error) {
      this.logger.error('LoginError', error);
      throw error;
    }
  }

  async getUserInfo(context: any): Promise<UpdateInfoOutput> {
    try {
      const user: User = context.user;
      const userProfile = await this.userRepo.findById(user.id);

      if (user.roleId === Roles.STUDENT) {
        const student = await this.studentProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!student) throw HttpErrors.NotFound('Student not found');

        const studentProfile = await this.studentProfileRepo.findById(
          student.id,
        );
        //@ts-ignore
        return {user: userProfile, studentProfile: studentProfile};
      } else if (user.roleId === Roles.ADMIN) {
        const admin = await this.profileRepo.findOne({
          where: {userId: user.id},
        });
        if (!admin) throw HttpErrors.NotFound('Admin not found');
        // await this.userRepo.updateById(user.id, {
        //   username,
        //   updatedAt: Date.now(),
        // });

        const adminProfile = await this.profileRepo.findById(admin.id);

        //@ts-ignore
        return {user: userProfile, adminProfile: adminProfile};
      } else if (user.roleId === Roles.RIO) {
        const rio = await this.rioProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!rio) throw HttpErrors.NotFound('Rio not found');

        const rioProfile = await this.rioProfileRepo.findById(rio.id);

        //@ts-ignore
        return {user: userProfile, rioProfile};
      } else if (user.roleId === Roles.AGENT) {
        const agent = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agent) throw HttpErrors.NotFound('Agent not found');

        const agentProfile = await this.agentProfileRepository.findById(
          agent.id,
        );
        //@ts-ignore
        return {user: userProfile, agentProfile};
      } else if (user.roleId === Roles.STAFF) {
        const staff = await this.staffProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!staff) throw HttpErrors.NotFound('staff not found');

        const staffProfile = await this.staffProfileRepository.findById(
          staff.id,
        );
        //@ts-ignore
        return {user: userProfile, staffProfile};
      } else {
        return {
          //@ts-ignore
          user: userProfile,
        };
      }
    } catch (error) {
      this.logger.error('LoginError', error);
      throw error;
    }
  }
  async resetPassword(
    context: any,
    ResetPasswordInput: ResetPasswordInput,
  ): Promise<Success> {
    try {
      const {username, newPassword, verificationId} = ResetPasswordInput;
      const user = await this.userRepo.findOne({where: {username}});
      if (!user)
        throw new HttpErrors.NotFound('No user found for given email address');

      const verification = await this.verificationRepo.findById(verificationId);
      if (!verification || verification.status !== 'VERIFIED')
        throw new HttpErrors.Conflict('Verification Error');

      const newPwd = newPassword;
      const pwdHash = await this.hasherService.hashPassword(newPwd);
      await this.userRepo.updateById(user.id, {password: pwdHash});
      return {success: true};
    } catch (error) {
      this.logger.error('ResetPasswordError', error);
      throw error;
    }
  }

  async changePassword(
    context: any,
    currentPassword: string,
    newPassword: string,
  ): Promise<Success> {
    try {
      const contextUser: User = context.user;
      const user = await this.userRepo.findById(contextUser.id);
      if (!user) throw HttpErrors.NotFound('User not found');

      const passwordMatched = await this.hasher.comparePassword(
        currentPassword,
        user.password,
      );
      if (!passwordMatched)
        throw HttpErrors.Forbidden('Invalid current password');
      const pwdHash = await this.hasherService.hashPassword(newPassword);
      await this.userRepo.updateById(user.id, {
        password: pwdHash,
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async updatePassword(
    context: any,
    currentPassword: string,
    newPassword: string,
  ): Promise<Success> {
    try {
      const contextUser: User = context.user;
      const user = await this.userRepo.findById(contextUser.id);
      if (!user) throw HttpErrors.NotFound('User not found');

      const passwordMatched = await this.hasher.comparePassword(
        currentPassword,
        user.password,
      );
      if (!passwordMatched)
        throw HttpErrors.Forbidden('Invalid current password');
      const pwdHash = await this.hasherService.hashPassword(newPassword);
      await this.userRepo.updateById(user.id, {
        password: pwdHash,
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }
  async setupPassword(
    context: any,
    newPassword: string,
    jwtToken: string,
  ): Promise<Success> {
    try {
      //decode user from jwt token
      const contextUser = await this.jwtService.verifySetupPasswordToken(
        jwtToken,
      );

      const user = await this.userRepo.findById(contextUser.userId);

      if (!user) throw new HttpErrors.NotFound('No user found');
      const pwdHash = await this.hasherService.hashPassword(newPassword);
      await this.userRepo.updateById(user.id, {
        password: pwdHash,
        verificationStatus: VerificationStatus.VERIFIED,
      });

      return {success: true};
    } catch (error) {
      this.logger.error('setupPasswordError', error);
      throw error;
    }
  }

  async checkIfUserExist(
    context: any,
    username: string,
  ): Promise<BooleanResult> {
    try {
      const user = await this.userRepo.findOne({where: {username}});
      return {result: !!user};
    } catch (error) {
      this.logger.error('CheckIfUserExistError', error);
      throw error;
    }
  }
  async updateRegistrationToken(
    context: any,
    registrationToken: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;

   
      await this.userRepo.updateById(user.id, {
        registrationToken,
        updatedAt: Date.now(),
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }
}
