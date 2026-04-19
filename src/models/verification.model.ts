import {Entity, model, property} from '@loopback/repository';

@model()
export class Verification extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuid'
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

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
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;


  constructor(data?: Partial<Verification>) {
    super(data);
  }
}

export interface VerificationRelations {
  // describe navigational properties here
}

export type VerificationWithRelations = Verification & VerificationRelations;
