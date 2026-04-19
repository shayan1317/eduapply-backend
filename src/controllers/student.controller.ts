import {SchoolAttended} from './../schema/generic.type';
import {AddVisaAndStudyPermitStudentInput} from './../schema/inputs/student.type';

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  Application,
  StaffProfile,
  StudentProfile,
  TestExam,
  User,
} from '../models';
import {
  AgentProfileRepository,
  AgentStudentRepository,
  ApplicationRepository,
  CoursesRepository,
  DocumentsRepository,
  SchoolAttendedRepository,
  StaffProfileRepository,
  StudentProfileRepository,
  StudentStaffRepository,
  StudentsAgentsEnrollmentRepository,
  TestExamRepository,
  UniversityProfileRepository,
  UserRepository,
  VisaAndStudyPermitRepository,
} from '../repositories';
import {
  APPLICATION_FEE_STATUS_ENUM,
  AuthenticatedUser,
  CURRENCY_ENUM,
  GetStudentRes,
  GetStudentsRes,
  ResEnrolledAgentsStudents,
  ResRevenueFromStudents,
  ResTotalRevenueAndTotalCount,
  ResTotalRevenueFromStudents,
  Roles,
  SignupStudent,
  StudentProfile as StudentProfileScheme,
  Success,
  TestInformation,
  TestsAndExamsResultsStudent,
  VerificationStatus,
  months,
  visaInformation,
} from '../schema';
import {
  AddTestsAndExamsResultsStudentInput,
  CompleteEducationHistoryStudentInput,
  CompleteGeneralInfoStudentInput,
  CreateStudentData,
  CreateStudentUserInput,
  CredentialsInput,
  EditStudentInput,
  Filter,
  SchoolAttendedInput,
  TestInformationInput,
} from '../schema/inputs';
import {
  HasherService,
  JwtService,
  MyUserService,
  SmtpMailService,
  UtilService,
} from '../services';
import {VerificationController} from './verification.controller';

