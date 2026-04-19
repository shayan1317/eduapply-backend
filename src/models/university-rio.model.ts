import {Entity, model, property} from '@loopback/repository';

@model()
export class UniversityRio extends Entity {
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
    id: true,
    generated: false,
  })
  universityProfileId?: string;

  @property({
    type: 'string',
  })
  rioProfileId?: string;

  constructor(data?: Partial<UniversityRio>) {
    super(data);
  }
}

export interface UniversityRioRelations {
  // describe navigational properties here
}

export type UniversityRioWithRelations = UniversityRio & UniversityRioRelations;
