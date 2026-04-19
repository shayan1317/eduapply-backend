import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';
import {Documents} from './generic.type';
import {StudentProfile} from './student.type';
import {User} from './user.type';

@objectType({description: 'Agent object'})
export class CompleteAgentProfile {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  agentNumber: number;

  @field()
  name: string;

  @field({
    nullable: true,
  })
  @property()
  photo?: string;

  @field()
  email: string;
  @field({nullable: true})
  phone?: string;
  @field({nullable: true})
  preferedContactMethod?: string;
  @field()
  isRefered?: string;
  @field({nullable: true})
  serviceProvidedToClients?: string;
  @field({nullable: true})
  findAboutEduction?: string;
  @field({nullable: true})
  recruitingYear?: Date;
  @field({nullable: true})
  gender?: string;
  @field({nullable: true})
  acitveAgencyAt?: string;
  @field({nullable: true})
  facebookLink?: string;
  @field({nullable: true})
  instaLink?: string;
  @field({nullable: true})
  city?: string;
  @field({nullable: true})
  state?: string;
  @field({nullable: true})
  country?: string;
  @field({nullable: true})
  postalCode?: string;
  @field({nullable: true})
  businessName?: string;
  @field({nullable: true})
  businessWebsiteURL?: string;
  @field({nullable: true})
  businessCertificate?: string;
  @field({nullable: true})
  businessLogo?: string;

  @field(type => [RecruitmentDetails], {nullable: true})
  recruitmentTo?: RecruitmentDetails[];
  @field(type => [RecruitmentDetails], {nullable: true})
  recruitmentFrom?: RecruitmentDetails[];
  @field({nullable: true})
  @field({nullable: true})
  marketingType?: string;
  @field({nullable: true})
  mainSource?: string;
  @field({nullable: true})
  serviceFee?: string;
  @field({nullable: true})
  whyEducationOverCompetitors?: string;
  @field({nullable: true})
  helpToGrowYourBusiness?: string;
  @field({nullable: true})
  additionalComments?: string;

  @field(type => Date)
  createdAt?: Date;

  @field(type => Date, {nullable: true})
  updatedAt?: Date;
}
@objectType({description: 'student recruitment data'})
export class RecruitmentDetails {
  @field({nullable: true})
  country: string;

  @field({nullable: true})
  volume: string;
}

@objectType({description: 'Agent with Docs object'})
export class ResCompleteAgentProfile {
  @field(type => ID)
  id: string;
  @field(type => CompleteAgentProfile)
  agent: CompleteAgentProfile;
}
@objectType({description: 'Agent object'})
@model({settings: {strict: false}})
export class AgentProfile {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  agentNumber: number;

  @field()
  @property()
  userId: string;

  @field()
  @property()
  name: string;

  @field()
  @property()
  email: string;

  @field({
    nullable: true,
  })
  @property()
  photo?: string;

  @field({nullable: true})
  @property()
  phone: string;

  @field({nullable: true})
  @property()
  designation?: string;

  @field({nullable: true})
  @property()
  department?: string;

  @field(type => Date, {nullable: true})
  @property()
  dob: Date;

  @field({nullable: true})
  ratings?: number;

  @field({nullable: true})
  review?: string;

  @field({nullable: true})
  @property()
  education?: string;

  @field({nullable: true})
  @property()
  website?: string;

  @field(type => Date, {nullable: true})
  @property()
  createdAt?: Date;

  @field(type => Date, {nullable: true})
  @property()
  updatedAt?: Date;

  @field({nullable: true})
  @property()
  gender?: string;

  @field({nullable: true})
  @property()
  acitveAgencyAt?: string;

  @field({nullable: true})
  @property()
  street?: string;

  @field({nullable: true})
  @property()
  city?: string;

  @field({nullable: true})
  @property()
  state?: string;

  @field({nullable: true})
  @property()
  postalCode?: string;

  @field({nullable: true})
  @property()
  country?: string;

  @field({nullable: true})
  @property()
  bankName?: string;

  @field({nullable: true})
  @property()
  accountHolderName?: string;

  @field({nullable: true})
  @property()
  AccountNumber?: string;

  @field({nullable: true})
  @property()
  iban?: string;

  @field({nullable: true})
  @property()
  branchName?: string;

  @field({nullable: true})
  @property()
  transitNumber?: string;

  @field({nullable: true})
  @property()
  swiftCode?: string;

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

  @field({nullable: true})
  @property()
  status?: string;

  @field({nullable: true})
  @property()
  totalStudents?: number;

  @field({nullable: true})
  @property()
  totalApplications?: number;
}

@objectType({description: 'Agent with Docs object'})
@model({settings: {strict: false}})
export class AgentData {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field(type => AgentProfile)
  agentProfile: AgentProfile;

  @field(type => [Documents], {
    nullable: true,
  })
  documents: Documents[];
}

@objectType({description: 'Get Pagination Agent'})
@model({settings: {strict: false}})
export class AgentsData {
  @field(type => [AgentProfile])
  agentsProfile: AgentProfile[];

  @field()
  @property()
  total: number;
}

@objectType({description: 'Agent signup'})
@model({settings: {strict: false}})
export class AgentSignUp {
  @field(type => CompleteAgentProfile)
  agentsProfile: CompleteAgentProfile;

  @field({
    nullable: false,
    description: 'true if operation was successful',
  })
  success: boolean;

  @field(type => User)
  user: User;

  @field()
  token: string;
}
@objectType({description: 'Agent signup'})
export class verifyToken {
  @field()
  token: string;
  @field({
    nullable: false,
    description: 'true if operation was successful',
  })
  success: boolean;
  // @field(type => User)
  // user: User;
}

@objectType({description: 'staff profile'})
export class StaffProfile {
  @field({nullable: true})
  id?: string;
  @field({nullable: true})
  name?: string;
  @field({nullable: true})
  workEmail?: string;

  @field({
    nullable: true,
  })
  photo?: string;
  @field({nullable: true})
  jobTitle?: string;
  @field({nullable: true})
  ipRestriction?: string;
  @field({nullable: true})
  birthDate?: string;
  @field({nullable: true})
  education?: string;
  @field({nullable: true})
  website?: string;
  @field({nullable: true})
  gender?: string;
  @field({nullable: true})
  country?: string;
  @field({nullable: true})
  state?: string;
  @field({nullable: true})
  street?: string;
  @field({nullable: true})
  city?: string;
  @field({nullable: true})
  postalCode?: string;
  @field({nullable: true})
  updatedAt?: Date;
  @field({nullable: true})
  createdAt?: Date;
}
@objectType({description: 'staff profile'})
export class ResCompleteStaffProfile {
  @field(type => StaffProfile, {
    nullable: true,
  })
  staff: StaffProfile;
  @field(type => [StudentProfile])
  assignedStudents: StudentProfile[];

  @field()
  @property()
  total: number;
}
@objectType({description: 'staff profile'})
export class Staffs {
  @field(type => [StaffProfile], {
    nullable: true,
  })
  staffs: StaffProfile[];

  @field({
    nullable: true,
  })
  count: number;
}

@objectType({description: 'agent review by admin'})
export class ReviewAgent {
  @field()
  ratings: number;

  @field()
  review: string;
}
