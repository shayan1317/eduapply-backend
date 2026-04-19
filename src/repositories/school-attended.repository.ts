import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {SchoolAttended, SchoolAttendedRelations, Documents} from '../models';
import {DocumentsRepository} from './documents.repository';

export class SchoolAttendedRepository extends DefaultCrudRepository<
  SchoolAttended,
  typeof SchoolAttended.prototype.id,
  SchoolAttendedRelations
> {

  public readonly documents: HasOneRepositoryFactory<Documents, typeof SchoolAttended.prototype.id>;

  constructor(@inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('DocumentsRepository') protected documentsRepositoryGetter: Getter<DocumentsRepository>,) {
    super(SchoolAttended, dataSource);
    this.documents = this.createHasOneRepositoryFactoryFor('documents', documentsRepositoryGetter);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
  }
}
