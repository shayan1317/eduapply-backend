import {Roles} from './../schema/enums.type';
import {Success} from './../schema/generic.type';

import {inject} from '@loopback/core';
import {
  GraphQLBindings,
  ID,
  ResolverData,
  arg,
  authorized,
  mutation,
  query,
  resolver,
} from '@loopback/graphql';
import {AgentController} from '../controllers';

import {
  AgentData,
  AgentProfile,
  AgentSignUp,
  AgentsData,
  AuthenticatedUser,
  ResCompleteAgentProfile,
  ResCompleteStaffProfile,
  Staffs,
  verifyToken,
} from '../schema';
import {
  CompleteEditAgentInput,
  CreateAgentData,
  CreateAgentUserInput,
  CredentialsInput,
  EditAgentInput,
  Filter,
  ReviewAgentInput,
  createStaffData,
} from '../schema/inputs';
@resolver()
export class AgentResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.AgentController')
    private agentController: AgentController,
  ) {}

  @mutation(returns => verifyToken)
  async agentSignup(
    @arg('agent') agent: CreateAgentUserInput,
  ): Promise<verifyToken> {
    return this.agentController.agentSignUp(this.resolverData.context, agent);
  }
  @mutation(returns => AgentSignUp)
  async verifyAgent(
    @arg('otp') otp: string,
    @arg('token') token: string,
  ): Promise<AgentSignUp> {
    return this.agentController.verifyAgent(
      this.resolverData.context,
      otp,
      token,
    );
  }
  @mutation(returns => AuthenticatedUser)
  async agentSignin(
    @arg('credentials') credentials: CredentialsInput,
  ): Promise<AuthenticatedUser> {
    return this.agentController.login(this.resolverData.context, credentials);
  }
  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => Success)
  async completeAgentProfile(
    @arg('agentProfile') agentProfile: CompleteEditAgentInput,
    @arg('agentId', type => ID) agentId: string,
  ): Promise<Success> {
    return this.agentController.completeProfile(
      this.resolverData.context,
      agentProfile,
      agentId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.AGENT, Roles.SUPER_ADMIN])
  @query(returns => ResCompleteAgentProfile)
  async getAgent(
    @arg('agentId', type => ID) agentId: string,
  ): Promise<ResCompleteAgentProfile> {
    return this.agentController.getAgentProfile(
      this.resolverData.context,
      agentId,
    );
  }

  @authorized([Roles.ADMIN, Roles.AGENT, Roles.RIO])
  @mutation(returns => Success)
  async completeStaffProfile(
    @arg('staffProfile') staffProfile: createStaffData,
  ): Promise<Success> {
    return this.agentController.createStaff(
      this.resolverData.context,
      staffProfile,
    );
  }
  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @query(returns => Staffs)
  async getStaffProfile(
    @arg('offset', {
      defaultValue: 0,
      description: 'Number of results to to skip, default is 0',
    })
    offset: number,
    @arg('count', {
      defaultValue: 10,
      description: 'Number of results to return, default is 12',
    })
    count: number,
    @arg('agentId', type => ID, {nullable: true}) agentId?: string,
  ): Promise<Staffs> {
    return this.agentController.getStaffsProfile(
      this.resolverData.context,

      offset,
      count,
      agentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => ResCompleteStaffProfile)
  async getStaffProfileById(
    @arg('staffId', type => ID) staffId: string,
  ): Promise<ResCompleteStaffProfile> {
    return this.agentController.getStaffProfile(
      this.resolverData.context,
      staffId,
    );
  }
  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => Success)
  async editStaff(
    @arg('staffId', type => ID) staffId: string,
    @arg('staffProfile') staffProfile: createStaffData,
  ): Promise<Success> {
    return this.agentController.updateStaffProfileById(
      this.resolverData.context,
      staffId,
      staffProfile,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => Success)
  async deleteStaffById(
    @arg('staffId', type => ID) staffId: string,
  ): Promise<Success> {
    return this.agentController.deleteStaff(this.resolverData.context, staffId);
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.AGENT])
  @mutation(returns => Success)
  async deleteAssingedStaffById(
    @arg('staffId', type => ID) staffId: string,
    @arg('studentId', type => ID) studentId: string,
  ): Promise<Success> {
    return this.agentController.deleteAssignedStaffStudentById(
      this.resolverData.context,
      staffId,
      studentId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async assignStudentToStaff(
    @arg('staffId', type => ID) staffId: string,
    @arg('studentId', type => ID) studentId: string,
  ): Promise<Success> {
    return this.agentController.AssignStudentToStaff(
      this.resolverData.context,
      staffId,
      studentId,
    );
  }
  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => AgentProfile)
  async reviewAgent(
    @arg('agentId', type => ID) agentId: string,
    @arg('reviewAgentInput') reviewAgentInput: ReviewAgentInput,
  ): Promise<AgentProfile> {
    return this.agentController.reviewAgent(
      this.resolverData.context,
      agentId,
      reviewAgentInput,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.AGENT,
    Roles.STUDENT,
    Roles.STAFF,
  ])
  @query(returns => AgentsData)
  async getAgents(
    @arg('offset', {
      defaultValue: 0,
      description: 'Number of results to to skip, default is 0',
    })
    offset: number,
    @arg('count', {
      defaultValue: 10,
      description: 'Number of results to return, default is 12',
    })
    count: number,
    @arg('filter', {
      nullable: true,
      description: 'filter the data using below field',
    })
    filter: Filter,
  ): Promise<AgentsData> {
    return this.agentController.getAgents(
      this.resolverData.context,
      offset,
      count,
      filter,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.STUDENT])
  @query(returns => AgentData)
  async getAgentById(
    @arg('agentId', type => ID) agentId: string,
  ): Promise<AgentData> {
    return this.agentController.getAgent(this.resolverData.context, agentId);
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => AgentData)
  async createAgent(
    @arg('createAgentData') createAgentData: CreateAgentData,
  ): Promise<AgentData> {
    return this.agentController.createAgent(
      this.resolverData.context,
      createAgentData,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Success)
  async deleteAgentById(
    @arg('agentId', type => ID) agentId: string,
  ): Promise<Success> {
    return this.agentController.deleteById(this.resolverData.context, agentId);
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => AgentProfile)
  async editAgent(
    @arg('agentId', type => ID) agentId: string,
    @arg('editAgentInput') editAgentInput: EditAgentInput,
  ): Promise<AgentProfile> {
    return this.agentController.edit(
      this.resolverData.context,
      agentId,
      editAgentInput,
    );
  }
}
