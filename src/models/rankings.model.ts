import {Entity, model, property} from '@loopback/repository';

@model()
export class Rankings extends Entity {
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
  publisher: string;

  @property({
    type: 'string',
    required: true,
  })
  rank: string;

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
  universityProfileId?: string;

  constructor(data?: Partial<Rankings>) {
    super(data);
  }
}

export interface RankingsRelations {
  // describe navigational properties here
}

export type RankingsWithRelations = Rankings & RankingsRelations;
