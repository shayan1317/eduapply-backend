import {Entity, model, property} from '@loopback/repository';

@model()
export class Location extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid'
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  lat: string;

  @property({
    type: 'string',
    required: true,
  })
  lon: string;

  @property({
    type: 'string',
  })
  universityProfileId?: string;

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

  constructor(data?: Partial<Location>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
}

export type LocationWithRelations = Location & LocationRelations;
