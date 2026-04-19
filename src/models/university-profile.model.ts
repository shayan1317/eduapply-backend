import {Entity, hasMany, model, property} from '@loopback/repository';
import {CURRENCY_ENUM} from '../schema';
import {Courses} from './courses.model';
import {Location} from './location.model';
import {Rankings} from './rankings.model';
import {RioProfile} from './rio-profile.model';
import {UniDepartment} from './uni-department.model';
import {UniversityRio} from './university-rio.model';

@model()
export class UniversityProfile extends Entity {
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
  universityNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  website: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'number',
    required: false,
  })
  totalStudents?: number;

  @property({
    type: 'string',
    required: true,
  })
  country: string;

  @property({
    type: 'date',
    required: true,
  })
  yearOfEstablished: Date;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  city: string;

  @property({
    type: 'string',
    required: true,
  })
  state: string;

  @property({
    type: 'string',
    required: true,
  })
  pincode: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  faxNumber: string;

  @property({
    type: 'string',
    required: true,
  })
  agentsRelationManager: string;

  @property({
    type: 'string',
    required: true,
  })
  contactPersonName: string;

  @property({
    type: 'string',
    required: false,
    default: CURRENCY_ENUM.USD,
    jsonSchema: {
      enum: Object.values(CURRENCY_ENUM),
    },
  })
  currency: string;

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

  @property({
    type: 'string',
    required: true,
  })
  contactPersonEmail: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  logo?: string;

  @property({
    type: 'string',
  })
  campusLife?: string;

  @property({
    type: 'string',
  })
  requirements?: string;

  @property({
    type: 'string',
  })
  alumni?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  media?: string[];

  @hasMany(() => Rankings)
  rankings: Rankings[];

  @hasMany(() => Location)
  locations: Location[];

  @hasMany(() => Courses)
  courses: Courses[];

  @hasMany(() => UniDepartment)
  uniDepartments: UniDepartment[];

  @hasMany(() => RioProfile, {through: {model: () => UniversityRio}})
  rioProfiles: RioProfile[];

  constructor(data?: Partial<UniversityProfile>) {
    super(data);
  }
}

export interface UniversityProfileRelations {
  // describe navigational properties here
}

export type UniversityProfileWithRelations = UniversityProfile &
  UniversityProfileRelations;
