import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {Intake} from '../enums.type';

@inputType()
export class Filter {
  @field({
    nullable: true,
    defaultValue: 0,
    description: 'default is 0 to get all the results',
  })
  @property()
  id?: number;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  name?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  country?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  subject?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  eventPlace?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  email?: string;
}

@inputType()
export class Pagination {
  @field({
    nullable: true,
    defaultValue: 0,
    description: 'Number of results to to skip, default is 0',
  })
  @property()
  offset?: number;

  @field({
    nullable: true,
    defaultValue: 10,
    description: 'Number of results to return, default is 10',
  })
  @property()
  count?: number;
}

@inputType()
export class LocationInput {
  @field()
  @property()
  lat: string;

  @field()
  @property()
  lon: string;
}
@inputType()
export class RankingInput {
  @field()
  @property()
  publisher: string;

  @field()
  @property()
  rank: string;
}

@inputType()
export class AddRioToUniInput {
  @field()
  @property()
  firstName: string;

  @field()
  @property()
  lastName: string;

  @field()
  @property()
  email: string;
}

@inputType()
export class EligibilityFilter {
  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  educationCountry?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  educationLevel?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description:
      'default is empty string to get all the results, could be Percentage or GPA',
  })
  @property()
  gradingScheme?: string;

  @field({
    nullable: true,
    defaultValue: 0,
    description: 'default is empty string to get all the results',
  })
  @property()
  gradingScale?: number;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  englishExamType?: string;

  @field({
    nullable: true,
    defaultValue: 0,
    description: 'default is empty string to get all the results',
  })
  @property()
  greExamScores?: number;

  @field({
    nullable: true,
    defaultValue: 0,
    description: 'default is empty string to get all the results',
  })
  @property()
  gmatExamScores?: number;
}

@inputType()
export class SchoolDetailsFilter {
  @field(type => [String], {
    nullable: true,
    defaultValue: [],
    description: 'default is empty array to get all the results',
  })
  @property()
  countries?: string[];

  @field(type => [String], {
    nullable: true,
    defaultValue: [],
    description: 'default is empty array to get all the results',
  })
  @property()
  provincesOrStates?: string[];

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  campusCity?: string;

  @field(type => [String], {
    nullable: true,
    defaultValue: [],
    description:
      "default is empty array to get all the results, possible values are ['university', 'college', 'englishInstitute', 'highSchool']",
  })
  @property()
  schoolTypes?: string[];

  @field(type => [String], {
    nullable: true,
    defaultValue: [],
    description: 'default is empty string to get all the results',
  })
  @property()
  schools?: string[];
}

@inputType()
export class ProgramDetailsFilter {
  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  programLevels?: string;

  @field(type => [Intake], {
    nullable: true,
    defaultValue: [],
    description: 'default is empty string to get all the results',
  })
  @property()
  intakeStatus?: Intake[];

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  postSecondaryDiscipline?: string;

  @field({
    nullable: true,
    defaultValue: '',
    description: 'default is empty string to get all the results',
  })
  @property()
  postSecondarySubCat?: string;
}

@inputType()
export class VideoInput {
  @field({
    nullable: true,
  })
  @property()
  url?: string;

  @field({
    nullable: true,
  })
  @property()
  title?: string;

  @field({
    nullable: true,
  })
  @property()
  description?: string;

  @field({
    nullable: true,
    description: 'Length of the video in milliseconds',
  })
  @property()
  length?: number;

  @field({
    nullable: true,
  })
  @property()
  format?: string;
}
