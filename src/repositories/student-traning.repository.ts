import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {StudentTraning, StudentTraningRelations} from '../models';

export class StudentTraningRepository extends DefaultCrudRepository<
  StudentTraning,
  typeof StudentTraning.prototype.id,
  StudentTraningRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(StudentTraning, dataSource);
  }
}
