import {inject} from '@loopback/core';
import {
  GraphQLBindings,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {
  EDUCATION_LEVELS,
  GRADING_SCHEME,
  INTAKES,
  RANKINGS,
  STUDY_LOCATIONS,
  STUDY_OPTIONS,
  STUDY_TIMINGS,
  TEST_TYPES,
  TYPES_OF_UNIVERSITIES,
  uniProgramsByLevelAndFieldJson,
} from '../constants';
import {DropdownAndOptionsData} from '../schema';

@resolver()
export class DropdownAndOptionsResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,
  ) {}

  @query(returns => DropdownAndOptionsData)
  async getDropdownAndOptionsData(): Promise<DropdownAndOptionsData> {
    return {
      studyLoactions: STUDY_LOCATIONS,
      studyOptions: STUDY_OPTIONS,
      studyTimings: STUDY_TIMINGS,
      uniProgramsByLevelAndField: uniProgramsByLevelAndFieldJson,
      intakes: INTAKES,
      rankingPublishers: RANKINGS,
      typeOfUnis: TYPES_OF_UNIVERSITIES,
      testTypes: TEST_TYPES,
      gradingScheme: GRADING_SCHEME,
      educationLevel: EDUCATION_LEVELS,
    };
  }
}
