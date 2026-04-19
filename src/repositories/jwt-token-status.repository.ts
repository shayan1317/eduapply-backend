import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {JwtTokenStatus, JwtTokenStatusRelations} from '../models';

export class JwtTokenStatusRepository extends DefaultCrudRepository<
  JwtTokenStatus,
  typeof JwtTokenStatus.prototype.id,
  JwtTokenStatusRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(JwtTokenStatus, dataSource);
  }
}
