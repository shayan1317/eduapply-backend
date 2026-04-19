import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';

import {StaffProfile} from './agent.type';
import {SchoolAttended} from './generic.type';
import {TestInformation} from './test.type';
import {User} from './user.type';
@objectType({description: 'visa details'})
export class visaInformation {
  @field(type => ID)
  id: string;

  @field({
    nullable: true,
  })
  everRefusedEuVisa?: boolean;

  @field({nullable: true})
  studentProfileId?: string;
  @field({
    nullable: true,
  })
  spainVisa?: boolean;

  @field({
    nullable: true,
  })
  schengenF1Visa?: boolean;

  @field({
    nullable: true,
  })
  ukStudyVisa?: boolean;

  @field({
    nullable: true,
  })
  switzerlandTier4Visa?: boolean;

  @field({
    nullable: true,
  })
  irelandStamp2?: boolean;

  @field({
    nullable: true,
  })
  isHavingVisa?: boolean;

  @field({
    nullable: true,
  })
  visaDetails?: string;

  @field({
    nullable: true,
  })
  fakePrevStatmentOrDocs?: boolean;

  @field(type => Date)
  createdAt?: Date;

  @field(type => Date)
  updatedAt?: Date;
}
@objectType({description: 'Profile object'})
@model({settings: {strict: false}})
export class StudentProfile {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  studentNumber: number;

  @field()
  @property()
  firstname: string;

  @field()
  @property()
  email: string;

  @field()
  @property()
  lastname: string;

  @field({
    nullable: true,
  })
  @property()
  middlename?: string;

  @field({
    defaultValue: false,
  })
  @property()
  isStepperCompleted: boolean;
  @field({
    nullable: true,
  })
  @property()
  photo?: string;

  @field(type => Date)
  createdAt?: Date;

  @field(type => Date)
  updatedAt?: Date;

  @field()
  @property()
  userId: string;

  @field({nullable: true})
  @property()
  dob?: Date;

  @field({
    nullable: true,
  })
  @property()
  citizenship?: string;

  @field({
    nullable: true,
  })
  @property()
  firstLanguage?: string;

  @field({
    nullable: true,
  })
  @property()
  passportNumber?: string;

  @field(type => Date, {
    nullable: true,
  })
  @property()
  passportExpiryDate?: Date;

  @field({
    nullable: true,
  })
  @property()
  gender?: string;

  @field({
    nullable: true,
  })
  @property()
  martialStatus?: string;

  @field({
    nullable: true,
  })
  @property()
  address?: string;

  @field({
    nullable: true,
  })
  @property()
  cityTown?: string;

  @field({
    nullable: true,
  })
  @property()
  country?: string;

  @field({
    nullable: true,
  })
  @property()
  state?: string;

  @field({
    nullable: true,
  })
  @property()
  postalZipCode?: string;

  @field({
    nullable: true,
  })
  @property()
  countryOfEducation?: string;

  @field({
    nullable: true,
  })
  @property()
  HighestLevelOfEducation?: string;

  @field({
    nullable: true,
  })
  @property()
  gradingScheme?: string;

  @field({
    nullable: true,
  })
  @property()
  gradeAverage?: string;

  @field({
    nullable: true,
  })
  @property()
  familyname?: string;

  @field({
    nullable: true,
  })
  @property()
  skype?: string;

  @field({
    nullable: true,
  })
  @property()
  serviceInterest?: string;

  @field({
    nullable: true,
  })
  @property()
  referralSource?: string;

  @field({
    nullable: true,
  })
  @field({
    nullable: true,
  })
  isGraduated?: boolean;
  @property()
  status?: string;

  @field({
    nullable: true,
  })
  @property()
  intake?: string;

  @field({
    nullable: true,
  })
  @property()
  phone?: string;

  @field({
    nullable: true,
  })
  @property()
  fundingSource?: string;

  @field()
  @property()
  profileCompleted: boolean;

  @field({
    nullable: true,
  })
  @property()
  gradeScale?: string;

  @field(type => [SchoolAttended], {
    nullable: true,
  })
  schoolAttended?: SchoolAttended[];
}

@objectType({description: 'Profile object'})
@model({settings: {strict: true}})
export class GetStudentRes {
  @field(type => StudentProfile)
  student: StudentProfile;

  @field(type => [TestInformation], {
    nullable: true,
  })
  testExams: TestInformation[];

  @field(type => [StaffProfile], {
    nullable: true,
  })
  assignedStaffs?: StaffProfile[];

  @field({nullable: true})
  total?: number;

  @field(type => visaInformation, {
    nullable: true,
  })
  visaAndStudyPermit: visaInformation;
}

@objectType({description: 'Profile object'})
@model({settings: {strict: false}})
export class GetStudentsRes {
  @field(type => [StudentProfile])
  students: StudentProfile[];

  @field()
  @property()
  total: number;
}

@objectType({description: 'Authenticated student and access token'})
export class SignupStudent {
  @field({
    nullable: false,
    description: 'true if operation was successful',
  })
  success: boolean;

  @field(type => StudentProfile)
  studentProfile: StudentProfile;

  @field(type => User)
  user: User;

  @field()
  token: string;
}

@objectType({description: 'test info'})
export class TestsAndExamsResultsStudent {
  @field(type => ID)
  id: string;

  @field(type => [TestInformation], {
    nullable: true,
  })
  testInformation?: TestInformation[];
}

@objectType({description: 'enrolled students and agents'})
export class EnrolledAgentsStudents {
  @field({nullable: true})
  month?: string;
  @field({nullable: true})
  agents?: number;
  @field({nullable: true})
  students?: number;
}

@objectType({description: 'test info'})
export class ResEnrolledAgentsStudents {
  @field(type => [EnrolledAgentsStudents], {nullable: true})
  enrolledAgentsStudents?: EnrolledAgentsStudents[];
}

@objectType({description: 'test info'})
export class RevenueFromStudents {
  @field({nullable: true})
  appicationFeeInusd: number;

  @field({nullable: true})
  appicationFeeInaed: number;
  @field({nullable: true})
  appicationFeeIngbp: number;
  @field({nullable: true})
  appicationFeeIneur: number;

  @field({nullable: true})
  applicationsCount: number;

  @field({nullable: true})
  month: string;
}
@objectType({description: 'test info'})
export class ResRevenueFromStudents {
  @field(type => [RevenueFromStudents], {nullable: true})
  revenueFromStudents?: RevenueFromStudents[];
}

@objectType({description: 'test info'})
export class TotalRevenue {
  @field({nullable: true})
  value: number;
}
@objectType({description: 'test info'})
export class ResTotalRevenueFromStudents {
  @field(type => [TotalRevenue], {nullable: true})
  revenueFromStudents?: TotalRevenue[];
  @field({defaultValue: 0})
  total: number;
}

@objectType({
  description: 'get total revenue and students,agent and universities count',
})
export class ResTotalRevenueAndTotalCount {
  @field({defaultValue: 0})
  totalStudents?: number;

  @field({defaultValue: 0})
  totalAgents: number;

  @field({defaultValue: 0})
  totalUniversities?: number;
  @field({defaultValue: 0})
  totalRevenue?: number;
}
