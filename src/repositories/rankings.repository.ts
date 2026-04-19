import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Rankings, RankingsRelations} from '../models';

export class RankingsRepository extends DefaultCrudRepository<
  Rankings,
  typeof Rankings.prototype.id,
  RankingsRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Rankings, dataSource);
  }
}
