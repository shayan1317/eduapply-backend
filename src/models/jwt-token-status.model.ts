import {Entity, model, property} from '@loopback/repository';

@model()
export class JwtTokenStatus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  @property({
    type: 'boolean',
    required: true,
    default: false
  })
  status: boolean;

  @property({
    type: 'string',
    required: true,
  })
  assignedToUserId: string;

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


  constructor(data?: Partial<JwtTokenStatus>) {
    super(data);
  }
}

export interface JwtTokenStatusRelations {
  // describe navigational properties here
}

export type JwtTokenStatusWithRelations = JwtTokenStatus & JwtTokenStatusRelations;
