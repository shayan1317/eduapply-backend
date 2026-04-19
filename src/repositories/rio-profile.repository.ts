import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {
  RioProfile,
  RioProfileRelations,
  UniversityProfile,
  User,
} from '../models';
import {UniversityProfileRepository} from './university-profile.repository';
import {UserRepository} from './user.repository';

export class RioProfileRepository extends DefaultCrudRepository<
  RioProfile,
  typeof RioProfile.prototype.id,
  RioProfileRelations
> {
  public readonly user: BelongsToAccessor<User, typeof RioProfile.prototype.id>;

  public readonly universityProfile: BelongsToAccessor<
    UniversityProfile,
    typeof RioProfile.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('UniversityProfileRepository')
    protected universityProfileRepositoryGetter: Getter<UniversityProfileRepository>,
  ) {
    super(RioProfile, dataSource);
    this.universityProfile = this.createBelongsToAccessorFor(
      'universityProfile',
      universityProfileRepositoryGetter,
    );
    this.registerInclusionResolver(
      'universityProfile',
      this.universityProfile.inclusionResolver,
    );
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
