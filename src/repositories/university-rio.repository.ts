import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {UniversityRio, UniversityRioRelations} from '../models';

export class UniversityRioRepository extends DefaultCrudRepository<
  UniversityRio,
  typeof UniversityRio.prototype.id,
  UniversityRioRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(UniversityRio, dataSource);
  }
}
