import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {StudentProfile} from './student-profile.model';
import {StudentStaff} from './student-staff.model';
import {User} from './user.model';

@model()
export class StaffProfile extends Entity {
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
    required: false,
  })
  name: string;
  @property({
    type: 'string',
    required: false,
  })
  workEmail: string;

  @property({
    type: 'string',
    required: false,
  })
  photo?: string;

  @property({
    type: 'string',
    required: false,
  })
  jobTitle: string;
  @property({
    type: 'string',
    required: false,
  })
  ipRestriction: string;
  @property({
    type: 'string',
    required: false,
  })
  birthDate: string;
  @property({
    type: 'string',
    required: false,
  })
  education: string;
  @property({
    type: 'string',
    required: false,
  })
  website: string;
  @property({
    type: 'string',
    required: false,
  })
  gender: string;
  @property({
    type: 'string',
    required: false,
  })
  country: string;
  @property({
    type: 'string',
    required: false,
  })
  state: string;
  @property({
    type: 'string',
    required: false,
  })
  street: string;
  @property({
    type: 'string',
    required: false,
  })
  city: string;
  @property({
    required: false,
  })
  postalCode: string;

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
  })
  agentId: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => StudentProfile, {through: {model: () => StudentStaff}})
  assignedStudents: StudentProfile[];

  constructor(data?: Partial<StaffProfile>) {
    super(data);
  }
}
export interface StaffProfileRelations {
  // describe navigational properties here
}

export type StaffProfileWithRelations = StaffProfile & StaffProfileRelations;
