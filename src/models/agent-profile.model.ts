import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {AgentStudent} from './agent-student.model';
import {Application} from './application.model';
import {StaffProfile} from './staff-profile.model';
import {StudentProfile} from './student-profile.model';
import {User} from './user.model';

export class Item {
  country: string;
  volume: string;
}
@model()
export class AgentProfile extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  @property({
    type: 'number',
    required: true,
    generated: false,
  })
  agentNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: false,
  })
  phone: string;

  @property({
    type: 'string',
    required: false,
  })
  photo?: string;

  @property({
    type: 'string',
    required: false,
  })
  skype?: string;

  @property({
    type: 'string',
    default: 'other',
  })
  serviceInterest?: string;

  @property({
    type: 'string',
    default: 'other',
  })
  referralSource?: string;

  @property({
    type: 'string',
    default: 'New lead',
  })
  status?: string;

  @property({
    type: 'string',
    required: false,
  })
  designation?: string;

  @property({
    type: 'string',
    required: false,
  })
  department?: string;

  @property({
    type: 'date',
    required: false,
  })
  dob: Date;

  @property({
    type: 'string',
    required: false,
  })
  education?: string;

  @property({
    type: 'string',
    required: false,
  })
  website?: string;

  @property({
    type: 'string',
    required: false,
  })
  gender: string;

  @property({
    type: 'string',
    required: false,
  })
  acitveAgencyAt: string;

  @property({
    type: 'string',
    required: false,
  })
  street?: string;

  @property({
    type: 'string',
    required: false,
  })
  city: string;

  @property({
    type: 'string',
    required: false,
  })
  state: string;

  @property({
    type: 'string',
    required: false,
  })
  country: string;

  @property({
    type: 'string',
    required: false,
  })
  postalCode: string;

  @property({
    type: 'string',
    required: false,
  })
  bankName?: string;

  @property({
    type: 'string',
    required: false,
  })
  accountHolderName?: string;

  @property({
    type: 'string',
    required: false,
  })
  AccountNumber?: string;

  @property({
    type: 'string',
    required: false,
  })
  iban?: string;

  @property({
    type: 'string',
    required: false,
  })
  branchName?: string;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
  })
  updatedAt: Date;

  @property({
    type: 'string',
    required: false,
  })
  transitNumber?: string;

  @property({
    type: 'string',
    required: false,
  })
  swiftCode?: string;

  // completagentprofile

  @property({
    type: 'string',
    required: false,
  })
  preferedContactMethod?: string;

  @property({
    type: 'string',

    default: false,
  })
  isRefered?: string;

  @property({
    type: 'string',
    default: 'other',
  })
  serviceProvidedToClients?: string;

  @property({
    type: 'string',
  })
  findAboutEduction?: string;

  @property({
    type: 'date',
    required: false,
  })
  recruitingYear?: Date;
  @property({
    type: 'string',
    required: false,
  })
  mainSource?: string;

  @property({
    type: 'string',
    required: false,
  })
  facebookLink?: string;
  @property({
    type: 'string',
    required: false,
  })
  instaLink?: string;

  @property({
    type: 'string',
    required: false,
  })
  businessName?: string;

  @property({
    type: 'string',
    required: false,
  })
  businessWebsiteURL?: string;
  @property({
    type: 'string',
    required: false,
  })
  businessCertificate?: string;
  @property({
    type: 'string',
    required: false,
  })
  businessLogo?: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  recruitmentFrom?: Item[];

  @property({type: 'string', required: false})
  review?: string;
  @property({type: 'number', required: false})
  ratings?: number;
  @property({
    type: 'array',

    itemType: 'object',
  })
  recruitmentTo?: Item[];

  @property({
    type: 'string',
    required: false,
  })
  marketingType?: string;

  @property({
    type: 'string',
    required: false,
  })
  serviceFee?: string;

  @property({
    type: 'string',
    required: false,
  })
  whyEducationOverCompetitors?: string;

  @property({
    type: 'string',
    required: false,
  })
  helpToGrowYourBusiness?: string;

  @property({
    type: 'string',
    required: false,
  })
  additionalComments?: string;

  @hasMany(() => StaffProfile, {keyTo: 'agentId'})
  staffProfiles: StaffProfile[];

  @hasMany(() => StudentProfile, {
    through: {model: () => AgentStudent, keyFrom: 'agentId'},
  })
  studentProfiles: StudentProfile[];

  @hasMany(() => Application)
  applications: Application[];

  @belongsTo(() => User)
  userId: string;

  // @hasMany(() => StaffProfile)
  // staffProfile: StaffProfile[];

  constructor(data?: Partial<AgentProfile>) {
    super(data);
  }
}

export interface AgentProfileRelations {
  // describe navigational properties here
}

export type AgentProfileWithRelations = AgentProfile & AgentProfileRelations;