export class StudentController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,
    @repository(CoursesRepository)
    private coursesRepo: CoursesRepository,

    @repository(StudentStaffRepository)
    private studentStaffRepo: StudentStaffRepository,

    @repository(StudentsAgentsEnrollmentRepository)
    private studentsAgentsEnrollmentRepo: StudentsAgentsEnrollmentRepository,

    @service(HasherService)
    private hasherService: HasherService,

    @repository(StaffProfileRepository)
    private staffProfileRepository: StaffProfileRepository,

    @repository(ApplicationRepository)
    private applicationRepository: ApplicationRepository,

    @repository(UniversityProfileRepository)
    private universityProfileRepository: UniversityProfileRepository,

    @repository(StudentProfileRepository)
    private studentProfileRepo: StudentProfileRepository,
    @repository(AgentStudentRepository)
    private agentStudentRepo: AgentStudentRepository,
    @repository(DocumentsRepository)
    private documentsRepository: DocumentsRepository,

    @repository(AgentProfileRepository)
    private agentProfileRepository: AgentProfileRepository,

    @repository(SchoolAttendedRepository)
    private schoolAttendedRepo: SchoolAttendedRepository,

    @repository(TestExamRepository)
    private testExamRepo: TestExamRepository,

    @repository(VisaAndStudyPermitRepository)
    private visaAndStudyPermitRepo: VisaAndStudyPermitRepository,

    @service(UtilService)
    private utilService: UtilService,

    @service(SmtpMailService)
    private mailService: SmtpMailService,

    @inject('controllers.VerificationController')
    private verificationController: VerificationController,

    @service(MyUserService)
    private userService: MyUserService,

    @service(JwtService)
    private jwtService: JwtService,
  ) {}

  async createStudent(
    context: any,
    studentData: CreateStudentData,
  ): Promise<GetStudentRes> {
    const transaction =
      await this.studentProfileRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const User: User = context.user;
      const {
        // documents,
        email,
        testInformation,
        schoolAttended,
        visaInformation,
        ...restStudentData
      } = studentData;
      const username = email.toLowerCase();

      const user = await this.userRepo.findOne({where: {username}});
      if (user)
        throw new HttpErrors.Conflict('User already exists with same email');
      const randomPassword = this.utilService.generateRandomPassword(8);

      const password = await this.hasherService.hashPassword(randomPassword);
      const newStudentUser = await this.userRepo.create(
        {
          username,
          password,
          roleId: Roles.STUDENT,
          verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
        },
        {transaction},
      );

      const setupPasswordToken =
        await this.jwtService.generateSetupPasswordToken({
          userId: newStudentUser.id,
          email: newStudentUser.username,
        });

      const lastRecord = await this.studentProfileRepo.findOne({
        order: ['studentNumber DESC'],
      });
      const newStudentProfile = await this.studentProfileRepo.create(
        {
          ...restStudentData,
          email: username,
          userId: newStudentUser.id,
          studentNumber: lastRecord ? lastRecord.studentNumber + 1 : 1,
          profileCompleted: true,
        },
        {transaction},
      );
      const visaInfo = await this.visaAndStudyPermitRepo.create({
        ...visaInformation,
        studentProfileId: newStudentProfile.id,
      });
      if (User.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: User.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        await this.agentStudentRepo.create(
          {
            agentId: agentProfile.id,
            studentProfileId: newStudentProfile.id,
          },
          {transaction},
        );
      }

      let createTestInfo: TestExam[] = [];
      if (testInformation.length) {
        const tests = testInformation.map(item => ({
          ...item,
          studentProfileId: newStudentProfile.id,
        }));
        createTestInfo = await this.testExamRepo.createAll(tests, {
          transaction,
        });
      }

      let schoolsAttended: SchoolAttended[] = [];

      if (schoolAttended.length) {
        for (let i = 0; i < schoolAttended.length; i++) {
          let {documents, ...restInfo} = schoolAttended[i];
          const school = {
            ...restInfo,
            studentProfileId: newStudentProfile.id,
          };
          const schoolattended = await this.schoolAttendedRepo.create(school, {
            transaction,
          });

          const certificate = {
            ...documents,
            schoolAttendedId: schoolattended.id,
          };

          const document = await this.documentsRepository.create(certificate, {
            transaction,
          });
          schoolsAttended.push({...schoolattended, documents: document});
        }
      }

      if (!newStudentUser || !newStudentProfile)
        throw new HttpErrors.InternalServerError(
          'Something went wrong, try again later',
        );
      // failing mail should not stop the process
      try {
        const STUDENT_WEB_PORTAL_BASE_URL =
          process.env.STUDENT_WEB_PORTAL_BASE_URL ??
          'https://eduapply-webapp-mono.vercel.app';

        await this.mailService.sendSetupPasswordLink({
          name: studentData.firstname + ' ' + studentData.lastname,
          to: username,
          //foronted should have a route to setup-student-password with param token
          link: `${STUDENT_WEB_PORTAL_BASE_URL}/setup-student-password?token=${setupPasswordToken}`,
        });
      } catch (error) {
        this.logger.error('SignUpError', error);
      }

      await transaction.commit();
      return {
        // documents: createDocs,
        student: {
          ...newStudentProfile,
          schoolAttended: schoolsAttended,
        },
        visaAndStudyPermit: visaInfo,
        testExams: createTestInfo,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('SignUpError', error);
      throw error;
    }
  }

  async getStudent(context: any, studentId: string): Promise<GetStudentRes> {
    try {
      const user: User = context.user;
      const student = await this.studentProfileRepo.findById(studentId, {
        include: [
          {relation: 'user'},
          {
            relation: 'schoolAttended',
            scope: {include: [{relation: 'documents'}]},
          },
          // {relation: 'assignedStudents'},
          {relation: 'testExams'},
          {relation: 'visaAndStudyPermit'},
        ],
      });
      if (!student) throw HttpErrors.NotFound('Student not found');
      let whereBuilder = null;

      const {visaAndStudyPermit, testExams, schoolAttended, ...studentProfile} =
        student;
      if (user.roleId === Roles.AGENT) {
        const agent = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });

        if (!agent) throw HttpErrors.NotFound('agent profile does not exist');

        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [{agentId: agent.id}, {studentProfileId: studentId}],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'You are not authorized to get this  student',
          );
        }
      }
      const studentStaffs = await this.studentStaffRepo.find({
        where: {studentProfileId: studentId},
      });

      const assignedStaffIds = studentStaffs.map(staff => staff.staffProfileId);
      let total = {count: 0};
      whereBuilder = new WhereBuilder<StaffProfile>();
      //@ts-ignore
      whereBuilder.and({id: {inq: assignedStaffIds}});
      const where = whereBuilder?.build();
      const staffprofiles = await this.staffProfileRepository.find({where});
      total = await this.staffProfileRepository.count(where);

      return {
        student: {
          ...studentProfile,

          schoolAttended,
        },
        assignedStaffs: staffprofiles,
        total: total.count,
        visaAndStudyPermit,
        testExams,
      };
    } catch (error) {
      this.logger.error('error getStudent', studentId, error);
      throw error;
    }
  }

  async getStudentProfile(context: any): Promise<GetStudentRes> {
    try {
      const user = context.user;

      const student = await this.studentProfileRepo.findOne({
        where: {userId: user.id},
        include: [
          {relation: 'user'},
          {
            relation: 'schoolAttended',
            scope: {include: [{relation: 'documents'}]},
          },
          {relation: 'testExams'},
          {relation: 'visaAndStudyPermit'},
        ],
      });

      if (!student) {
        throw new HttpErrors.NotFound('not found');
      }
      const {visaAndStudyPermit, testExams, schoolAttended, ...studentProfile} =
        student;

      return {
        student: {
          ...studentProfile,
          schoolAttended,
        },
        testExams,
        visaAndStudyPermit,
      };
    } catch (error) {
      this.logger.error('error getStudent', context.user, error);
      throw error;
    }
  }

  async getStudents(
    context: any,
    offset: number,
    count: number,
    filter?: Filter,
    agentId?: string,
  ): Promise<GetStudentsRes> {
    try {
      const user: User = context.user;
      const {country, id, name, email} = filter || {};
      let whereBuilder = null;
      if (country || id || name || email) {
        whereBuilder = new WhereBuilder<StudentProfile>();
        if (id) {
          whereBuilder.eq('studentNumber', id);
        } else if (country) {
          whereBuilder.ilike('country', `%${country}%`);
        } else if (name) {
          whereBuilder.or(
            {firstname: {ilike: `%${name}%`}},
            {lastname: {ilike: `%${name}%`}},
            {middlename: {ilike: `%${name}%`}},
          );
        } else if (email) {
          whereBuilder.ilike('email', `%${email}%`);
        }
      }
      if (agentId) {
        const agentProfile = await this.agentProfileRepository.findById(
          agentId,
        );
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const agentstudents = await this.agentStudentRepo.find({
          where: {agentId: agentProfile.id},
        });
        const studentsIds = agentstudents.map(agent => agent.studentProfileId);

        if (studentsIds.length == 0) {
          return {
            students: [],

            total: 0,
          };
        }
        if (whereBuilder) {
          //@ts-ignore
          whereBuilder.and({id: {inq: studentsIds}});
        } else {
          whereBuilder = new WhereBuilder<StudentProfile>();
          // @ts-ignore
          whereBuilder.and({id: {inq: studentsIds}});
        }
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const agent = await this.agentStudentRepo.find({
          where: {agentId: agentProfile.id},
        });

        const studentsIds = agent.map(agent => agent.studentProfileId);

        if (studentsIds.length == 0) {
          return {
            students: [],

            total: 0,
          };
        }

        if (whereBuilder) {
          //@ts-ignore
          whereBuilder.and({id: {inq: studentsIds}});
        } else {
          whereBuilder = new WhereBuilder<StudentProfile>();
          // @ts-ignore
          whereBuilder.and({id: {inq: studentsIds}});
        }
      }
      if (user.roleId === Roles.STAFF) {
        const staffProfile = await this.staffProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!staffProfile) throw HttpErrors.NotFound('staff profile not found');
        const StaffStudents = await this.studentStaffRepo.find({
          where: {staffProfileId: staffProfile.id},
        });

        const studentsIds = StaffStudents.map(
          student => student.studentProfileId,
        );

        if (studentsIds.length == 0) {
          return {
            students: [],

            total: 0,
          };
        }

        if (whereBuilder) {
          //@ts-ignore
          whereBuilder.and({id: {inq: studentsIds}});
        } else {
          whereBuilder = new WhereBuilder<StudentProfile>();
          // @ts-ignore
          whereBuilder.and({id: {inq: studentsIds}});
        }
      }
      const where = whereBuilder?.build();
      const students = await this.studentProfileRepo.find({
        where,
        limit: count,
        skip: offset,
        order: ['createdAt DESC'],
        include: [
          {
            relation: 'schoolAttended',
            scope: {include: [{relation: 'documents'}]},
          },
        ],
      });
      let total = {count: 0};
      if (whereBuilder) {
        total = await this.studentProfileRepo.count(where);
      } else {
        total = await this.studentProfileRepo.count();
      }
      return {
        students,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('error getStudents', error);
      throw error;
    }
  }

  async deleteById(context: any, studentId: string): Promise<Success> {
    const transaction =
      await this.studentProfileRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const student = await this.studentProfileRepo.findById(studentId);
      const application = await this.applicationRepository.findOne({
        where: {studentProfileId: student.id},
      });

      await this.studentProfileRepo.deleteById(studentId, {transaction});
      await this.userRepo.deleteById(student.userId, {transaction});
      if (application)
        await this.applicationRepository.deleteById(application?.id, {
          transaction,
        });
      await this.documentsRepository.deleteAll(
        {userId: student.userId},
        {transaction},
      );
      await this.testExamRepo.deleteAll(
        {studentProfileId: student.id},
        {transaction},
      );
      await transaction.commit();
      return {success: true};
    } catch (error) {
      await transaction.rollback();

      this.logger.error('error deleteStudent', studentId, error);
      throw error;
    }
  }

  async edit(
    context: any,
    studentId: string,
    editStudentInput: EditStudentInput,
  ): Promise<StudentProfileScheme> {
    try {
      const student = await this.studentProfileRepo.findById(studentId, {
        include: ['schoolAttended'],
      });
      await this.studentProfileRepo.updateById(studentId, {
        ...editStudentInput,
        updatedAt: Date.now(),
      });
      return {
        ...student,
        ...editStudentInput,
        updatedAt: new Date(Date.now()),
      };
    } catch (error) {
      this.logger.error('UpdateStudentError', error);
      throw error;
    }
  }

  async signUp(
    context: any,
    userInput: CreateStudentUserInput,
  ): Promise<SignupStudent> {
    const transaction = await this.userRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const {firstName, lastName} = userInput;
      const email = userInput.email.toLowerCase();
      const user = await this.userRepo.findOne({where: {username: email}});

      const password = await this.hasherService.hashPassword(
        userInput.password,
      );
      let newUser: User | null = null;
      let newStudentProfile: StudentProfile | null = null;
      const userVerificationStatus = user?.verificationStatus || 'NOT_ASSIGNED';
      switch (userVerificationStatus) {
        case VerificationStatus.NOT_ASSIGNED:
          newUser = await this.userRepo.create(
            {
              username: email,
              password,
              roleId: Roles.STUDENT,
              verificationStatus: VerificationStatus.CODE_SENT,
            },
            {transaction},
          );
          const lastRecord = await this.studentProfileRepo.findOne({
            order: ['studentNumber DESC'],
          });
          newStudentProfile = await this.studentProfileRepo.create(
            {
              email,
              firstname: firstName,
              lastname: lastName,
              userId: newUser.id,
              studentNumber: lastRecord ? lastRecord.studentNumber + 1 : 1,
            },
            {transaction},
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
      if (!newUser || !newStudentProfile)
        throw new HttpErrors.InternalServerError(
          'Something went wrong, try again later',
        );
      const securityProfile = this.userService.convertToUserProfile(newUser);
      const token = await this.jwtService.generateToken(securityProfile);

      await await transaction.commit();
      return {
        //@ts-ignore
        user: newUser,
        success: true,
        token: token,
        studentProfile: {
          ...newStudentProfile,
          //@ts-ignore
          status: newStudentProfile.status || 'NEW_LEAD',
        },
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('SignUpError', error);
      throw error;
    }
  }

  async login(
    context: any,
    credentials: CredentialsInput,
  ): Promise<AuthenticatedUser> {
    try {
      const user = await this.userService.verifyCredentials(credentials);
      const securityProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(securityProfile);
      const studentProfile = await this.studentProfileRepo.findOne({
        where: {userId: user.id},
      });
      if (!studentProfile)
        throw new HttpErrors.NotFound(
          `Admin Profile does not exist for ${credentials.username}`,
        );
      return {
        //@ts-ignore
        user: user,
        //@ts-ignore
        studentProfile,
        token,
      };
    } catch (error) {
      this.logger.error('LoginError', error);
      throw error;
    }
  }

  async completeGeneralInfo(
    context: any,
    studentId: string,
    data: CompleteGeneralInfoStudentInput,
  ): Promise<Success> {
    try {
      const user: User = context.user;

      const student = await this.studentProfileRepo.findById(studentId);
      if (user.roleId === Roles.STUDENT && user.id !== student.userId) {
        throw new HttpErrors.Forbidden(
          'You are not authorized to perform this action',
        );
      }
      await this.studentProfileRepo.updateById(studentId, {
        ...data,
        updatedAt: Date.now(),
      });
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('completeGeneralInfoError', error);
      throw error;
    }
  }

  async completeEducationHistory(
    context: any,
    studentId: string,
    data: CompleteEducationHistoryStudentInput,
  ): Promise<Success> {
    const transaction =
      await this.studentProfileRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const user: User = context.user;
      // const {
      //   HighestLevelOfEducation,
      //   gradeAverage,
      //   gradingScheme,
      //   gradeScale,
      //   isGraduated,
      // } = data;
      const student = await this.studentProfileRepo.findById(studentId);
      if (user.roleId === Roles.STUDENT && user.id !== student.userId) {
        throw new HttpErrors.Forbidden(
          'You are not authorized to perform this action',
        );
      }

      let schoolAttended: SchoolAttended[] = [];
      if (data?.schoolAttended?.length) {
        for (let i = 0; i < data?.schoolAttended.length; i++) {
          let {documents, ...restInfo} = data.schoolAttended[i];
          const school = {
            ...restInfo,
            studentProfileId: student.id,
          };

          const schoolattended = await this.schoolAttendedRepo.create(school, {
            transaction,
          });

          const certificate = {
            ...documents,
            schoolAttendedId: schoolattended.id,
          };

          const document = await this.documentsRepository.create(certificate, {
            transaction,
          });
          schoolAttended.push({...schoolattended, documents: document});
        }
      }

      // await this.studentProfileRepo.updateById(
      //   studentId,
      //   {
      //     HighestLevelOfEducation,
      //     gradeAverage,
      //     gradeScale,
      //     gradingScheme,
      //     isGraduated,
      //     updatedAt: Date.now(),
      //   },
      //   {transaction},
      // );
      await transaction.commit();
      return {
        success: true,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('completeEducationHistory', error);
      throw error;
    }
  }

  async createSchoolAttended(
    context: any,
    schoolAttended: SchoolAttendedInput,
    studentId: string,
  ): Promise<SchoolAttended> {
    try {
      const user: User = context.user;

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent not found');
        const agenthasStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [{agentId: agentProfile.id}, {studentProfileId: studentId}],
          },
        });
        if (!agenthasStudent) {
          throw HttpErrors.NotFound(
            'you cannot create schoolattended for this student',
          );
        }
      }
      if (user.roleId === Roles.STUDENT) {
        const studentProfile = await this.studentProfileRepo.findById(
          studentId,
        );
        if (user.id !== studentProfile.userId) {
          throw HttpErrors.Forbidden(
            'You are not authorized to perform this action ',
          );
        }
      }
      const {documents, ...restInfo} = schoolAttended;
      const newSchool = {...restInfo, studentProfileId: studentId};
      const schoolattended = await this.schoolAttendedRepo.create(newSchool);
      const docs = {...documents, schoolAttendedId: schoolattended.id};
      const StudentDocument = await this.documentsRepository.create(docs);
      const newSchoolAttended = {...schoolattended, ...StudentDocument};

      return {...newSchoolAttended};
    } catch (err) {
      throw err;
    }
  }

  async updateSchoolAttended(
    context: any,
    schoolAttendedId: string,
    schoolAttended: SchoolAttendedInput,
  ): Promise<Success> {
    try {
      const user: User = context.user;

      const {documents, ...schoolattneded} = schoolAttended;
      if (user.roleId === Roles.STUDENT) {
        const studentProfile = await this.studentProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!studentProfile) {
          throw HttpErrors.NotFound('student profile not found');
        }
        if (user.id !== studentProfile.userId) {
          throw HttpErrors.Forbidden(
            'You are not authorized to perform this action ',
          );
        }
        const schoolAttended = await this.schoolAttendedRepo.findById(
          schoolAttendedId,
        );
        if (!schoolAttended) {
          throw HttpErrors.NotFound('school attended does not exist');
        }
        if (schoolAttended.studentProfileId !== studentProfile.id) {
          throw HttpErrors.Forbidden('Cannot create tests for this student');
        }
      }
      if (user.roleId === Roles.AGENT) {
        const agentprofile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentprofile) throw HttpErrors.NotFound('agent not found');

        const schoolattended = await this.schoolAttendedRepo.findById(
          schoolAttendedId,
        );
        if (!schoolAttended) {
          throw HttpErrors.NotFound('school attended does not exist');
        }

        const agenthasStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentprofile.id},
              {studentProfileId: schoolattended.studentProfileId},
            ],
          },
        });

        if (!agenthasStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to edit this data',
          );
        }
      }

      await this.schoolAttendedRepo.updateById(schoolAttendedId, {
        ...schoolattneded,
        updatedAt: Date.now(),
      });
      if (documents) {
        const docs = await this.documentsRepository.findOne({
          where: {schoolAttendedId: schoolAttendedId},
        });
        if (!docs) {
          throw HttpErrors.NotFound('docs does not exist');
        }

        await this.documentsRepository.updateById(docs?.id, {
          ...documents,
          updatedAt: Date.now(),
        });
      }

      return {success: true};
    } catch (err) {
      throw err;
    }
  }
  async addTestsAndExamsResults(
    context: any,
    data: AddTestsAndExamsResultsStudentInput,
  ): Promise<TestsAndExamsResultsStudent> {
    const transaction =
      await this.studentProfileRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const user: User = context.user;

      const {studentProfileId, testInformation} = data;
      const student = await this.studentProfileRepo.findById(studentProfileId);
      if (user.roleId === Roles.STUDENT && user.id !== student.userId)
        throw new HttpErrors.Forbidden(
          'You are not authorized to perform this action',
        );

      let createTestInfo: TestExam[] = [];

      if (testInformation?.length) {
        const tests = testInformation.map(item => ({
          ...item,
          studentProfileId,
        }));
        const createTestInfo = await this.testExamRepo.createAll(tests, {
          transaction,
        });
      }

      await transaction.commit();
      return {
        id: student.id,
        testInformation: createTestInfo,
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('addTestsAndExamsResults', error);
      throw error;
    }
  }

  async createTests(
    context: any,
    test: TestInformationInput,
    studentId: string,
  ): Promise<TestInformation> {
    try {
      const user: User = context.user;
      if (user.roleId === Roles.STUDENT) {
        const studenProfile = await this.studentProfileRepo.findById(studentId);
        if (user.id !== studenProfile.userId)
          throw HttpErrors.Forbidden(
            '  You are not authorized to perform this action,',
          );
      }

      if (user.roleId === Roles.AGENT) {
        const agent = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });

        if (!agent) {
          throw HttpErrors.NotFound('agent profile does not exist');
        }
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [{agentId: agent.id}, {studentProfileId: studentId}],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to create tests for this student',
          );
        }
      }
      let createTestInfo: TestExam;
      const tempTest = {...test, studentProfileId: studentId};
      createTestInfo = await this.testExamRepo.create(tempTest);
      return {...createTestInfo};
    } catch (err) {
      throw err;
    }
  }
  async updateTestsAndExamsResults(
    context: any,
    tests: TestInformationInput,
    studentTestsId: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;
      if (user.roleId === Roles.STUDENT) {
        const studentProfile = await this.studentProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!studentProfile)
          throw HttpErrors.NotFound('student profile not found');

        if (user.id !== studentProfile.userId) {
          throw HttpErrors.Forbidden(
            'You are not authorized to perform this action ',
          );
        }
        const testExams = await this.testExamRepo.findById(studentTestsId);
        if (!studentTestsId) {
          throw HttpErrors.NotFound('tests does not exist');
        }
        if (testExams.studentProfileId !== studentProfile.id) {
          throw HttpErrors.Forbidden('Cannot update tests for this student');
        }
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });

        if (!agentProfile) {
          throw HttpErrors.NotFound('agent not found');
        }
        const testExist = await this.testExamRepo.findById(studentTestsId);
        if (!testExist) throw HttpErrors.NotFound('test not found');

        const agenthasStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: testExist.studentProfileId},
            ],
          },
        });
        if (!agenthasStudent)
          throw HttpErrors.Forbidden('not authorized to edit tests');
      }

      await this.testExamRepo.updateById(studentTestsId, {
        ...tests,
        updatedAt: Date.now(),
      });
      return {
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }
  async addVisaAndPermit(
    context: any,
    data: AddVisaAndStudyPermitStudentInput,
    studentId: string,
  ): Promise<visaInformation> {
    const transaction =
      await this.studentProfileRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const user: User = context.user;

      const student = await this.studentProfileRepo.findById(studentId);

      if (!student) {
        throw new HttpErrors.NotFound('student profile not found');
      }
      const visa = await this.visaAndStudyPermitRepo.findOne({
        where: {studentProfileId: student.id},
      });
      if (visa) throw HttpErrors.Forbidden('visa info already exist');
      const newVisaInfo = await this.visaAndStudyPermitRepo.create(
        {
          ...data,
          studentProfileId: studentId,
        },
        {transaction},
      );

      await transaction.commit();
      return newVisaInfo;
    } catch (error) {
      this.logger.error('addTestsAndExamsResults', error);
      throw error;
    }
  }

  async UpdateVisaInfo(
    context: any,
    addVisaAndStudyPermitStudent: AddVisaAndStudyPermitStudentInput,
    visaId: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;
      const visaInfo = await this.visaAndStudyPermitRepo.findById(visaId);

      if (!visaInfo) {
        throw HttpErrors.NotFound('visa info does not exist');
      }
      if (user.roleId === Roles.STUDENT) {
        const studentProfile = await this.studentProfileRepo.findOne({
          where: {userId: user.id},
        });
        if (!studentProfile)
          throw HttpErrors.NotFound('student profile not found');

        if (visaInfo.studentProfileId !== studentProfile.id) {
          throw HttpErrors.Forbidden(
            'Cannot update visa info for this student',
          );
        }
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile)
          throw new HttpErrors.NotFound('agent profile not found');

        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: visaInfo.studentProfileId},
            ],
          },
        });

        if (!isAgentStudent)
          throw HttpErrors.Forbidden('cannot add visa info for this student');
      }
      // const visa = await this.visaAndStudyPermitRepo.findOne(visaId);

      // if (!visa) {
      //   throw HttpErrors.NotFound('visa details not found');
      // }
      await this.visaAndStudyPermitRepo.updateById(visaId, {
        ...addVisaAndStudyPermitStudent,
        updatedAt: Date.now(),
      });

      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async getEnrolledAgentsStudents(
    context: any,
    enrollementYear: string,
  ): Promise<ResEnrolledAgentsStudents> {
    try {
      const startingYear = enrollementYear.split('-')[0];
      // const endYear = enrollementYear.split('-')[1];
      const agents = await this.agentProfileRepository.find({
        fields: {createdAt: true},
        order: ['createdAt ASC'],
        where: {
          and: [
            {createdAt: {gt: new Date(`${startingYear}-01-01T00:00:00.000Z`)}},
            {createdAt: {lt: new Date(`${startingYear}-12-30T00:00:00.000Z`)}},
          ],
        },
      });

      const students = await this.studentProfileRepo.find({
        order: ['createdAt ASC'],
        fields: {createdAt: true},
        where: {
          and: [
            {createdAt: {gt: new Date(`${startingYear}-01-01T00:00:00.000Z`)}},
            {createdAt: {lt: new Date(`${startingYear}-12-30T00:00:00.000Z`)}},
          ],
        },
      });

      const updatedStudents = students
        .filter(item => {
          const keyValues = Object.entries(item);

          const filtered = keyValues.filter(
            ([key, value]) => value !== undefined,
          );

          return Object.fromEntries(filtered);
        })
        .map((item, index) => {
          const monthIndex = item.createdAt.getMonth();
          const month = months[monthIndex];
          // const year = item.createdAt.getFullYear();
          return {createdAt: month};
        });

      const updatedAgents = agents
        .filter(item => {
          const keyValues = Object.entries(item);

          const filtered = keyValues.filter(
            ([key, value]) => value !== undefined,
          );

          return Object.fromEntries(filtered);
        })
        .map((item, index) => {
          const monthIndex = item.createdAt.getMonth();
          // const year = item.createdAt.getFullYear();
          const month = months[monthIndex];

          return {createdAt: month};
        });

      const monthCountAgent = months.reduce((accumulator, month) => {
        const count = updatedAgents.filter(
          //@ts-ignore
          obj => obj.createdAt === month,
        ).length;
        //@ts-ignore
        accumulator.push({month, count});
        return accumulator;
      }, []);

      const monthCountStudent = months.reduce((accumulator, month) => {
        const count = updatedStudents.filter(
          //@ts-ignore
          obj => obj.createdAt === month,
        ).length;
        //@ts-ignore
        accumulator.push({month, count});
        return accumulator;
      }, []);

      const totalStudentsAgents = monthCountAgent.map((agent, index) => {
        const existing = monthCountStudent.find(
          //@ts-ignore
          item => item.month === agent.month,
        );
        return {
          //@ts-ignore
          month: agent.month,
          //@ts-ignore
          agents: agent.count,
          //@ts-ignore
          students: existing.count,
          // //@ts-ignore
          // year: existing.year,
        };
      });

      // Iterate through the agentProfiles array

      // const mergedData = agents.map(agent => {

      return {enrolledAgentsStudents: totalStudentsAgents};
    } catch (err) {
      throw err;
    }
  }

  async getRevenueFromStudents(
    context: any,
    enrollementYear: string,
    agentId: string,
  ): Promise<ResRevenueFromStudents> {
    try {
      const currency = Object.values(CURRENCY_ENUM);

      const startingYear = enrollementYear.split('-')[0];
      const whereBuilder = new WhereBuilder<Application>();

      if (agentId) {
        whereBuilder.eq('agentProfileId', agentId);
      }

      whereBuilder.and([
        {createdAt: {gt: new Date(`${startingYear}-01-01T00:00:00.000Z`)}},
        {createdAt: {lt: new Date(`${startingYear}-12-31T00:00:00.000Z`)}},
      ]);
      const where = whereBuilder?.build();
      const applications = await this.applicationRepository.find({
        order: ['createdAt ASC'],
        //@ts-ignore
        where,
        include: [
          {
            relation: 'courses',
          },
        ],
      });

      let updatedApplications = await Promise.all(
        applications
          .filter(
            item =>
              item.applicationFeePaymentStatus ===
              APPLICATION_FEE_STATUS_ENUM.PAID,
          )
          .map(async item => {
            const monthIndex = item.createdAt.getUTCMonth();

            const month = months[monthIndex];
            // const course = await this.coursesRepo.findById(item.coursesId);
            // const {universityProfileId, ...rest} = course;
            // const uni = await this.universityProfileRepository.findById(
            //   universityProfileId,
            // );

            return {
              applicationFee: item.applicationFee,
              month,
              currency: item.applicationFeeCurrency,
            };
          }),
      );

      const revenueFromStudents = months.reduce((accumulator, month) => {
        let feesArray = updatedApplications.filter(item => {
          return item.month === month;
        });

        let NoOfApplications = updatedApplications.filter(item => {
          return item.month === month;
        }).length;
        const cuurencyFilter = currency.map(currency => {
          //@ts-ignore
          const applicationFees = feesArray
            .filter(item => item.currency === currency)
            .reduce((acc, item) => {
              return acc + (item?.applicationFee || 0);
            }, 0);
          return {['appicationFeeIn' + currency]: applicationFees};
        });

        const finalRevenuuEachMonth = Object.assign({}, ...cuurencyFilter);

        // @ts-ignore
        accumulator.push({
          ...finalRevenuuEachMonth,
          applicationsCount: NoOfApplications,
          month,
        });

        return accumulator;
      }, []);

      return {revenueFromStudents: revenueFromStudents};
    } catch (err) {
      throw err;
    }
  }

  async getTotalRvenue(
    context: any,
    enrollementYear?: string,
    agentId?: string,
  ): Promise<ResTotalRevenueFromStudents> {
    try {
      const currency = Object.values(CURRENCY_ENUM);

      const whereBuilder = new WhereBuilder<Application>();

      if (agentId) {
        whereBuilder.eq('agentProfileId', agentId);
      }
      if (enrollementYear) {
        const startingYear = enrollementYear?.split('-')[0];
        whereBuilder.and([
          {createdAt: {gt: new Date(`${startingYear}-01-01T00:00:00.000Z`)}},
          {createdAt: {lt: new Date(`${startingYear}-12-30T00:00:00.000Z`)}},
        ]);
      }

      const where = whereBuilder?.build();
      const applications = await this.applicationRepository.find({
        order: ['createdAt ASC'],
        //@ts-ignore
        where,
        include: [
          {
            relation: 'courses',
          },
        ],
      });

      let updatedApplications = await Promise.all(
        applications
          .filter(
            item =>
              item.applicationFeePaymentStatus ===
              APPLICATION_FEE_STATUS_ENUM.PAID,
          )
          .map(async item => {
            const monthIndex = item.createdAt.getUTCMonth();
            const month = months[monthIndex];
            // const course = await this.coursesRepo.findById(item.coursesId);
            // const {applicationFee, universityProfileId, ...rest} = course;
            // const uni = await this.universityProfileRepository.findById(
            //   universityProfileId,
            // );

            return {
              applicationFee: item.applicationFee,
              month,
              currency: item.applicationFeeCurrency,
            };
          }),
      );

      const revenueFromStudents = currency.reduce((accumulator, currency) => {
        let feesArray = updatedApplications.filter(item => {
          return item.currency === currency;
        });

        const cuurencyFilter = feesArray.reduce((acc, fee) => {
          return (fee?.applicationFee || 0) + acc;
        }, 0);

        //@ts-ignore
        accumulator?.push({value: cuurencyFilter});

        return accumulator;
      }, []);
      const total = revenueFromStudents.reduce((acc, currentValue) => {
        //@ts-ignore
        return currentValue.value + acc;
      }, 0);
      //@ts-ignore

      return {revenueFromStudents: revenueFromStudents, total};
    } catch (err) {
      throw err;
    }
  }
  async getTotalRevenueAndStudentsAgentsUniversitiesCount(
    context: any,
  ): Promise<ResTotalRevenueAndTotalCount> {
    try {
      const totalAgents = (await this.agentProfileRepository.count()).count;
      const totalStudents = (await this.studentProfileRepo.count()).count;
      const totalUniversities = (await this.universityProfileRepository.count())
        .count;
      const totalRevenue = (await this.getTotalRvenue(context)).total;
      return {
        totalAgents,
        totalStudents,
        totalUniversities,
        totalRevenue,
      };
    } catch (err) {
      throw err;
    }
  }

  async FinishStepperFlow(context: any, studentId: string): Promise<Success> {
    try {
      const user: User = context.user;
      const User = await this.userRepo.findById(user.id);
      if (!User) throw HttpErrors.NotFound('user not found');
      const studentProfile = await this.studentProfileRepo.findById(studentId);
      if (studentProfile.userId !== user.id)
        throw HttpErrors.Forbidden('cannot perform action for this student');

      await this.studentProfileRepo.updateById(studentId, {
        isStepperCompleted: true,
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }
}
