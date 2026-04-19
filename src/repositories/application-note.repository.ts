import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {ApplicationNote, ApplicationNoteRelations} from '../models';

export class ApplicationNoteRepository extends DefaultCrudRepository<
  ApplicationNote,
  typeof ApplicationNote.prototype.id,
  ApplicationNoteRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(ApplicationNote, dataSource);
  }
}
