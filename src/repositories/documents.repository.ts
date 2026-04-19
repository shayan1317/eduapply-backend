import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Documents, DocumentsRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class DocumentsRepository extends DefaultCrudRepository<
  Documents,
  typeof Documents.prototype.id,
  DocumentsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Documents.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Documents, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
