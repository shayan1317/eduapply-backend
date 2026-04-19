import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {
  StaffProfileRelations,
  StudentProfile,
  StudentStaff,
  User,
} from '../models';
import {StaffProfile} from './../models/staff-profile.model';
import {StudentProfileRepository} from './student-profile.repository';
import {StudentStaffRepository} from './student-staff.repository';
import {UserRepository} from './user.repository';

export class StaffProfileRepository extends DefaultCrudRepository<
  StaffProfile,
  typeof StaffProfile.prototype.id,
  StaffProfileRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof StaffProfile.prototype.id
  >;

  public readonly assignedStudents: HasManyThroughRepositoryFactory<
    StudentProfile,
    typeof StudentProfile.prototype.id,
    StudentStaff,
    typeof StaffProfile.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('StudentStaffRepository')
    protected studentStaffRepositoryGetter: Getter<StudentStaffRepository>,
    @repository.getter('StudentProfileRepository')
    protected studentProfileRepositoryGetter: Getter<StudentProfileRepository>,
  ) {
    super(StaffProfile, dataSource);
    this.assignedStudents = this.createHasManyThroughRepositoryFactoryFor(
      'assignedStudents',
      studentProfileRepositoryGetter,
      studentStaffRepositoryGetter,
    );
    this.registerInclusionResolver(
      'assignedStudents',
      this.assignedStudents.inclusionResolver,
    );
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
