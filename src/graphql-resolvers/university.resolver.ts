import {inject} from '@loopback/core';
import {
  arg,
  authorized,
  GraphQLBindings,
  ID,
  mutation,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {UniversityController} from '../controllers';
import {
  Roles,
  Success,
  UniversitiesData,
  UniversityData,
  UniversityProfile,
} from '../schema';
import {CreateUniversityData, EditUniInput, Filter} from '../schema/inputs';
@resolver()
export class UniversityResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.UniversityController')
    private universityController: UniversityController,
  ) {}

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => UniversityData)
  async createUniversity(
    @arg('createUniversityData') createUniversityData: CreateUniversityData,
  ): Promise<UniversityData> {
    return this.universityController.createUniversity(
      this.resolverData.context,
      createUniversityData,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.STAFF,
  ])
  @query(returns => UniversityData)
  async getUniById(
    @arg('universityId', type => ID) universityId: string,
  ): Promise<UniversityData> {
    return this.universityController.getUniversity(
      this.resolverData.context,
      universityId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STUDENT,
    Roles.STAFF,
    Roles.UNI_FOCAL_PERSON,
  ])
  @query(returns => UniversitiesData)
  async getUniversities(
    @arg('offset', {
      defaultValue: 0,
      description: 'Number of results to to skip, default is 0',
    })
    offset: number,
    @arg('count', {
      defaultValue: 10,
      description: 'Number of results to return, default is 10',
    })
    count: number,
    @arg('filter', {
      nullable: true,
      description: 'filter the data using below field',
    })
    filter: Filter,
  ): Promise<UniversitiesData> {
    return this.universityController.getUniversities(
      this.resolverData.context,
      offset,
      count,
      filter,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => Success)
  async deleteUniversityById(
    @arg('universityId', type => ID) universityId: string,
  ): Promise<Success> {
    return this.universityController.deleteById(
      this.resolverData.context,
      universityId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => UniversityProfile)
  async editUni(
    @arg('uniId', type => ID) uniId: string,
    @arg('editUniInput') editUniInput: EditUniInput,
  ): Promise<UniversityProfile> {
    return this.universityController.edit(
      this.resolverData.context,
      uniId,
      editUniInput,
    );
  }
}
