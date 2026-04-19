import {Entity, model, property} from '@loopback/repository';

@model()
export class StudentEvent extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // studentProfileId: string;

  // @property({
  //   type: 'string',
  @property({
    type: 'string',
    required: true,
  })
  eventId: string;
  //   required: true,
  // })
  // eventId: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

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
  country: string;

  @property({
    type: 'string',
    required: true,
  })
  phonenum: string;

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

  constructor(data?: Partial<StudentEvent>) {
    super(data);
  }
}

export interface StudentEventRelations {
  // describe navigational properties here
}

export type StudentEventWithRelations = StudentEvent & StudentEventRelations;
