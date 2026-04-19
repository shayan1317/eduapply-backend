import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Documents extends Entity {
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
  url: string;

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

  @property({
    type: 'string',
  })
  schoolAttendedId?: string;

  constructor(data?: Partial<Documents>) {
    super(data);
  }
}

export interface DocumentsRelations {
  // describe navigational properties here
}

export type DocumentsWithRelations = Documents & DocumentsRelations;
