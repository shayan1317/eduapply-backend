import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Notifications, NotificationsRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class NotificationsRepository extends DefaultCrudRepository<
  Notifications,
  typeof Notifications.prototype.id,
  NotificationsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Notifications.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Notifications, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
