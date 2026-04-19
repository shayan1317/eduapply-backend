import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {AgentStudent, AgentStudentRelations} from '../models';

export class AgentStudentRepository extends DefaultCrudRepository<
  AgentStudent,
  typeof AgentStudent.prototype.id,
  AgentStudentRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(AgentStudent, dataSource);
  }
}
