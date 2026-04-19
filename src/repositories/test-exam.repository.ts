import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {TestExam, TestExamRelations} from '../models';

export class TestExamRepository extends DefaultCrudRepository<
  TestExam,
  typeof TestExam.prototype.id,
  TestExamRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(TestExam, dataSource);
  }
}
