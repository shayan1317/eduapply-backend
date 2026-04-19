import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';
import {UniDepartmentOutput} from './department.type';
import {CURRENCY_ENUM} from './enums.type';
import {Documents, Location, Ranking} from './generic.type';
import {RioProfilesData} from './rio.type';

@objectType({description: 'University object'})
@model({settings: {strict: false}})
export class UniversityProfile {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  universityNumber: number;

  @field()
  @property()
  name: string;

  @field()
  @property()
  website: string;

  @field()
  @property()
  email: string;

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

  @field()
  @property()
  contactPersonEmail: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field(type => [String], {
    nullable: true,
  })
  media?: string[];

  @field({
    nullable: true,
  })
  description?: string;

  @field({
    nullable: true,
  })
  campusLife?: string;

  @field({
    nullable: true,
  })
  requirements?: string;

  @field({
    nullable: true,
  })
  alumni?: string;

  @field({
    nullable: true,
  })
  logo?: string;

  @field(type => CURRENCY_ENUM, {
    nullable: true,
  })
  currency?: string;

  @field(type => [Location], {
    nullable: true,
  })
  locations?: Location[];

  @field(type => [UniDepartmentOutput], {
    nullable: true,
  })
  uniDepartments?: UniDepartmentOutput[];

  @field(type => [Ranking], {
    nullable: true,
  })
  rankings?: Ranking[];

  @field(type => RioProfilesData, {
    nullable: true,
  })
  rioProfilesData?: RioProfilesData;
}

@objectType({description: 'University object'})
@model({settings: {strict: false}})
export class UniversityData {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field(type => UniversityProfile)
  universityProfile: UniversityProfile;

  @field(type => [Documents], {
    nullable: true,
  })
  documents: Documents[];
}

@objectType({description: 'University object'})
@model({settings: {strict: false}})
export class UniversitiesData {
  @field(type => [UniversityProfile])
  universitiesProfile: UniversityProfile[];

  @field()
  @property()
  total: number;
}
