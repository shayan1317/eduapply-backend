import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Intake} from '../schema';
import {RequiredTestCourse} from './required-test-course.model';
import {UniDepartment} from './uni-department.model';
import {UniversityProfile} from './university-profile.model';

@model()
export class Courses extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  level: string;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  courseOverview?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  intake?: Intake[];

  @property({
    type: 'string',
  })
  studyTime?: string;

  @property({
    type: 'number',
  })
  fee: number;

  @property({
    type: 'number',
  })
  applicationFee: number;

  @property({
    type: 'string',
  })
  applicationFeeStripeId: string;

  @property({
    type: 'string',
  })
  productId: string;

  @property({
    type: 'string',
  })
  studyOptions?: string;

  @property({
    type: 'string',
  })
  locationName?: string;

  @property({
    type: 'string',
    required: true,
  })
  field: string;

  @property({
    type: 'string',
    required: true,
  })
  program: string;

  @property({
    type: 'string',
    required: false,
  })
  logo?: string;

  @property({
    type: 'string',
    required: false,
  })
  educationLevel?: string;

  @property({
    type: 'number',
    required: false,
  })
  gradingAvg?: number;
  @property({
    type: 'number',
    required: false,
    format: 'float',
  })
  gradingScale?: number;
  @property({
    type: 'string',
    required: false,
  })
  gradingScheme?: string;
  @property({
    type: 'array',
    itemType: 'string',
  })
  media?: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  reqDocs?: string[];

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

  @belongsTo(() => UniDepartment)
  uniDepartmentId: string;

  @belongsTo(() => UniversityProfile)
  universityProfileId: string;

  @hasMany(() => RequiredTestCourse)
  requiredTestCourses: RequiredTestCourse[];

  constructor(data?: Partial<Courses>) {
    super(data);
  }
}

export interface CoursesRelations {
  // describe navigational properties here
}

export type CoursesWithRelations = Courses & CoursesRelations;
