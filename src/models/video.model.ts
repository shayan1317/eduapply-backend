import {Entity, model, property} from '@loopback/repository';

@model()
export class Video extends Entity {
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
  title?: string;

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
  description?: string;

  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'number',
  })
  length?: number;

  @property({
    type: 'string',
  })
  format?: string;

  @property({
    type: 'number',
  })
  applicationId?: number;

  constructor(data?: Partial<Video>) {
    super(data);
  }
}

export interface VideoRelations {
  // describe navigational properties here
}

export type VideoWithRelations = Video & VideoRelations;
