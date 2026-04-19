import {Entity, belongsTo, model, property} from '@loopback/repository';
import {UniversityProfile} from './university-profile.model';
import {User} from './user.model';

@model()
export class RioProfile extends Entity {
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
    required: false,
  })
  photo?: string;

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

  @belongsTo(() => User)
  userId: string;

  @belongsTo(() => UniversityProfile)
  universityProfileId: string;

  constructor(data?: Partial<RioProfile>) {
    super(data);
  }
}

export interface RioProfileRelations {
  // describe navigational properties here
}

export type RioProfileWithRelations = RioProfile & RioProfileRelations;
