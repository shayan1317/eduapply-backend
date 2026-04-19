import {Entity, model, property} from '@loopback/repository';

@model()
export class ApplicationStatus extends Entity {
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
  })
  eventName: string;

  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'date',
    required: false,
  })
  date: Date;

  @property({type: 'string'})
  status: string;

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
    type: 'number',
  })
  applicationId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<ApplicationStatus>) {
    super(data);
  }
}

export interface ApplicationStatusRelations {
  // describe navigational properties here
}

export type ApplicationStatusWithRelations = ApplicationStatus &
  ApplicationStatusRelations;
