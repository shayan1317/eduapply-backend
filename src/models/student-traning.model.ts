import {Entity, model, property} from '@loopback/repository';

@model()
export class StudentTraning extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  courseName: string;

  @property({
    type: 'string',
    required: true,
  })
  programName: string;

  @property({
    type: 'string',
    required: true,
  })
  totalMarks: string;

  @property({
    type: 'string',
    required: true,
  })
  timeDuration: string;

  @property({
    type: 'string',
    required: true,
  })
  questionType: string;

  @property({
    type: 'string',
    required: true,
  })
  testDate: string;

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
  })
  document?: string;

  constructor(data?: Partial<StudentTraning>) {
    super(data);
  }
}

export interface StudentTraningRelations {
  // describe navigational properties here
}

export type StudentTraningWithRelations = StudentTraning &
  StudentTraningRelations;
