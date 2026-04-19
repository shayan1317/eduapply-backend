import {EventNames, TutionFeeVerification} from './../schema/enums.type';
// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  Application,
  Courses,
  RequiredTestCourse,
  UniDepartment,
  UniversityProfile,
  User,
} from '../models';
import {
  AgentProfileRepository,
  AgentStudentRepository,
  ApplicationNoteRepository,
  ApplicationRepository,
  ApplicationStatusRepository,
  CoursesRepository,
  RequiredTestCourseRepository,
  RioProfileRepository,
  StaffProfileRepository,
  StudentApplicationTrackRecordRepository,
  StudentProfileRepository,
  StudentStaffRepository,
  UniversityProfileRepository,
  UniversityRioRepository,
  UserRepository,
  VideoRepository,
} from '../repositories';
import {
  APPLICATION_FEE_STATUS_ENUM,
  ApplicationNotes,
  ApplicationStatus,
  ApplicationTrackRecord,
  DOC_STATUS,
  GetApplicationStatusRes,
  Intake,
  Roles,
  StudentApplication,
  StudentApplications,
  Success,
  UniversitiesData,
} from '../schema';
import {SubjectsData} from '../schema/course.type';
import {
  ApplicationNoteInput,
  ApplicationRequirementInput,
  ApplicationTrackRecordInput,
  GetAllApplicationsInput,
  GetApplicationFilter,
} from '../schema/inputs';
import {StripeService} from '../services';

