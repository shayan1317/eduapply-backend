import {Roles} from './../schema/enums.type';

import {inject} from '@loopback/core';
import {
  arg,
  authorized,
  GraphQLBindings,
  ID,
  mutation,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {StudentController} from '../controllers';
import {
  AuthenticatedUser,
  GetStudentRes,
  GetStudentsRes,
  ResEnrolledAgentsStudents,
  ResRevenueFromStudents,
  ResTotalRevenueAndTotalCount,
  ResTotalRevenueFromStudents,
  SchoolAttended,
  SignupStudent,
  StudentProfile,
  Success,
  TestInformation,
  TestsAndExamsResultsStudent,
  visaInformation,
} from '../schema';
import {
  AddTestsAndExamsResultsStudentInput,
  AddVisaAndStudyPermitStudentInput,
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
@resolver()
export class StudentResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.StudentController')
    private studentController: StudentController,
  ) {}

  @mutation(returns => SignupStudent)
  async studentSignup(
    @arg('student') student: CreateStudentUserInput,
  ): Promise<SignupStudent> {
    return this.studentController.signUp(this.resolverData.context, student);
  }

  @mutation(returns => AuthenticatedUser)
  async loginStudent(
    @arg('credentials') credentials: CredentialsInput,
  ): Promise<AuthenticatedUser> {
    return this.studentController.login(this.resolverData.context, credentials);
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => GetStudentRes)
  async getStudentById(
    @arg('studentId', type => ID) studentId: string,
  ): Promise<GetStudentRes> {
    return this.studentController.getStudent(
      this.resolverData.context,
      studentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
  ])
  @query(returns => GetStudentRes)
  async getStudentProfile(): Promise<GetStudentRes> {
    return this.studentController.getStudentProfile(this.resolverData.context);
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => GetStudentsRes)
  async getStudents(
    @arg('offset', {
      defaultValue: 0,
      description: 'Number of results to to skip, default is 0',
    })
    offset: number,
    @arg('count', {
      defaultValue: 10,
      description: 'Number of results to return, default is 10',
    })
    count: number,
    @arg('filter', {
      nullable: true,
      description: 'filter the data using below field',
    })
    filter: Filter,

    @arg('agentId', type => ID, {nullable: true}) agentId?: string,
  ): Promise<GetStudentsRes> {
    return this.studentController.getStudents(
      this.resolverData.context,
      offset,
      count,
      filter,
      agentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => GetStudentRes)
  async createStudent(
    @arg('createStudentData') createStudentData: CreateStudentData,
  ): Promise<GetStudentRes> {
    return this.studentController.createStudent(
      this.resolverData.context,
      createStudentData,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STAFF,
    Roles.AGENT,
  ])
  @mutation(returns => Success)
  async deleteStudentById(
    @arg('studentId', type => ID) studentId: string,
  ): Promise<Success> {
    return this.studentController.deleteById(
      this.resolverData.context,
      studentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STAFF,
    Roles.AGENT,
  ])
  @mutation(returns => StudentProfile)
  async editStudent(
    @arg('studentId', type => ID) studentId: string,
    @arg('editStudentInput') editStudentInput: EditStudentInput,
  ): Promise<StudentProfile> {
    return this.studentController.edit(
      this.resolverData.context,
      studentId,
      editStudentInput,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
  ])
  @mutation(returns => Success)
  async completeGeneralInfoStudent(
    @arg('studentId', type => ID) studentId: string,
    @arg('completeGeneralInfoStudentInput')
    completeGeneralInfoStudentInput: CompleteGeneralInfoStudentInput,
  ): Promise<Success> {
    return this.studentController.completeGeneralInfo(
      this.resolverData.context,
      studentId,
      completeGeneralInfoStudentInput,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.STUDENT])
  @mutation(returns => Success)
  async completeEducationHistoryStudent(
    @arg('studentId', type => ID) studentId: string,
    @arg('CompleteEducationHistoryStudentInput')
    completeEducationHistoryStudentInput: CompleteEducationHistoryStudentInput,
  ): Promise<Success> {
    return this.studentController.completeEducationHistory(
      this.resolverData.context,
      studentId,
      completeEducationHistoryStudentInput,
    );
  }

  @authorized([
    Roles.AGENT,
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @mutation(returns => SchoolAttended)
  async addSchoolAttended(
    @arg('studentId', type => ID) studentId: string,
    @arg('schoolAttended', type => SchoolAttendedInput)
    schoolAttended: SchoolAttendedInput,
  ): Promise<SchoolAttended> {
    return this.studentController.createSchoolAttended(
      this.resolverData.context,
      schoolAttended,
      studentId,
    );
  }

  @authorized([
    Roles.AGENT,
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async updateSchoolAttendedById(
    @arg('schoolAttendedId', type => ID) schoolAttendedId: string,
    @arg('schoolAttended') schoolAttended: SchoolAttendedInput,
  ): Promise<Success> {
    return this.studentController.updateSchoolAttended(
      this.resolverData.context,
      schoolAttendedId,
      schoolAttended,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @mutation(returns => TestsAndExamsResultsStudent)
  async AddTestsAndExamsResultsStudent(
    @arg('addTestsAndExamsResultsStudentInput')
    addTestsAndExamsResultsStudentInput: AddTestsAndExamsResultsStudentInput,
  ): Promise<TestsAndExamsResultsStudent> {
    return this.studentController.addTestsAndExamsResults(
      this.resolverData.context,
      addTestsAndExamsResultsStudentInput,
    );
  }

  @authorized([
    Roles.AGENT,
    Roles.ADMIN,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @mutation(returns => TestInformation)
  async CreateTests(
    @arg('studentId', type => ID) studentId: string,
    @arg('test') test: TestInformationInput,
  ): Promise<TestInformation> {
    return this.studentController.createTests(
      this.resolverData.context,
      test,
      studentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.AGENT,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async updateTestsAndExamsResultsStudent(
    @arg('studentTestsId', type => ID) studentTestsId: string,
    @arg('addTestsAndExamsResultsStudentInput')
    addTestsAndExamsResultsStudentInput: TestInformationInput,
  ): Promise<Success> {
    return this.studentController.updateTestsAndExamsResults(
      this.resolverData.context,
      addTestsAndExamsResultsStudentInput,
      studentTestsId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @mutation(returns => visaInformation)
  async addVisaAndPermitStudent(
    @arg('studentId', type => ID)
    studentId: string,
    @arg('addVisaAndStudyPermitStudentInput')
    addVisaAndStudyPermitStudent: AddVisaAndStudyPermitStudentInput,
  ): Promise<visaInformation> {
    return this.studentController.addVisaAndPermit(
      this.resolverData.context,
      addVisaAndStudyPermitStudent,
      studentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async updateVisaInfoById(
    @arg('visaId', type => ID) visaId: string,
    @arg('addVisaAndStudyPermitStudent')
    addVisaAndStudyPermitStudent: AddVisaAndStudyPermitStudentInput,
  ): Promise<Success> {
    return this.studentController.UpdateVisaInfo(
      this.resolverData.context,
      addVisaAndStudyPermitStudent,
      visaId,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => ResEnrolledAgentsStudents)
  async getEnrolledAgentsStudents(
    @arg('enrollementYear') enrollementYear: string,
  ): Promise<ResEnrolledAgentsStudents> {
    return this.studentController.getEnrolledAgentsStudents(
      this.resolverData.context,
      enrollementYear,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => ResRevenueFromStudents)
  async getRevenueFromStudents(
    @arg('revenueYear') enrollementYear: string,
    @arg('agentId', type => ID, {nullable: true}) agentId: string,
  ): Promise<ResRevenueFromStudents> {
    return this.studentController.getRevenueFromStudents(
      this.resolverData.context,
      enrollementYear,
      agentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => ResTotalRevenueFromStudents)
  async getTotalRevenueFromStudents(
    @arg('revenueYear', {nullable: true}) enrollementYear?: string,
    @arg('agentId', type => ID, {nullable: true}) agentId?: string,
  ): Promise<ResTotalRevenueFromStudents> {
    return this.studentController.getTotalRvenue(
      this.resolverData.context,
      enrollementYear,
      agentId,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => ResTotalRevenueAndTotalCount)
  async getTotalRevenueAndStudentsAgentsUniversitiesCount(): Promise<ResTotalRevenueAndTotalCount> {
    return this.studentController.getTotalRevenueAndStudentsAgentsUniversitiesCount(
      this.resolverData.context,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async finishStepperFlow(
    @arg('studentId', type => ID, {nullable: true}) studentId: string,
  ): Promise<Success> {
    return this.studentController.FinishStepperFlow(
      this.resolverData.context,
      studentId,
    );
  }
}
