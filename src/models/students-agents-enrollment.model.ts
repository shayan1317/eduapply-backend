import {Entity, model, property} from '@loopback/repository';

@model()
export class StudentsAgentsEnrollment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  month: string;

  @property({
    type: 'number',
    default: 0,
  })
  agentsCount?: number;

  @property({
    type: 'number',
    default: 0,
  })
  studentsCount?: number;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StudentsAgentsEnrollment>) {
    super(data);
  }
}

export interface StudentsAgentsEnrollmentRelations {
  // describe navigational properties here
}

export type StudentsAgentsEnrollmentWithRelations = StudentsAgentsEnrollment &
  StudentsAgentsEnrollmentRelations;
