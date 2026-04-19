import {Entity, belongsTo, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Notifications extends Entity {
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
  description: string;

  // @property({ // status to check whether accepted or rejected and change toaster
  //   type: 'string',
  //   required: true,
  // })
  // status: string;
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
  title: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Notifications>) {
    super(data);
  }
}

export interface NotificationsRelations {
  // describe navigational properties here
}

export type NotificationsWithRelations = Notifications & NotificationsRelations;
