import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {StudentEvent, StudentEventRelations} from '../models';

export class StudentEventRepository extends DefaultCrudRepository<
  StudentEvent,
  typeof StudentEvent.prototype.id,
  StudentEventRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(StudentEvent, dataSource);
  }
}
