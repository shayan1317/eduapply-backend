import {
  Entity,
  belongsTo,
  hasMany,
  hasOne,
  model,
  property,
} from '@loopback/repository';
import {Application} from './application.model';
import {SchoolAttended} from './school-attended.model';
import {TestExam} from './test-exam.model';
import {User} from './user.model';
import {VisaAndStudyPermit} from './visa-and-study-permit.model';

@model()
export class StudentProfile extends Entity {
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
  studentNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  firstname: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
  })
  middlename?: string;

  @property({
    type: 'string',
  })
  familyname?: string;

  @property({
    type: 'string',
    required: false,
  })
  skype?: string;

  @property({
    type: 'string',
    default: 'other',
  })
  serviceInterest: string;

  @property({
    type: 'string',
    default: 'other',
  })
  referralSource: string;

  @property({
    type: 'string',
    default: 'NEW_LEAD',
  })
  status: string;

  @property({
    type: 'string',
    required: false,
  })
  phone?: string;

  @property({
    type: 'string',
    default: 'FEB',
  })
  intake: string;

  @property({
    type: 'boolean',
    default: false,
  })
  profileCompleted: boolean;
  @property({
    type: 'boolean',
    default: false,
  })
  isStepperCompleted: boolean;

  // @property({
  //   type: 'string',
  //   required: false,
  // })
  // fundingSource?: string;

  @property({
    type: 'string',
    required: false,
  })
  photo?: string;

  @property({
    type: 'string',
    required: false,
  })
  citizenship?: string;

  @property({
    type: 'string',
    required: false,
  })
  firstLanguage?: string;

  @property({
    type: 'string',
    required: false,
  })
  passportNumber?: string;

  @property({type: 'date'})
  dob?: Date;

  @property({
    type: 'date',
  })
  passportExpiryDate?: Date;

  @property({
    type: 'string',
    required: false,
  })
  gender?: string;

  @property({
    type: 'string',
    required: false,
  })
  martialStatus?: string;

  @property({
    type: 'string',
    required: false,
  })
  address?: string;

  @property({
    type: 'string',
    required: false,
  })
  cityTown?: string;

  @property({
    type: 'string',
    required: false,
  })
  country?: string;

  @property({
    type: 'string',
    required: false,
  })
  state?: string;

  @property({
    type: 'string',
    required: false,
  })
  postalZipCode?: string;

  // @property({
  //   type: 'string',
  //   required: false,
  // })
  // gradeScale?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: false,
  })
  countryOfEducation?: string;

  @property({
    type: 'string',
    required: false,
  })
  HighestLevelOfEducation?: string;

  // @property({
  //   type: 'string',
  //   required: false,
  // })
  // gradingScheme?: string;

  // @property({
  //   type: 'string',
  //   required: false,
  // })
  // gradeAverage?: string;

  // @property({type: 'boolean', required: false})
  // isGraduated?: boolean;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  updatedAt: Date;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => SchoolAttended)
  schoolAttended: SchoolAttended[];

  @hasMany(() => Application)
  applications: Application[];

  @hasMany(() => TestExam)
  testExams: TestExam[];

  @hasOne(() => VisaAndStudyPermit)
  visaAndStudyPermit: VisaAndStudyPermit;

  constructor(data?: Partial<StudentProfile>) {
    super(data);
  }
}

export interface StudentProfileRelations {
  // describe navigational properties here
}

export type StudentProfileWithRelations = StudentProfile &
  StudentProfileRelations;
