import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {ApplicationStatus, ApplicationStatusRelations} from '../models';

export class ApplicationStatusRepository extends DefaultCrudRepository<
  ApplicationStatus,
  typeof ApplicationStatus.prototype.id,
  ApplicationStatusRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(ApplicationStatus, dataSource);
  }
}
