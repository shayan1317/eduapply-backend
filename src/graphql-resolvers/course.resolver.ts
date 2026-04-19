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
import {CourseController} from '../controllers';
import {Roles, Success} from '../schema';
import {Course, SubjectsData} from '../schema/course.type';
import {CourseInput, Filter} from '../schema/inputs';
@resolver()
export class CourseResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.CourseController')
    private courseController: CourseController,
  ) {}

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Course)
  async addCourse(
    @arg('addCourseData') addCourseData: CourseInput,
  ): Promise<Course> {
    return this.courseController.add(this.resolverData.context, addCourseData);
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Success)
  async deleteCourseById(
    @arg('courseId', type => ID) courseId: string,
  ): Promise<Success> {
    return this.courseController.deleteById(
      this.resolverData.context,
      courseId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Course)
  async editCourse(
    @arg('courseId', type => ID) courseId: string,
    @arg('editCourseInput') editCourseInput: CourseInput,
  ): Promise<Course> {
    return this.courseController.edit(
      this.resolverData.context,
      courseId,
      editCourseInput,
    );
  }
  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @query(returns => SubjectsData)
  async getCourses(
    @arg('departmentId', type => ID) departmentId: string,
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
  ): Promise<SubjectsData> {
    return this.courseController.getCourses(
      this.resolverData.context,
      departmentId,
      offset,
      count,
      filter,
    );
  }
}
