import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Courses, CoursesRelations, UniDepartment, UniversityProfile, RequiredTestCourse} from '../models';
import {UniDepartmentRepository} from './uni-department.repository';
import {UniversityProfileRepository} from './university-profile.repository';
import {RequiredTestCourseRepository} from './required-test-course.repository';

export class CoursesRepository extends DefaultCrudRepository<
  Courses,
  typeof Courses.prototype.id,
  CoursesRelations
> {

  public readonly uniDepartment: BelongsToAccessor<UniDepartment, typeof Courses.prototype.id>;

  public readonly universityProfile: BelongsToAccessor<UniversityProfile, typeof Courses.prototype.id>;

  public readonly requiredTestCourses: HasManyRepositoryFactory<RequiredTestCourse, typeof Courses.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('UniDepartmentRepository') protected uniDepartmentRepositoryGetter: Getter<UniDepartmentRepository>,
    @repository.getter('UniversityProfileRepository') protected universityProfileRepositoryGetter: Getter<UniversityProfileRepository>, @repository.getter('RequiredTestCourseRepository') protected requiredTestCourseRepositoryGetter: Getter<RequiredTestCourseRepository>,
  ) {
    super(Courses, dataSource);
    this.requiredTestCourses = this.createHasManyRepositoryFactoryFor('requiredTestCourses', requiredTestCourseRepositoryGetter,);
    this.registerInclusionResolver('requiredTestCourses', this.requiredTestCourses.inclusionResolver);
    this.universityProfile = this.createBelongsToAccessorFor('universityProfile', universityProfileRepositoryGetter,);
    this.registerInclusionResolver('universityProfile', this.universityProfile.inclusionResolver);
    this.uniDepartment = this.createBelongsToAccessorFor('uniDepartment', uniDepartmentRepositoryGetter,);
    this.registerInclusionResolver('uniDepartment', this.uniDepartment.inclusionResolver);
  }
}
