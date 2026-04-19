import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {UniDepartment, UniDepartmentRelations, Courses} from '../models';
import {CoursesRepository} from './courses.repository';

export class UniDepartmentRepository extends DefaultCrudRepository<
  UniDepartment,
  typeof UniDepartment.prototype.id,
  UniDepartmentRelations
> {

  public readonly courses: HasManyRepositoryFactory<Courses, typeof UniDepartment.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('CoursesRepository') protected coursesRepositoryGetter: Getter<CoursesRepository>,
  ) {
    super(UniDepartment, dataSource);
    this.courses = this.createHasManyRepositoryFactoryFor('courses', coursesRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
  }
}
