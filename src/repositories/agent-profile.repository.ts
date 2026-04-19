import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {AgentProfile, AgentProfileRelations, StaffProfile, StudentProfile, AgentStudent, Application} from '../models';
import {StaffProfileRepository} from './staff-profile.repository';
import {AgentStudentRepository} from './agent-student.repository';
import {StudentProfileRepository} from './student-profile.repository';
import {ApplicationRepository} from './application.repository';

export class AgentProfileRepository extends DefaultCrudRepository<
  AgentProfile,
  typeof AgentProfile.prototype.id,
  AgentProfileRelations
> {

  public readonly staffProfiles: HasManyRepositoryFactory<StaffProfile, typeof AgentProfile.prototype.id>;

  public readonly studentProfiles: HasManyThroughRepositoryFactory<StudentProfile, typeof StudentProfile.prototype.id,
          AgentStudent,
          typeof AgentProfile.prototype.id
        >;

  public readonly applications: HasManyRepositoryFactory<Application, typeof AgentProfile.prototype.id>;

  constructor(@inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('StaffProfileRepository') protected staffProfileRepositoryGetter: Getter<StaffProfileRepository>, @repository.getter('AgentStudentRepository') protected agentStudentRepositoryGetter: Getter<AgentStudentRepository>, @repository.getter('StudentProfileRepository') protected studentProfileRepositoryGetter: Getter<StudentProfileRepository>, @repository.getter('ApplicationRepository') protected applicationRepositoryGetter: Getter<ApplicationRepository>,) {
    super(AgentProfile, dataSource);
    this.applications = this.createHasManyRepositoryFactoryFor('applications', applicationRepositoryGetter,);
    this.registerInclusionResolver('applications', this.applications.inclusionResolver);
    this.studentProfiles = this.createHasManyThroughRepositoryFactoryFor('studentProfiles', studentProfileRepositoryGetter, agentStudentRepositoryGetter,);
    this.registerInclusionResolver('studentProfiles', this.studentProfiles.inclusionResolver);
    this.staffProfiles = this.createHasManyRepositoryFactoryFor('staffProfiles', staffProfileRepositoryGetter,);
    this.registerInclusionResolver('staffProfiles', this.staffProfiles.inclusionResolver);
  }
}
