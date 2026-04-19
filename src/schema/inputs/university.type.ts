import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {CURRENCY_ENUM} from '../enums.type';
import {AddRioToUniInput, LocationInput, RankingInput} from './generic.type';

@inputType()
export class EditUniInput {
  @field()
  @property()
  name: string;

  @field()
  @property()
  website: string;

  @field()
  @property()
  country: string;

  @field({nullable: true})
  totalStudents?: number;

  @field(type => Date)
  @property()
  yearOfEstablished: Date;

  @field()
  @property()
  type: string;

  @field()
  @property()
  address: string;

  @field()
  @property()
  city: string;

  @field()
  @property()
  state: string;

  @field()
  @property()
  pincode: string;

  @field()
  @property()
  phone: string;

  @field()
  @property()
  faxNumber: string;

  @field()
  @property()
  agentsRelationManager: string;

  @field()
  @property()
  contactPersonName: string;

  @field(type => CURRENCY_ENUM, {nullable: true})
  @property()
  currency?: string;

  @field()
  @property()
  contactPersonEmail: string;

  @field(type => [String], {
    nullable: true,
  })
  media: string[];

  @field({
    nullable: true,
  })
  description: string;

  @field({
    nullable: true,
  })
  campusLife: string;

  @field({
    nullable: true,
  })
  requirements: string;

  @field({
    nullable: true,
  })
  alumni: string;

  @field({
    nullable: true,
  })
  logo: string;

  @field(type => [LocationInput], {
    nullable: true,
  })
  locations: LocationInput[];

  @field(type => [RankingInput], {
    nullable: true,
  })
  rankings: RankingInput[];

  @field(type => [AddRioToUniInput], {
    nullable: true,
  })
  rios?: AddRioToUniInput[];
}

@inputType()
export class CreateUniversityData extends EditUniInput {
  @field()
  @property()
  email: string;

  @field(type => [String], {
    nullable: true,
  })
  documents: string[];
}
