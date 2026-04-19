import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {StudentApplicationTrackRecord, StudentApplicationTrackRecordRelations} from '../models';

export class StudentApplicationTrackRecordRepository extends DefaultCrudRepository<
  StudentApplicationTrackRecord,
  typeof StudentApplicationTrackRecord.prototype.id,
  StudentApplicationTrackRecordRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(StudentApplicationTrackRecord, dataSource);
  }
}
