import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {
  Application,
  SchoolAttended,
  StudentProfile,
  StudentProfileRelations,
  TestExam,
  User,
  VisaAndStudyPermit,
} from '../models';
import {ApplicationRepository} from './application.repository';
import {SchoolAttendedRepository} from './school-attended.repository';
import {TestExamRepository} from './test-exam.repository';
import {UserRepository} from './user.repository';
import {VisaAndStudyPermitRepository} from './visa-and-study-permit.repository';

export class StudentProfileRepository extends DefaultCrudRepository<
  StudentProfile,
  typeof StudentProfile.prototype.id,
  StudentProfileRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof StudentProfile.prototype.id
  >;

  public readonly schoolAttended: HasManyRepositoryFactory<
    SchoolAttended,
    typeof StudentProfile.prototype.id
  >;

  public readonly applications: HasManyRepositoryFactory<
    Application,
    typeof StudentProfile.prototype.id
  >;

  public readonly testExams: HasManyRepositoryFactory<
    TestExam,
    typeof StudentProfile.prototype.id
  >;

  public readonly visaAndStudyPermit: HasOneRepositoryFactory<
    VisaAndStudyPermit,
    typeof StudentProfile.prototype.id
  >;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('SchoolAttendedRepository')
    protected schoolAttendedRepositoryGetter: Getter<SchoolAttendedRepository>,
    @repository.getter('ApplicationRepository')
    protected applicationRepositoryGetter: Getter<ApplicationRepository>,
    @repository.getter('TestExamRepository')
    protected testExamRepositoryGetter: Getter<TestExamRepository>,
    @repository.getter('VisaAndStudyPermitRepository')
    protected visaAndStudyPermitRepositoryGetter: Getter<VisaAndStudyPermitRepository>,
  ) {
    super(StudentProfile, dataSource);
    this.visaAndStudyPermit = this.createHasOneRepositoryFactoryFor(
      'visaAndStudyPermit',
      visaAndStudyPermitRepositoryGetter,
    );
    this.registerInclusionResolver(
      'visaAndStudyPermit',
      this.visaAndStudyPermit.inclusionResolver,
    );
    this.testExams = this.createHasManyRepositoryFactoryFor(
      'testExams',
      testExamRepositoryGetter,
    );
    this.registerInclusionResolver(
      'testExams',
      this.testExams.inclusionResolver,
    );
    this.applications = this.createHasManyRepositoryFactoryFor(
      'applications',
      applicationRepositoryGetter,
    );
    this.registerInclusionResolver(
      'applications',
      this.applications.inclusionResolver,
    );
    this.schoolAttended = this.createHasManyRepositoryFactoryFor(
      'schoolAttended',
      schoolAttendedRepositoryGetter,
    );
    this.registerInclusionResolver(
      'schoolAttended',
      this.schoolAttended.inclusionResolver,
    );
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
