import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {
  Courses,
  Location,
  Rankings,
  RioProfile,
  UniDepartment,
  UniversityProfile,
  UniversityProfileRelations,
  UniversityRio,
} from '../models';
import {CoursesRepository} from './courses.repository';
import {LocationRepository} from './location.repository';
import {RankingsRepository} from './rankings.repository';
import {RioProfileRepository} from './rio-profile.repository';
import {UniDepartmentRepository} from './uni-department.repository';
import {UniversityRioRepository} from './university-rio.repository';

export class UniversityProfileRepository extends DefaultCrudRepository<
  UniversityProfile,
  typeof UniversityProfile.prototype.id,
  UniversityProfileRelations
> {
  public readonly rankings: HasManyRepositoryFactory<
    Rankings,
    typeof UniversityProfile.prototype.id
  >;

  public readonly locations: HasManyRepositoryFactory<
    Location,
    typeof UniversityProfile.prototype.id
  >;

  public readonly courses: HasManyRepositoryFactory<
    Courses,
    typeof UniversityProfile.prototype.id
  >;

  public readonly uniDepartments: HasManyRepositoryFactory<
    UniDepartment,
    typeof UniversityProfile.prototype.id
  >;

  public readonly rioProfiles: HasManyThroughRepositoryFactory<
    RioProfile,
    typeof RioProfile.prototype.id,
    UniversityRio,
    typeof UniversityProfile.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('RankingsRepository')
    protected rankingsRepositoryGetter: Getter<RankingsRepository>,
    @repository.getter('LocationRepository')
    protected locationRepositoryGetter: Getter<LocationRepository>,
    @repository.getter('CoursesRepository')
    protected coursesRepositoryGetter: Getter<CoursesRepository>,
    @repository.getter('UniDepartmentRepository')
    protected uniDepartmentRepositoryGetter: Getter<UniDepartmentRepository>,
    
    @repository.getter('RioProfileRepository')
    protected rioProfileRepositoryGetter: Getter<RioProfileRepository>,
    @repository.getter('UniversityRioRepository')
    protected universityRioRepositoryGetter: Getter<UniversityRioRepository>,
  ) {
    super(UniversityProfile, dataSource);
    this.rioProfiles = this.createHasManyThroughRepositoryFactoryFor(
      'rioProfiles',
      rioProfileRepositoryGetter,
      universityRioRepositoryGetter,
    );
    this.registerInclusionResolver(
      'rioProfiles',
      this.rioProfiles.inclusionResolver,
    );

    this.uniDepartments = this.createHasManyRepositoryFactoryFor(
      'uniDepartments',
      uniDepartmentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'uniDepartments',
      this.uniDepartments.inclusionResolver,
    );
    this.courses = this.createHasManyRepositoryFactoryFor(
      'courses',
      coursesRepositoryGetter,
    );
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
    this.locations = this.createHasManyRepositoryFactoryFor(
      'locations',
      locationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'locations',
      this.locations.inclusionResolver,
    );
    this.rankings = this.createHasManyRepositoryFactoryFor(
      'rankings',
      rankingsRepositoryGetter,
    );
    this.registerInclusionResolver('rankings', this.rankings.inclusionResolver);
  }
}
