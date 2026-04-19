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
import {DepartmentController} from '../controllers';
import {Roles, Success} from '../schema';
import {
  UniDepartmentData,
  UniDepartmentOutput,
} from '../schema/department.type';
import {DepartmentInput, Filter} from '../schema/inputs';
@resolver()
export class DepartmentResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.DepartmentController')
    private departmentController: DepartmentController,
  ) {}

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => UniDepartmentOutput)
  async addDepartment(
    @arg('createDepartmentInput') createDepartmentInput: DepartmentInput,
  ): Promise<UniDepartmentOutput> {
    return this.departmentController.add(
      this.resolverData.context,
      createDepartmentInput,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Success)
  async deleteDepartmentById(
    @arg('departmentId', type => ID) departmentId: string,
  ): Promise<Success> {
    return this.departmentController.deleteById(
      this.resolverData.context,
      departmentId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => UniDepartmentOutput)
  async editDepartment(
    @arg('departmentId', type => ID) departmentId: string,
    @arg('editDepartmentInput') editDepartmentInput: DepartmentInput,
  ): Promise<UniDepartmentOutput> {
    return this.departmentController.edit(
      this.resolverData.context,
      departmentId,
      editDepartmentInput,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @query(returns => UniDepartmentData)
  async getDepartments(
    @arg('universityId', type => ID) universityId: string,
    @arg('offset', {
      defaultValue: 0,
      description: 'Number of results to to skip, default is 0',
    })
    offset: number,
    @arg('count', {
      defaultValue: 10,
      description: 'Number of results to return, default is 12',
    })
    count: number,
    @arg('filter', {
      nullable: true,
      description: 'filter the data using below field',
    })
    filter?: Filter,
  ): Promise<UniDepartmentData> {
    return this.departmentController.getDepartments(
      this.resolverData.context,
      universityId,
      offset,
      count,
      filter,
    );
  }
}
