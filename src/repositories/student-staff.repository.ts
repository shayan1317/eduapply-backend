import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {StudentStaff, StudentStaffRelations} from '../models';

export class StudentStaffRepository extends DefaultCrudRepository<
  StudentStaff,
  typeof StudentStaff.prototype.id,
  StudentStaffRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(StudentStaff, dataSource);
  }
}
