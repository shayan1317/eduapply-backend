import {Entity, model, property, hasMany} from '@loopback/repository';
import {StudentEvent} from './student-event.model';

@model()
export class Event extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  organize: string;

  @property({
    type: 'string',
    required: true,
  })
  place: string;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  date: Date;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  host: string;

  @property({
    type: 'string',
    required: true,
  })
  chiefGuest: string;

  @property({
    type: 'string',
    required: true,
  })
  subject: string;

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
  description: string;

  @hasMany(() => StudentEvent)
  studentEvents: StudentEvent[];
  // @hasMany(() => StudentProfile, {through: {model: () => StudentEvent}})
  // registeredStudentProfiles: StudentProfile[];

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