export class ApplicationController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @repository(UniversityProfileRepository)
    private universityProfileRepo: UniversityProfileRepository,

    @repository(CoursesRepository)
    private coursesRepo: CoursesRepository,

    @repository(StudentStaffRepository)
    private studentStaffRepo: StudentStaffRepository,

    @repository(ApplicationStatusRepository)
    private applicationStatusRepo: ApplicationStatusRepository,

    @repository(UniversityRioRepository)
    private universityRioRepository: UniversityRioRepository,

    @repository(AgentProfileRepository)
    private agentProfileRepository: AgentProfileRepository,

    @repository(RioProfileRepository)
    private rioProfileRepo: RioProfileRepository,

    @repository(RequiredTestCourseRepository)
    private requiredTestCourseRepo: RequiredTestCourseRepository,

    @repository(ApplicationRepository)
    private applicationRepo: ApplicationRepository,

    @repository(VideoRepository)
    private videoRepo: VideoRepository,

    @repository(ApplicationNoteRepository)
    private applicationNoteRepo: ApplicationNoteRepository,

    @repository(AgentStudentRepository)
    private agentStudentRepo: AgentStudentRepository,

    @repository(StudentProfileRepository)
    private studentProfileRepository: StudentProfileRepository,

    @repository(StudentApplicationTrackRecordRepository)
    private studentApplicationTrackRecordRepo: StudentApplicationTrackRecordRepository,

    @repository(StaffProfileRepository)
    private staffProfileRepository: StaffProfileRepository,

    @service(StripeService)
    private stripeService: StripeService,
  ) {}

  async create(
    context: any,
    studentId: string,
    courseId: string,
    intakes: Intake,
    agentProfileId: string | undefined,
  ): Promise<StudentApplication> {
    const transaction = await this.applicationRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const user: User = context.user;
      const studentProfile = await this.studentProfileRepository.findById(
        studentId,
        {
          include: [{relation: 'testExams'}, {relation: 'schoolAttended'}],
        },
      );

      if (!studentProfile) throw new HttpErrors.NotFound('Student not found');
      const isCourseExisit = await this.coursesRepo.findById(courseId);
      if (!isCourseExisit) throw new HttpErrors.NotFound('Course not found');

      if (user.roleId === Roles.STUDENT) {
        if (studentProfile.userId != user.id)
          throw HttpErrors.Forbidden(
            'You are not authorized to perform this action',
          );
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        agentProfileId = agentProfile.id;
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [{agentId: agentProfile.id}, {studentProfileId: studentId}],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to create application for this student',
          );
        }
      }
      const course = await this.coursesRepo.findById(courseId, {
        include: ['uniDepartment', 'universityProfile'],
      });
      //@ts-ignore
      const {uniDepartment, universityProfile, ...restCourse} = course;

      const newApplicaiton = await this.applicationRepo.create(
        {
          studentProfileId: studentId,
          coursesId: courseId,
          applicationDate: Date.now(),
          agentProfileId,
          intakes,
          applicationFee: restCourse.applicationFee,
          applicationFeeCurrency: universityProfile.currency,
        },
        {transaction},
      );

      let requiredDocs: Array<{
        title: string;
        status: DOC_STATUS;
        applicationId?: number;
        url: string;
      }> = [];

      if (restCourse.reqDocs) {
        requiredDocs = restCourse?.reqDocs?.map(name => ({
          title: name,
          status: DOC_STATUS.REQUIRED,
          applicationId: newApplicaiton.id,
          url: '',
        }));
      }

      const applicationStatus = [
        {
          eventName: EventNames.STUDENT_APPLICATION_SUBMITTED,
          applicationId: newApplicaiton.id,
          status: ApplicationStatus.PENDING,
          title: 'Student Application Submitted',
          date: Date.now(),
        },
        {
          eventName: EventNames.RIO_EVALUATION,
          applicationId: newApplicaiton.id,
          title: 'RIO Evaluation',
          status: ApplicationStatus.PENDING,
          date: Date.now(),
        },

        {
          eventName: EventNames.APPLICATION_FORWARDED_TO_UNIVERSITY,
          applicationId: newApplicaiton.id,
          status: ApplicationStatus.PENDING,
          title: 'Application forwarded to University',
          date: Date.now(),
        },
        {
          eventName: EventNames.OFFER_LETTER,
          applicationId: newApplicaiton.id,
          status: ApplicationStatus.PENDING,
          title: 'Offer Letter',
          date: Date.now(),
        },
        {
          eventName: EventNames.ADMISSION_FEE_VERIFICATION,
          applicationId: newApplicaiton.id,
          status: ApplicationStatus.PENDING,
          title: 'Admission Fee Verification',
          date: Date.now(),
        },
        {
          eventName: EventNames.VISA_SUPPORT_LETTER,
          applicationId: newApplicaiton.id,
          status: ApplicationStatus.PENDING,
          title: 'Visa Support Letter',
          date: Date.now(),
        },
        {
          eventName: EventNames.REFUND_FORM_UPLOAD,
          applicationId: newApplicaiton.id,
          status: ApplicationStatus.PENDING,
          title: 'Refund Form Upload',
          date: Date.now(),
        },
      ];

      const applicationStatuses = await this.applicationStatusRepo.createAll(
        applicationStatus,
      );

      const requiredApplication =
        await this.studentApplicationTrackRecordRepo.createAll(requiredDocs);

      await transaction.commit();

      const {testExams, visaAndStudyPermit, ...StudentData} = studentProfile;

      return {
        ...newApplicaiton,
        // @ts-ignore
        applicationStatuses,
        // @ts-ignore
        courseDetails: restCourse,
        universityDetails: universityProfile,
        departmentDetails: uniDepartment,
        applicationTrackRecords: requiredApplication,
        studentData: {
          student: {...StudentData},

          testExams,
          visaAndStudyPermit,
        },
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('error applyCrateApplication', error);
      throw error;
    }
  }

  async updateApplicationRequiremtents(
    context: any,
    applicationRequirement: ApplicationTrackRecordInput,
    applicationId: number,
  ): Promise<ApplicationTrackRecord> {
    try {
      const user: User = context.user;
      const {id, ...restDoc} = applicationRequirement;
      let updateDoc = {
        ...restDoc,
        updatedAt: new Date().toISOString(),
      };
      const application = await this.applicationRepo.findById(applicationId);
      const {studentProfileId} = application;

      const student = await this.studentProfileRepository.findById(
        studentProfileId,
      );

      if (!student) throw new HttpErrors.NotFound('Student not found');

      if (user.roleId === Roles.STUDENT) {
        if (student.userId != user.id)
          throw HttpErrors.Forbidden(
            'You are not authorzied to perfom this action',
          );
        updateDoc = {
          ...updateDoc,
          status: DOC_STATUS.PENDING,
        };
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studentProfileId},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to update application for this student',
          );
        }
        updateDoc = {
          ...updateDoc,
          status: DOC_STATUS.PENDING,
        };
      }

      const updateTrackRecord =
        await this.studentApplicationTrackRecordRepo.updateById(id, updateDoc);
      const updatedTrackRecord =
        await this.studentApplicationTrackRecordRepo.findById(id);
      return updatedTrackRecord;
    } catch (err) {
      this.logger.error('error updateApplicationRequiremtents', err);
      throw err;
    }
  }

  async updateAdmissionFeeVerificationBy(
    context: any,
    addmissionFeeVerification: ApplicationRequirementInput,
    applicationId: number,
    eventName: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;

      const applications = await this.applicationRepo.findById(applicationId);
      if (!applications)
        throw HttpErrors.NotFound('application does not exist');
      const {studentProfileId} = applications;

      const student = await this.studentProfileRepository.findById(
        studentProfileId,
      );

      if (user.roleId === Roles.STUDENT) {
        if (student.userId != user.id)
          throw HttpErrors.Forbidden(
            'You are not authorzied to perfom this action',
          );
      }
      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studentProfileId},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to update application for this student',
          );
        }
      }
      const updateVerificationFee = await this.applicationRepo.updateById(
        applicationId,
        {
          addmissionFeeVerification,
          updatedAt: Date.now(),
        },
      );

      const applicationStatus = await this.applicationStatusRepo.findOne({
        where: {and: [{eventName}, {applicationId}]},
      });
      if (!applicationStatus)
        throw HttpErrors.NotFound('application status not found');
      await this.applicationStatusRepo.updateById(applicationStatus?.id, {
        status: ApplicationStatus.SUBMITTED,
        updatedAt: Date.now(),
      });
      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async updateRefundLetter(
    context: any,
    refundLetter: ApplicationRequirementInput,
    applicationId: number,
    eventName: string,
  ): Promise<Success> {
    try {
      const user: User = context.user;

      const applications = await this.applicationRepo.findById(applicationId);
      if (!applications)
        throw HttpErrors.NotFound('application does not exist');
      const {studentProfileId} = applications;

      const student = await this.studentProfileRepository.findById(
        studentProfileId,
      );

      if (user.roleId === Roles.STUDENT) {
        if (student.userId != user.id)
          throw HttpErrors.Forbidden(
            'You are not authorzied to perfom this action',
          );
      }
      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studentProfileId},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to update application for this student',
          );
        }
      }
      const updaterefundLetter = await this.applicationRepo.updateById(
        applicationId,
        {
          refundLetter,
          updatedAt: Date.now(),
        },
      );

      const applicationStatus = await this.applicationStatusRepo.findOne({
        where: {and: [{eventName}, {applicationId}]},
      });
      if (!applicationStatus)
        throw HttpErrors.NotFound('application status not found');
      await this.applicationStatusRepo.updateById(applicationStatus?.id, {
        status: ApplicationStatus.SUBMITTED,
        updatedAt: Date.now(),
      });

      return {success: true};
    } catch (err) {
      throw err;
    }
  }

  async createApplciationNotes(
    context: any,
    applicationNotes: ApplicationNoteInput,
    applicationId: number,
  ): Promise<ApplicationNotes> {
    try {
      const user: User = context.user;

      const applications = await this.applicationRepo.findById(applicationId);

      if (!applications)
        throw HttpErrors.NotFound('application does not exist');
      const {studentProfileId} = applications;

      const student = await this.studentProfileRepository.findById(
        studentProfileId,
      );

      if (user.roleId === Roles.STUDENT) {
        if (student.userId != user.id)
          throw HttpErrors.Forbidden(
            'You are not authorzied to perfom this action',
          );
      }
      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studentProfileId},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to update application for this student',
          );
        }
      }
      const notes = {...applicationNotes, applicationId, sender: user.id};
      const newapplicationNote = await this.applicationNoteRepo.create(notes);

      return newapplicationNote;
    } catch (err) {
      throw err;
    }
  }

  async GetApplicationNotes(
    context: any,
    applicationId: number,
  ): Promise<ApplicationNotes> {
    try {
      const user: User = context.user;
      const application = await this.applicationRepo.findById(applicationId);
      const studentProfile = await this.studentProfileRepository.findOne({
        where: {id: application.studentProfileId},
      });
      if (!studentProfile)
        throw HttpErrors.NotFound('Student Profile not found');
      if (user.roleId === Roles.STUDENT) {
        if (user.id != studentProfile.userId)
          throw HttpErrors.Forbidden(
            'You are not authorized to perform this action',
          );
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studentProfile.id},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to get application notes for this student',
          );
        }
      }

      const applicationNotes = await this.applicationNoteRepo.findOne({
        where: {applicationId},
      });
      if (!applicationNotes)
        throw HttpErrors.NotFound('application notes not found');
      return applicationNotes;
    } catch (err) {
      throw err;
    }
  }

  async GetApplicationStatus(
    context: any,
    applicationId: number,
  ): Promise<GetApplicationStatusRes> {
    try {
      const user: User = context.user;
      const application = await this.applicationRepo.findById(applicationId);
      const studentProfile = await this.studentProfileRepository.findOne({
        where: {id: application.studentProfileId},
      });
      if (!studentProfile)
        throw HttpErrors.NotFound('Student Profile not found');
      if (user.roleId === Roles.STUDENT) {
        if (user.id != studentProfile.userId)
          throw HttpErrors.Forbidden(
            'You are not authorized to perform this action',
          );
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studentProfile.id},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to get application status for this student',
          );
        }
      }

      const applicationStatus = await this.applicationStatusRepo.find({
        where: {applicationId},
      });

      if (!applicationStatus)
        throw HttpErrors.NotFound('application notes not found');
      //@ts-ignore
      return {applicationStatus};
    } catch (err) {
      throw err;
    }
  }

  async getById(
    context: any,
    applicationId: number,
  ): Promise<StudentApplication> {
    try {
      const user: User = context.user;
      const application = await this.applicationRepo.findById(applicationId, {
        include: [
          {relation: 'studentApplicationTrackRecords'},
          {relation: 'applicationNotes'},
          {relation: 'videos'},
          {relation: 'applicationStatuses'},
          {
            relation: 'studentProfile',
            scope: {
              include: [
                {
                  relation: 'schoolAttended',
                  scope: {include: [{relation: 'documents'}]},
                },
                {relation: 'testExams'},
                {relation: 'visaAndStudyPermit'},
              ],
            },
          },
          {
            relation: 'courses',
            scope: {
              include: [
                'uniDepartment',
                'universityProfile',
                'requiredTestCourses',
              ],
            },
          },
        ],
      });
      if (!application) throw HttpErrors.NotFound('application does not exist');
      const studenProfile = await this.studentProfileRepository.findById(
        application.studentProfileId,
      );
      if (user.roleId === Roles.STUDENT) {
        if (user.id != studenProfile.userId)
          throw HttpErrors.Forbidden(
            'You are bot authorized to perform this action',
          );
      }
      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });

        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [
              {agentId: agentProfile.id},
              {studentProfileId: studenProfile.id},
            ],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to get application for this student',
          );
        }
      }

      const {
        //@ts-ignore
        courses,
        //@ts-ignore
        studentProfile,
        studentApplicationTrackRecords,
        applicationStatuses,
        ...restApplication
      } = application;
      const {uniDepartment, universityProfile, ...restCourse} = courses;
      const {visaAndStudyPermit, testExams, ...restStudentProfile} =
        studentProfile || {};
      return {
        ...restApplication,
        courseDetails: restCourse,
        universityDetails: universityProfile,
        departmentDetails: uniDepartment,
        //@ts-ignore
        applicationStatuses,
        applicationTrackRecords: studentApplicationTrackRecords,
        studentData: {
          student: restStudentProfile,
          testExams,
          visaAndStudyPermit,
        },
      };
    } catch (error) {
      this.logger.error('error getApplicationByID', error);
      throw error;
    }
  }

  async getAll(
    context: any,
    data: GetAllApplicationsInput,
    offset: number,
    count: number,
  ): Promise<StudentApplications> {
    try {
      const {
        allAgentsApplications,
        allStudentsApplications,
        agentProfileId,
        studentProfileId,
      } = data;
      const user: User = context.user;
      const whereBuilder = new WhereBuilder<Application>();
      if (user.roleId === Roles.STAFF) {
        const staff = await this.staffProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!staff) throw HttpErrors.NotFound('staff not found');

        const staffStudents = await this.studentStaffRepo.find({
          where: {
            staffProfileId: staff.id,
          },
        });
        const students = staffStudents.map(student => student.studentProfileId);

        //@ts-ignore
        whereBuilder.and(
          //@ts-ignore
          {studentProfileId: {inq: students}},
          {agentProfileId: {eq: staff?.agentId}},
        );
      }
      if (allAgentsApplications || allStudentsApplications) {
        // we check if role is rio then we return applications only belongs to rio university
        if (user.roleId === Roles.RIO) {
          const rioProfile = await this.rioProfileRepo.findOne({
            where: {userId: user.id},
            // include: ['universityProfile'],
          });

          if (!rioProfile) throw HttpErrors.NotFound('rio profile not found');

          const universityRios = await this.universityRioRepository.find({
            where: {rioProfileId: rioProfile?.id},
          });
          const univIds = universityRios.map(univ => univ.universityProfileId);
          if (univIds.length === 0) {
            return {
              id: '',
              studentApplications: [],
              total: 0,
            };
          }
          const courses = await this.coursesRepo.find({
            //@ts-ignore
            where: {universityProfileId: {inq: univIds}},
          });
          const coursesIds = courses.map(course => course.id);
          whereBuilder.inq('coursesId', coursesIds);
        }
      }

      if (
        !(allAgentsApplications && allStudentsApplications) &&
        user.roleId !== Roles.STAFF
      ) {
        if (allAgentsApplications) {
          whereBuilder.or(
            //@ts-ignore
            {agentProfileId: {neq: null}},
            {agentProfileId: {neq: undefined}},
            {agentProfileId: {neq: ''}},
          );
        } else if (allStudentsApplications) {
          whereBuilder.or(
            //@ts-ignore
            {agentProfileId: null},
            {agentProfileId: undefined},
            {agentProfileId: ''},
          );
        } else if (agentProfileId) {
          whereBuilder.eq('agentProfileId', agentProfileId);
        } else if (studentProfileId) {
          whereBuilder.eq('studentProfileId', studentProfileId);
        }
      }

      const where = whereBuilder?.build();

      const applications = await this.applicationRepo.find({
        where,
        limit: count,
        skip: offset,
        order: ['createdAt DESC'],
        include: [
          {relation: 'studentApplicationTrackRecords'},
          {relation: 'applicationNotes'},
          {relation: 'videos'},
          {relation: 'applicationStatuses'},
          {
            relation: 'studentProfile',
            scope: {
              include: [
                {
                  relation: 'schoolAttended',
                  scope: {include: [{relation: 'documents'}]},
                },
                {relation: 'testExams'},
                {relation: 'visaAndStudyPermit'},
              ],
            },
          },
          {
            relation: 'courses',
            scope: {
              include: [
                'uniDepartment',
                'universityProfile',
                'requiredTestCourses',
              ],
            },
          },
        ],
      });

      const total = await this.applicationRepo.count(where);

      const res = applications.map(item => {
        const {
          //@ts-ignore
          courses,
          applicationStatuses,
          //@ts-ignore
          studentProfile,
          studentApplicationTrackRecords,

          ...restApplication
        } = item;

        const {uniDepartment, universityProfile, ...restCourse} = courses || {};

        const {visaAndStudyPermit, testExams, ...restStudentProfile} =
          studentProfile || {};
        return {
          ...restApplication,
          applicationStatuses,
          courseDetails: (restCourse as Courses) || {},
          universityDetails: (universityProfile as UniversityProfile) || {},
          departmentDetails: (uniDepartment as UniDepartment) || {},
          applicationTrackRecords: studentApplicationTrackRecords,
          studentData: {
            student: restStudentProfile,
            testExams,
            visaAndStudyPermit,
          },
        };
      });

      let id = studentProfileId || agentProfileId || '';
      if (allAgentsApplications) id = 'allAgentsApplications';
      if (allStudentsApplications) id = 'allStudentsApplications';
      if (allStudentsApplications && allAgentsApplications)
        id = 'allApplicationsForRio';

      return {
        id,
        //@ts-ignore
        studentApplications: res,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('error getApplications', error);
      throw error;
    }
  }

  async addApplicationReq(
    context: any,
    applicationId: number,
    reqDocTitle: string,
  ): Promise<StudentApplication> {
    try {
      const addDocs = await this.studentApplicationTrackRecordRepo.create({
        applicationId,
        status: DOC_STATUS.REQUIRED,
        title: reqDocTitle,
        url: '',
      });
      const application = await this.getById(context, applicationId);
      return application;
    } catch (error) {
      this.logger.error('error addApplicationReq', error);
      throw error;
    }
  }

  // UTILS START//
  cookSchoolDetailsFilter = (
    schoolDetailsFilter: GetApplicationFilter['schoolDetailsFilter'],
    ids: string[],
  ) => {
    if (!schoolDetailsFilter && !ids.length) return;
    const uniWhereBuilder = new WhereBuilder<UniversityProfile>();
    if (schoolDetailsFilter?.campusCity?.length) {
      uniWhereBuilder.ilike('city', `%${schoolDetailsFilter?.campusCity}%`);
    }
    if (schoolDetailsFilter?.countries?.length) {
      // uniWhereBuilder.inq('country', schoolDetailsFilter?.countries);
      const regex = new RegExp(schoolDetailsFilter.countries.join('|'), 'i');
      uniWhereBuilder.regexp('country', regex);
    }
    if (schoolDetailsFilter?.provincesOrStates?.length) {
      // uniWhereBuilder.inq('state', schoolDetailsFilter?.provincesOrStates);
      const regex = new RegExp(
        schoolDetailsFilter.provincesOrStates.join('|'),
        'i',
      );
      uniWhereBuilder.regexp('state', regex);
    }
    if (schoolDetailsFilter?.schoolTypes?.length) {
      // uniWhereBuilder.inq('type', schoolDetailsFilter?.schoolTypes);
      const regex = new RegExp(schoolDetailsFilter.schoolTypes.join('|'), 'i');
      uniWhereBuilder.regexp('type', regex);
    }
    if (schoolDetailsFilter?.schools?.length) {
      // uniWhereBuilder.inq('name', schoolDetailsFilter?.schools);
      const regex = new RegExp(schoolDetailsFilter.schools.join('|'), 'i');
      uniWhereBuilder.regexp('name', regex);
    }
    if (ids.length > 0) uniWhereBuilder.inq('id', ids);
    return uniWhereBuilder.build();
  };

  cookProgramDetailsFilter = (
    programDetailsFilter: GetApplicationFilter['programDetailsFilter'],
    ids: string[],
    eligibilityFilter?: GetApplicationFilter['eligibilityFilter'],
  ) => {
    if (!programDetailsFilter && !ids.length && !eligibilityFilter) return;
    const courseWhereBuilder = new WhereBuilder<Courses>();

    const {educationLevel, gradingScale, gradingScheme} =
      eligibilityFilter || {};
    if (educationLevel) {
      courseWhereBuilder.ilike('educationLevel', `%${educationLevel}%`);
    }

    if (gradingScheme) {
      console.log('gradingscehme', gradingScheme);
      courseWhereBuilder.ilike('gradingScheme', `%${gradingScheme}%`);
    }
    if (gradingScale) {
      courseWhereBuilder.eq('gradingScale', gradingScale);
    }

    // where builder for Courses with below fields
    // level, title, intake, studyTime, fee, studyOptions, locationName, field, program
    if (programDetailsFilter?.intakeStatus?.length) {
      // const regexPattern = programDetailsFilter?.intakeStatus.join('|'); // Creates "JAN|JUN"
      // const regex = new RegExp(`(?:^|,)(${regexPattern})(?:,|$)`, 'i');

      const regex = new RegExp(
        programDetailsFilter?.intakeStatus.join('|'),
        'i',
      );
      courseWhereBuilder.regexp('intake', regex);
    }
    if (programDetailsFilter?.postSecondaryDiscipline) {
      courseWhereBuilder.ilike(
        'field',
        `%${programDetailsFilter?.postSecondaryDiscipline}%`,
      );
    }

    if (programDetailsFilter?.postSecondarySubCat) {
      courseWhereBuilder.ilike(
        'program',
        `%${programDetailsFilter?.postSecondarySubCat}%`,
      );
    }
    if (programDetailsFilter?.programLevels) {
      courseWhereBuilder.ilike(
        'level',
        `%${programDetailsFilter?.programLevels}%`,
      );
    }

    if (ids?.length > 0) {
      courseWhereBuilder.inq('id', ids);
    }
    return courseWhereBuilder.build();
  };

  cookEligibilityFilter = (
    eligibilityFilter: GetApplicationFilter['eligibilityFilter'],
    ids: string[],
  ) => {
    const {englishExamType, gmatExamScores, greExamScores, gradingScheme} =
      eligibilityFilter || {};
    if (!englishExamType && !gmatExamScores && !greExamScores && !ids.length)
      return;

    const whereBuilder = new WhereBuilder<RequiredTestCourse>();
    if (gmatExamScores) {
      whereBuilder.and({
        type: 'gmat',
        totalScore: {lte: gmatExamScores},
      });
    }
    if (greExamScores) {
      whereBuilder.and({
        type: 'gre',
        totalScore: {lte: greExamScores},
      });
    }
    if (englishExamType) {
      console.log('examtype', englishExamType);
      whereBuilder.ilike('type', `%${englishExamType}%`);
    }

    if (ids?.length > 0) {
      whereBuilder.inq('id', ids);
    }
    return whereBuilder.build();
  };
  // UTILS END//

  async getUniForApplication(
    context: any,
    filter: GetApplicationFilter,
  ): Promise<UniversitiesData> {
    try {
      const {
        eligibilityFilter,
        pagination,
        programDetailsFilter,
        schoolDetailsFilter,
      } = filter || {};

      const courseWhereBuilder = this.cookProgramDetailsFilter(
        programDetailsFilter,
        [],
        eligibilityFilter,
      );
      const courses = await this.coursesRepo.find({
        where: courseWhereBuilder,
      });

      const uniIds = courses.map(item => item?.universityProfileId);
      const uniWhereBuilder = this.cookSchoolDetailsFilter(
        schoolDetailsFilter,
        uniIds,
      );

      const universitiesProfile = await this.universityProfileRepo.find({
        where: uniWhereBuilder,
        limit: pagination?.count || 999,
        skip: pagination?.offset || 0,
        order: ['createdAt DESC'],
        include: [
          {relation: 'locations'},
          {relation: 'rankings'},
          {
            relation: 'uniDepartments',
            scope: {
              include: [
                {
                  relation: 'courses',
                  scope: {include: ['requiredTestCourses']},
                },
              ],
            },
          },
        ],
      });
      // {relation: 'courses', scope: {include: ['uniDepartment', 'universityProfile', 'requiredTestCourses']}},

      const total = await this.universityProfileRepo.count(uniWhereBuilder);
      return {
        universitiesProfile,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('error getUniversities', error);
      throw error;
    }
  }

  async getSubjectsForApplication(
    context: any,
    filter: GetApplicationFilter,
  ): Promise<SubjectsData> {
    try {
      const {
        eligibilityFilter,
        pagination,
        programDetailsFilter,
        schoolDetailsFilter,
      } = filter || {};

      let courseIds: string[] | null = [];

      if (schoolDetailsFilter) {
        const uniWhereBuilder = this.cookSchoolDetailsFilter(
          schoolDetailsFilter,
          [],
        );

        const unis = await this.universityProfileRepo.find({
          where: uniWhereBuilder,
          order: ['updatedAt DESC'],
          include: [
            {
              relation: 'uniDepartments',
              scope: {
                include: [
                  {
                    relation: 'courses',
                    scope: {include: ['requiredTestCourses']},
                  },
                ],
              },
            },
          ],
        });

        //extract courses ids from uni
        courseIds = unis.reduce((ids: string[], university) => {
          if (!university.uniDepartments) return ids;
          university.uniDepartments.forEach(department => {
            if (!department.courses) return ids;
            department.courses.forEach((course: Courses) => {
              ids.push(course.id);
            });
          });
          return ids;
        }, []);
        console.log('ids', courseIds);
      }
      if (eligibilityFilter) {
        const eligibilityWhereBuilder = this.cookEligibilityFilter(
          eligibilityFilter,
          [],
        );

        if (eligibilityWhereBuilder) {
          let ids: any = [];
          const requiredTestCourses = await this.requiredTestCourseRepo.find({
            where: eligibilityWhereBuilder,
            order: ['updatedAt DESC'],
          });
          console.log('Requiredtest', requiredTestCourses);

          if (requiredTestCourses.length === 0) {
            return {courses: [], total: 0};
          }
          requiredTestCourses.forEach(item => {
            if (item?.coursesId) {
              console.log('in ifc');
              ids.push(item?.coursesId);

              // console.log('courseIDS', courseIds);
              // if (!courseIds?.includes(item.coursesId)) {
              //   console.log('times');
              //   courseIds?.push(item.coursesId);
              // }
            }
          });
          courseIds = ids;
          // console.log('courseids', courseIds);
        }
      }

      const courseWhereBuilder = this.cookProgramDetailsFilter(
        programDetailsFilter,
        courseIds || [],
        eligibilityFilter,
      );
      console.log('Coursebuikder', courseWhereBuilder);
      const courses = await this.coursesRepo.find({
        where: courseWhereBuilder,
        limit: pagination?.count || 999,
        skip: pagination?.offset || 0,
        order: ['updatedAt DESC'],
        include: ['requiredTestCourses'],
      });

      const total = await this.coursesRepo.count(courseWhereBuilder);
      return {
        courses,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('error getSubjectsForApplication', error);
      throw error;
    }
  }

  // updateStatus application status
  async SubmitApplicationRequirements(
    context: any,
    eventName: string,
    applicationId: number,
    status?: ApplicationStatus,
  ): Promise<Success> {
    const transaction = await this.applicationRepo.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const user: User = context.user;
      const applicationProfile = await this.applicationRepo.findById(
        applicationId,
      );
      if (!applicationProfile)
        throw HttpErrors.NotFound('application not found');

      const student = await this.studentProfileRepository.findOne({
        where: {id: applicationProfile.studentProfileId},
      });

      if (!student) throw HttpErrors.NotFound('student not found');
      if (user.roleId === Roles.STUDENT) {
        if (user.id != student.userId)
          throw HttpErrors.Forbidden(
            'You are not authorized to perform such actions',
          );
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');
        const isAgentStudent = await this.agentStudentRepo.findOne({
          where: {
            and: [{agentId: agentProfile.id}, {studentProfileId: student.id}],
          },
        });

        if (!isAgentStudent) {
          throw HttpErrors.Forbidden(
            'you are not authorized to update application status for this student',
          );
        }
      }

      if (
        eventName === EventNames.ADMISSION_FEE_VERIFICATION &&
        status === ApplicationStatus.APPROVED
      ) {
        await this.applicationRepo.updateById(
          applicationId,
          {
            paymentStatus: TutionFeeVerification.PAID,
            updatedAt: Date.now(),
          },
          {transaction},
        );
      }

      const applicationStatus = await this.applicationStatusRepo.findOne({
        where: {and: [{eventName}, {applicationId}]},
      });

      let changeStatus = ApplicationStatus.SUBMITTED;

      if (user.roleId === Roles.RIO || user.roleId === Roles.ADMIN) {
        changeStatus = status || changeStatus;
        console.log('change status', changeStatus);
      }

      if (!applicationStatus)
        throw HttpErrors.NotFound('application status not found');
      const updateStatus = await this.applicationStatusRepo.updateById(
        applicationStatus.id,
        {
          status: changeStatus,
          updatedAt: Date.now(),
        },
        {transaction},
      );
      await transaction.commit();
      return {
        success: true,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('error getSubjectsForApplication', error);
      throw error;
    }
  }

  async createApplicationFeePaymentSession(
    context: any,
    applicationId: number,
  ): Promise<string> {
    try {
      const user: User = context.user;

      const application = await this.applicationRepo.findById(applicationId);
      if (!application) throw new HttpErrors.NotFound('Application not found');

      if (user.roleId === Roles.STUDENT) {
        const studentProfile = await this.studentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!studentProfile)
          throw new HttpErrors.Forbidden('Student profile is not setup');

        if (studentProfile.id !== application.studentProfileId) {
          throw new HttpErrors.Forbidden("Cannot update other's application");
        }
      }

      if (user.roleId === Roles.AGENT) {
        const agentProfile = await this.agentProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!agentProfile)
          throw new HttpErrors.Forbidden('Invalid agent profile');
        const studentAgent = await this.agentStudentRepo.findOne({
          where: {
            studentProfileId: application.studentProfileId,
            agentId: agentProfile.id,
          },
        });
        if (!studentAgent)
          throw new HttpErrors.Forbidden(
            'Applicant is not associated with agent',
          );
      }

      if (user.roleId === Roles.STAFF) {
        const staffProfile = await this.staffProfileRepository.findOne({
          where: {userId: user.id},
        });
        if (!staffProfile)
          throw new HttpErrors.Forbidden('Invalid staff profile');
        const staffAgent = await this.agentProfileRepository.findById(
          staffProfile.agentId,
        );
        if (!staffAgent)
          throw new HttpErrors.Forbidden('Staff not assigned to agent');

        const studentAgent = await this.agentStudentRepo.findOne({
          where: {
            studentProfileId: application.studentProfileId,
            agentId: staffAgent.id,
          },
        });
        if (!studentAgent)
          throw new HttpErrors.Forbidden(
            "Applicant is not associated with Staff's agent",
          );
      }

      const course: any = await this.coursesRepo.findById(
        application.coursesId,
        {include: ['universityProfile']},
      );
      if (!course)
        throw new HttpErrors.Forbidden('Application is for an invalid program');

      if (
        application.applicationFeePaymentStatus ==
        APPLICATION_FEE_STATUS_ENUM.PAID
      ) {
        throw new HttpErrors.Conflict('Application fee is already paid');
      }

      if (
        application.applicationFeeCheckoutSessionId &&
        application.applicationFeePaymentStatus !=
          APPLICATION_FEE_STATUS_ENUM.PAID
      ) {
        await this.stripeService.expireCheckoutSession(
          application.applicationFeeCheckoutSessionId,
        );
      }

      const checkoutSession =
        await this.stripeService.createApplicationFeeCheckoutSession(
          //@ts-ignore
          user,
          application,
          course,
          course.universityProfile,
          application,
        );
      this.applicationRepo.updateById(applicationId, {
        applicationFeeCheckoutSessionId: checkoutSession.id,
      });
      return checkoutSession.url;
    } catch (error) {
      this.logger.error('error getSubjectsForApplication', error);
      throw error;
    }
  }

  // updateOfferLetter
  async updateOfferLetter(
    context: any,
    applicationId: number,
    offerLetterUrl: string,
    eventName: string,
  ): Promise<Success> {
    try {
      const user = context.user;

      const application = await this.applicationRepo.findById(applicationId);
      if (!application) throw new HttpErrors.NotFound('Application not found');

      if (application.offerLetter) {
        await this.applicationRepo.updateById(applicationId, {
          offerLetter: {
            ...application.offerLetter,
            id: applicationId,
            dateOfUpload: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            url: offerLetterUrl,
          },
          updatedAt: Date.now(),
        });
      } else {
        await this.applicationRepo.updateById(applicationId, {
          offerLetter: {
            id: applicationId,
            createdAt: new Date().toISOString(),
            dateOfUpload: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            url: offerLetterUrl,
          },
          updatedAt: Date.now(),
        });
      }
      const applicationStatus = await this.applicationStatusRepo.findOne({
        where: {and: [{eventName}, {applicationId}]},
      });
      if (!applicationStatus)
        throw HttpErrors.NotFound('application status not found');
      await this.applicationStatusRepo.updateById(applicationStatus?.id, {
        status: ApplicationStatus.SUBMITTED,
        updatedAt: Date.now(),
      });
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('error getSubjectsForApplication', error);
      throw error;
    }
  }

  // updateVisaSupportLetter
  async updateVisaSupportLetter(
    context: any,
    applicationId: number,
    visaSupportLetterUrl: string,
    eventName: string,
  ): Promise<Success> {
    try {
      const user = context.user;

      const application = await this.applicationRepo.findById(applicationId);
      if (!application) throw new HttpErrors.NotFound('Application not found');

      if (application.visaSupportLetter) {
        await this.applicationRepo.updateById(applicationId, {
          visaSupportLetter: {
            ...application.visaSupportLetter,
            id: applicationId,
            dateOfUpload: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            url: visaSupportLetterUrl,
          },
          updatedAt: Date.now(),
        });
      } else {
        await this.applicationRepo.updateById(applicationId, {
          visaSupportLetter: {
            id: applicationId,
            createdAt: new Date().toISOString(),
            dateOfUpload: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            url: visaSupportLetterUrl,
          },
          updatedAt: Date.now(),
        });
      }
      const applicationStatus = await this.applicationStatusRepo.findOne({
        where: {and: [{eventName}, {applicationId}]},
      });
      if (!applicationStatus)
        throw HttpErrors.NotFound('application status not found');
      await this.applicationStatusRepo.updateById(applicationStatus?.id, {
        status: ApplicationStatus.SUBMITTED,
        updatedAt: Date.now(),
      });
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error('error getSubjectsForApplication', error);
      throw error;
    }
  }

  async deleteApplication(
    context: any,
    applicationId: number,
  ): Promise<Success> {
    try {
      let application = await this.applicationRepo.findById(applicationId);
      if (!application) throw HttpErrors.NotFound('appplication not found');

      await this.applicationRepo.deleteById(applicationId);
      return {success: true};
    } catch (err) {
      throw err;
    }
  }
}
