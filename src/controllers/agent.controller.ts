import {AgentProfile} from './../models/agent-profile.model';
import {VerificationRepository} from './../repositories/verification.repository';
import {Success} from './../schema/generic.type';
import {VerificationController} from './verification.controller';
// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Documents, User} from '../models';
import {
  AgentProfileRepository,
  AgentStudentRepository,
  DocumentsRepository,
  StaffProfileRepository,
  StudentProfileRepository,
  StudentStaffRepository,
  StudentsAgentsEnrollmentRepository,
  UserRepository,
} from '../repositories';
import {
  AgentData,
  AgentProfile as AgentProfileSchema,
  AgentSignUp,
  AgentsData,
  AuthenticatedUser,
  ResCompleteAgentProfile,
  ResCompleteStaffProfile,
  Roles,
  StaffProfile,
  Staffs,
  VerificationStatus,
  verifyToken,
} from '../schema';
import {
  CompleteEditAgentInput,
  CreateAgentData,
  CreateAgentUserInput,
  CredentialsInput,
  EditAgentInput,
  Filter,
  ReviewAgentInput,
  createStaffData,
} from '../schema/inputs';
import {
  HasherService,
  JwtService,
  MyUserService,
  SmtpMailService,
  UtilService,
} from '../services';

export class AgentController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,
    @repository(VerificationRepository)
    private verificationRepo: VerificationRepository,
    @repository(AgentStudentRepository)
    private agentStudentRepo: AgentStudentRepository,

    @repository(StudentsAgentsEnrollmentRepository)
    private studentsAgentsEnrollmentRepo: StudentsAgentsEnrollmentRepository,

    @repository(StudentProfileRepository)
    private studentProfileRepo: StudentProfileRepository,

    @repository(StudentStaffRepository)
    private studentStaffRepo: StudentStaffRepository,

    @service(HasherService)
    private hasherService: HasherService,

    @inject('controllers.VerificationController')
    private verificationController: VerificationController,

    @repository(AgentProfileRepository)
    private agentProfileRepository: AgentProfileRepository,
    @repository(StaffProfileRepository)
    private staffProfileRepository: StaffProfileRepository,
    @repository(DocumentsRepository)
    private documentsRepository: DocumentsRepository,

    @service(UtilService)
    private utilService: UtilService,

    @service(SmtpMailService)
    private mailService: SmtpMailService,
    @service(MyUserService)
    private userService: MyUserService,

    @service(JwtService)
    private jwtService: JwtService,
  ) {}

  async agentSignUp(
    context: any,
    agentData: CreateAgentUserInput,
  ): Promise<verifyToken> {
    const transaction =
      await this.agentProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const {email, firstName, lastName} = agentData;
      const user = await this.userRepo.findOne({where: {username: email}});
      if (user) {
        throw new HttpErrors.Forbidden('user already exist');
      }
      const password = await this.hasherService.hashPassword(
        agentData.password,
      );

      const lastRecord = await this.agentProfileRepository.findOne({
        order: ['agentnumber DESC'],
      });

      let newUser = await this.userRepo.create(
        {
          username: email,
          password: password,
          roleId: Roles.AGENT,
          verificationStatus: VerificationStatus.CODE_SENT,
        },
        transaction,
      );
      if (!newUser) throw new HttpErrors.Forbidden('Error User Creation');

      let newAgentProfile = await this.agentProfileRepository.create(
        {
          email,
          userId: newUser?.id,
          name: `${firstName} ${lastName}`,
          agentNumber: lastRecord ? lastRecord.agentNumber + 1 : 1,
        },
        transaction,
      );

      const verificationData =
        await this.verificationController.sendEmailVerificationCode(
          context,
          email,
        );
      const otpToken = await this.jwtService.generateTokenForOTP({
        userId: newUser?.id,
        verificationID: verificationData.verificationId,
      });

      await transaction.commit();
      return {token: otpToken, success: true};
    } catch (error) {
      await transaction.rollback();

      this.logger.error('SignUpError', error);
      throw error;
    }
  }

  async verifyAgent(
    context: any,
    otp: string,
    token: string,
  ): Promise<AgentSignUp> {
    try {
      const decodedToken = await this.jwtService.verifyAgentToken(token);

      const user = await this.userRepo.findById(decodedToken.userId);
      const otpStatus = await this.verificationRepo.find({
        where: {id: decodedToken.verificationID},
      });

      if (otp === otpStatus[0].code) {
        await this.userRepo.updateById(user.id, {
          verificationStatus: VerificationStatus.VERIFIED,
        });
      } else {
        throw new HttpErrors.InternalServerError('otp not verfied');
      }
      // return decodedToken;
      let newUser = await this.userRepo.findOne({where: {id: user.id}});

      let newAgentProfile = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });
      if (!newAgentProfile?.id) throw new HttpErrors.Forbidden('not found');
      const securityProfile = this.userService.convertToUserProfile(user);
      const signinToken = await this.jwtService.generateToken(securityProfile);

      return {
        // @ts-ignore
        user: newUser,
        success: true,
        token: signinToken,
        agentsProfile: {...newAgentProfile},
      };
    } catch (err) {
      this.logger.error('VerifySignupError', err);
      throw err;
    }
  }

  async login(
    context: any,
    credentials: CredentialsInput,
  ): Promise<AuthenticatedUser> {
    try {
      const user = await this.userService.verifyCredentials(credentials);
      if (!user) throw new HttpErrors.NotFound(`User not found`);
      const securityProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(securityProfile);
      if (user.roleId == Roles.AGENT) {
        let agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) {
          throw new HttpErrors.NotFound(`agent profile does  not found`);
        }
        return {
          //@ts-ignore
          user,
          agentProfile: {
            ...agentProfile,
          },
          token,
        };
      } else if (user.roleId == Roles.STAFF) {
        let staffProfile = await this.staffProfileRepository.findOne({
          where: {userId: user.id},
        });
        return {
          //@ts-ignore
          user,
          staffProfile: {
            ...staffProfile,
          },
          token,
        };
      }

      return {
        //@ts-ignore
        user,
        token,
      };
    } catch (err) {
      this.logger.error('LoginError', err);
      throw err;
    }
  }

  completeProfile = async (
    context: any,
    agentProfile: CompleteEditAgentInput,
    agentId: string,
  ): Promise<Success> => {
    const transaction =
      await this.agentProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const user: User = context.user;

      const agent = await this.agentProfileRepository.findById(agentId);
      if (user.id != agent.userId) {
        throw new HttpErrors.Forbidden(
          'You are not authorized to perform this action',
        );
      }

      await this.agentProfileRepository.updateById(agentId, {
        ...agentProfile,
        updatedAt: Date.now(),
      });

      return {
        success: true,
      };
    } catch (err) {
      throw err;
    }
  };

  async getAgentProfile(
    context: any,
    agentId: string,
  ): Promise<ResCompleteAgentProfile> {
    try {
      const user: User = context.user;
      const agent = await this.agentProfileRepository.findById(agentId);
      if (user.id != agent.userId) {
        throw new HttpErrors.Forbidden(
          " 'You are not authorized to perform this action',",
        );
      }
      if (!agent) {
        throw new HttpErrors.NotFound('not found');
      }
      return {id: user.id, agent};
    } catch (err) {
      this.logger.error('error getagent', err);
      throw err;
    }
  }
  async createAgent(
    context: any,
    agentData: CreateAgentData,
  ): Promise<AgentData> {
    const transaction =
      await this.agentProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const today = new Date();
      // const currentMonthIndex = today.getMonth();
      const {documents, email, name, ...resAgentDate} = agentData;
      const username = email.toLowerCase();
      const user = await this.userRepo.findOne({where: {username}});
      if (user)
        throw new HttpErrors.Conflict('User already exists with same email');
      //todo -->tokenized url
      const randomPassword = this.utilService.generateRandomNumber(8);

      const password = await this.hasherService.hashPassword(randomPassword);
      const newAgentUser = await this.userRepo.create(
        {
          username,
          password,
          roleId: Roles.AGENT,
          verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
        },
        {transaction},
      );
      const lastRecord = await this.agentProfileRepository.findOne({
        order: ['agentNumber DESC'],
      });
      const newAgentProfile = await this.agentProfileRepository.create(
        {
          ...resAgentDate,
          name: name,
          email: username,
          agentNumber: lastRecord?.agentNumber ? lastRecord.agentNumber + 1 : 1,
          userId: newAgentUser.id,
        },
        {transaction},
      );
      let createDocs: Documents[] = [];
      if (documents.length) {
        const docs = documents.map(url => ({url, userId: newAgentUser.id}));
        createDocs = await this.documentsRepository.createAll(docs, {
          transaction,
        });
      }

      await transaction.commit();
      if (!newAgentUser || !newAgentProfile)
        throw new HttpErrors.InternalServerError(
          'Something went wrong, try again later',
        );
      const jwtSetPasswordToken =
        await this.jwtService.generateSetupPasswordToken({
          userId: newAgentUser.id,
          email: username,
        });
      try {
        const AGENT_PORTAL_BASE_URL =
          process.env.AGENT_WEB_PORTAL_BASE_URL ??
          'http://eduapply-agent.doerz.dev/';

        await this.mailService.sendSetupPasswordLink({
          name: `${name}`,
          to: username,
          //foronted should have a route to setup-student-password with param token
          link: `${AGENT_PORTAL_BASE_URL}/setup-agent-password?token=${jwtSetPasswordToken}`,
        });
      } catch (error) {
        this.logger.error(error);
      }

      return {
        id: newAgentProfile.id,
        agentProfile: {
          ...newAgentProfile,
          //@ts-ignore
          status: newAgentProfile.status,
        },
        documents: createDocs,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('SignUpError', error);
      throw error;
    }
  }
  async createStaff(
    context: any,
    staffProfile: createStaffData,
  ): Promise<Success> {
    const transaction =
      await this.agentProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );

    try {
      const user: User = context.user;
      const agent = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });
      if (!agent) {
        throw new HttpErrors.Forbidden('agent not exist');
      }

      const password = this.utilService.generateRandomPassword(8);

      const hashedPassword = await this.hasherService.hashPassword(password);

      const staffuser = await this.userRepo.create(
        {
          username: staffProfile.workEmail,
          password: hashedPassword,
          roleId: Roles.STAFF,
          verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
        },
        {transaction},
      );

      await this.staffProfileRepository.create(
        {
          ...staffProfile,
          agentId: agent.id,
          userId: staffuser.id,
        },
        {transaction},
      );
      const jwtSetPasswordToken =
        await this.jwtService.generateSetupPasswordToken({
          userId: staffuser.id,
          email: staffProfile.workEmail,
        });

      await transaction.commit();
      try {
        const AGENT_PORTAL_BASE_URL =
          process.env.AGENT_WEB_PORTAL_BASE_URL ??
          'http://eduapply-agent.doerz.dev/';

        await this.mailService.sendSetupPasswordLink({
          name: staffProfile.name,
          to: staffProfile.workEmail,

          //foronted should have a route to setup-student-password with param token
          link: `${AGENT_PORTAL_BASE_URL}/setup-agent-password?token=${jwtSetPasswordToken}`,
        });
      } catch (error) {
        this.logger.error(error);
      }

      return {success: true};
    } catch (err) {
      throw err;
    }
  }
  async getStaffsProfile(
    context: any,
    offset: number,
    count: number,
    agentId?: string,
  ): Promise<Staffs> {
    try {
      const user: User = context.user;
      let staffs: StaffProfile[] = [];
      let total = {count: 0};

      if (agentId) {
        // FOR ADMIN
        const agent = await this.agentProfileRepository.findById(agentId);

        staffs = await this.staffProfileRepository.find({
          where: {agentId: agent.id},
          skip: offset,
          limit: count,
        });
        total = await this.staffProfileRepository.count({agentId: agent.id});
      } else if (user.roleId === Roles.AGENT) {
        const agent = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agent) throw HttpErrors.NotFound('agent not found');

        staffs = await this.staffProfileRepository.find({
          where: {agentId: agent.id},
          skip: offset,
          limit: count,
        });
        total = await this.staffProfileRepository.count({agentId: agent.id});
      }

      return {staffs, count: total.count};
    } catch (err) {
      throw err;
    }
  }
  async getStaffProfile(
    context: any,
    staffId: string,
  ): Promise<ResCompleteStaffProfile> {
    try {
      const user: User = context.user;

      const agent = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });

      if (user.id !== agent?.userId) {
        throw new HttpErrors.Forbidden(
          'You are not authorized to perform this action',
        );
      }

      const staff = await this.staffProfileRepository.findById(staffId, {
        include: [
          {
            relation: 'assignedStudents',
            scope: {
              include: [
                {
                  relation: 'schoolAttended',
                  scope: {include: [{relation: 'documents'}]},
                },
              ],
            },
          },
        ],
      });
      if (staff.agentId !== agent.id)
        throw HttpErrors.Forbidden(
          'You are not authorized to get this staff profile',
        );
      const {assignedStudents, ...restStaffInfo} = staff;
      let total = assignedStudents?.length || 0;

      if (!staff) throw HttpErrors.NotFound('Staff Profile Not Found');
      if (agent.id !== staff.agentId)
        throw HttpErrors.Forbidden('cannot get staff of other agent');
      return {
        staff: restStaffInfo,
        assignedStudents: assignedStudents || [],
        total,
      };
    } catch (err) {
      throw err;
    }
  }

  async getAgent(context: any, agentId: string): Promise<AgentData> {
    try {
      const user: User = context.user;

      const agentProfile = await this.agentProfileRepository.findById(agentId);
      const docs = await this.documentsRepository.find({
        where: {userId: agentProfile.userId},
      });
      return {
        id: agentProfile.id,
        agentProfile: {
          ...agentProfile,
          //@ts-ignore
          status: agentProfile.status,
        },
        documents: docs || [],
      };
    } catch (error) {
      this.logger.error('error getStudent', agentId, error);
      throw error;
    }
  }

  async updateStaffProfileById(
    context: any,
    staffId: string,
    staffProfile: createStaffData,
  ): Promise<Success> {
    try {
      const user: User = context.user;
      const agent = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });
      if (user.id !== agent?.userId) {
        throw new HttpErrors.Forbidden(
          'you are not authorized to perform this action',
        );
      }

      const staff = await this.staffProfileRepository.findById(staffId);
      if (!staff) throw HttpErrors.NotFound('Staff Profile Not Found');
      if (agent.id != staff.agentId)
        throw HttpErrors.Forbidden('cannot update staff of other agent');

      await this.staffProfileRepository.updateById(staffId, {
        ...staffProfile,
        updatedAt: new Date(Date.now()),
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }
  async deleteStaff(context: any, staffId: string): Promise<Success> {
    const transaction =
      await this.agentProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const user: User = context.user;
      const agent = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });
      if (user.id !== agent?.userId) {
        throw new HttpErrors.Forbidden(
          'you are not authorized to perform this action',
        );
      }

      const staff = await this.staffProfileRepository.findById(staffId);
      if (!staff) throw HttpErrors.NotFound('Staff Profile Not Found');
      if (agent.id != staff.agentId)
        throw HttpErrors.Forbidden('cannot delete staff of other agent');
      await this.staffProfileRepository.deleteById(staffId);
      return {
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteAssignedStaffStudentById(
    context: any,
    staffId: string,
    studentId: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;
      const agentProfile = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });
      if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');

      const studentProfile = await this.studentProfileRepo.findById(studentId);
      if (!studentProfile)
        throw HttpErrors.NotFound('student profile not found');

      const staffProfile = await this.staffProfileRepository.findById(staffId);
      if (!staffProfile) throw HttpErrors.NotFound('staff profile not found');
      if (staffProfile.agentId !== agentProfile.id)
        throw HttpErrors.Forbidden('staff does not belong to agent');

      const studentBelongsToAgent = await this.agentStudentRepo.findOne({
        where: {
          and: [{studentProfileId: studentId}, {agentId: agentProfile.id}],
        },
      });
      if (!studentBelongsToAgent)
        throw HttpErrors.Forbidden('student does not belong to agent');

      const studentBelongsToStaff = await this.studentStaffRepo.findOne({
        where: {
          and: [{studentProfileId: studentId}, {staffProfileId: staffId}],
        },
      });

      if (!studentBelongsToStaff)
        throw HttpErrors.Forbidden('student does not belong to staff');

      await this.studentStaffRepo.deleteById(studentBelongsToStaff.id);
      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async AssignStudentToStaff(
    context: any,
    staffId: string,
    studentId: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;
      const agentProfile = await this.agentProfileRepository.findOne({
        where: {userId: user.id},
      });
      if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
      const studentProfile = await this.studentProfileRepo.findById(studentId);
      if (!studentProfile)
        throw HttpErrors.NotFound('student profile not found');

      const agentHasStudent = await this.agentStudentRepo.findOne({
        where: {
          and: [{agentId: agentProfile.id}, {studentProfileId: studentId}],
        },
      });
      if (!agentHasStudent)
        throw HttpErrors.Forbidden('you cannot assign this student to staff');
      const staffProfile = await this.staffProfileRepository.findById(staffId);

      if (!staffProfile) throw HttpErrors.NotFound('staff profile not found');

      if (agentProfile.id !== staffProfile.agentId)
        throw HttpErrors.Forbidden(
          'Cannot assign student to this satff profile',
        );

      const isStaffStudentExist = await this.studentStaffRepo.findOne({
        where: {
          and: [{staffProfileId: staffId}, {studentProfileId: studentId}],
        },
      });
      if (isStaffStudentExist)
        throw HttpErrors.Forbidden('Current Staff has already this student');
      await this.studentStaffRepo.create({
        staffProfileId: staffId,
        studentProfileId: studentId,
      });

      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async reviewAgent(
    context: any,
    agentId: string,
    reviewAgentInput: ReviewAgentInput,
  ): Promise<AgentProfile> {
    try {
      const {review, ratings} = reviewAgentInput;
      const agentProfile = await this.agentProfileRepository.findById(agentId);
      if (!agentProfile) throw HttpErrors.NotFound('agent not found');
      const updateAgentProfile = await this.agentProfileRepository.updateById(
        agentId,
        {
          review,
          ratings,
          updatedAt: Date.now(),
        },
      );
      const updatedAgentProfile = await this.agentProfileRepository.findById(
        agentId,
      );
      return updatedAgentProfile;
    } catch (err) {
      throw err;
    }
  }
  async getAgents(
    context: any,
    offset: number,
    count: number,
    filter?: Filter,
  ): Promise<AgentsData> {
    try {
      const {country, id, name, email} = filter || {};
      let whereBuilder = null;
      if (country || id || name || email) {
        whereBuilder = new WhereBuilder<AgentProfile>();
        if (id) {
          whereBuilder.eq('agentNumber', id);
        } else if (country) {
          whereBuilder.ilike('country', `%${country}%`);
        } else if (name) {
          whereBuilder.ilike('name', `%${name}%`);
        } else if (email) {
          whereBuilder.ilike('email', `%${email}%`);
        }
      }
      const where = whereBuilder?.build();
      const agentsProfile = await this.agentProfileRepository.find({
        where,
        limit: count,
        skip: offset,
        order: ['createdAt DESC'],

        include: [{relation: 'studentProfiles'}, {relation: 'applications'}],
      });
      let totalStudents: number;
      let totalApplications: number;

      const agentsData = agentsProfile?.map(agent => {
        const {studentProfiles, applications, ...restAgentInfo} = agent;
        totalStudents = studentProfiles?.length || 0;
        totalApplications = applications?.length || 0;

        return {
          ...restAgentInfo,
          totalApplications,
          totalStudents,
        };
      });

      let total = {count: 0};
      if (whereBuilder) {
        total = await this.agentProfileRepository.count(where);
      } else {
        total = await this.agentProfileRepository.count();
      }
      return {
        agentsProfile: agentsData,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('error getAgents', error);
      throw error;
    }
  }

  async deleteById(context: any, agentId: string): Promise<Success> {
    const transaction =
      await this.agentProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const agent = await this.agentProfileRepository.findById(agentId);
      await this.agentProfileRepository.deleteById(agentId, {transaction});
      await this.userRepo.deleteById(agent.userId, {transaction});
      await this.documentsRepository.deleteAll(
        {userId: agent.userId},
        {transaction},
      );
      await transaction.commit();
      return {success: true};
    } catch (error) {
      await transaction.rollback();

      this.logger.error('error deleteAgent', agentId, error);
      throw error;
    }
  }

  async edit(
    context: any,
    agentId: string,
    editAgentInput: EditAgentInput,
  ): Promise<AgentProfileSchema> {
    try {
      const user: User = context.user;
      const agent = await this.agentProfileRepository.findById(agentId);
      if (!agent) {
        throw new HttpErrors.NotFound('agent not found');
      }

      const uni = await this.agentProfileRepository.findById(agentId);
      await this.agentProfileRepository.updateById(agentId, {
        ...editAgentInput,
        updatedAt: Date.now(),
      });

      return {
        ...uni,
        ...editAgentInput,
        updatedAt: new Date(Date.now()),
      };
    } catch (error) {
      this.logger.error('UpdateAgentError', error);
      throw error;
    }
  }
}
