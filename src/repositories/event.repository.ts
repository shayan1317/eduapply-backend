import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Event, EventRelations, StudentEvent} from '../models';
import {StudentEventRepository} from './student-event.repository';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {
  // public readonly registeredStudentProfiles: HasManyThroughRepositoryFactory<StudentProfile, typeof StudentProfile.prototype.id,
  //         StudentEvent,
  //         typeof Event.prototype.id
  //       >;

  public readonly studentEvents: HasManyRepositoryFactory<
    StudentEvent,
    typeof Event.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('StudentEventRepository')
    protected studentEventRepositoryGetter: Getter<StudentEventRepository>, // @repository.getter('StudentProfileRepository')
  ) // protected studentProfileRepositoryGetter: Getter<StudentProfileRepository>,
  {
    super(Event, dataSource);
    this.studentEvents = this.createHasManyRepositoryFactoryFor(
      'studentEvents',
      studentEventRepositoryGetter,
    );
    this.registerInclusionResolver(
      'studentEvents',
      this.studentEvents.inclusionResolver,
    );
    // this.registeredStudentProfiles =
    //   this.createHasManyThroughRepositoryFactoryFor(
    //     'registeredStudentProfiles',
    //     studentProfileRepositoryGetter,
    //     studentEventRepositoryGetter,
    //   );
    // this.registerInclusionResolver(
    //   'registeredStudentProfiles',
    //   this.registeredStudentProfiles.inclusionResolver,
    // );
  }
}
