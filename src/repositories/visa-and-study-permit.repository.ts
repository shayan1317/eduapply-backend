import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {VisaAndStudyPermit, VisaAndStudyPermitRelations} from '../models';

export class VisaAndStudyPermitRepository extends DefaultCrudRepository<
  VisaAndStudyPermit,
  typeof VisaAndStudyPermit.prototype.id,
  VisaAndStudyPermitRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(VisaAndStudyPermit, dataSource);
  }
}
