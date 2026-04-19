import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';

@objectType({description: 'Generic RioProfile object'})
export class RioProfile {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  firstName: string;

  @field()
  @property()
  lastName: string;

  @field({
    nullable: true,
  })
  @property()
  photo?: string;

  @field()
  @property()
  email: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  // @field({nullable: true})
  // @property()
  // universityProfileId?: string;
}

@objectType({description: 'RioProfile Array'})
@model({settings: {strict: false}})
export class RioProfilesData {
  // @field(type => ID, {nullable: true})
  // @property({id: true})
  // universityId?: string;

  @field(type => [RioProfile], {
    nullable: true,
  })
  rioProfiles?: RioProfile[];

  @field()
  @property()
  total: number;
}
