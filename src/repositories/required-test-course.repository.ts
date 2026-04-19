import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {RequiredTestCourse, RequiredTestCourseRelations} from '../models';

export class RequiredTestCourseRepository extends DefaultCrudRepository<
  RequiredTestCourse,
  typeof RequiredTestCourse.prototype.id,
  RequiredTestCourseRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(RequiredTestCourse, dataSource);
  }
}
