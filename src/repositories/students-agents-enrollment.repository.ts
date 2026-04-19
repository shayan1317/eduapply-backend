import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {StudentsAgentsEnrollment, StudentsAgentsEnrollmentRelations} from '../models';

export class StudentsAgentsEnrollmentRepository extends DefaultCrudRepository<
  StudentsAgentsEnrollment,
  typeof StudentsAgentsEnrollment.prototype.id,
  StudentsAgentsEnrollmentRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(StudentsAgentsEnrollment, dataSource);
  }
}
