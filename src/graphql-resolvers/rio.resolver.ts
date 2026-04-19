import {inject} from '@loopback/core';
import {
  arg,
  authorized,
  GraphQLBindings,
  ID,
  mutation,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {RioController} from '../controllers';
import {RioProfilesData, Roles, Success} from '../schema';
import {RioProfileInput} from '../schema/inputs';
import {RioProfile} from './../schema/rio.type';
@resolver()
export class RioResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.RioController')
    private rioController: RioController,
  ) {}

  // @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  // @mutation(returns => RioProfile)
  // async addRioProfile(
  //   @arg('rioProfileInput') rioProfileInput: RioProfileInput,
  // ): Promise<RioProfile> {
  //   return this.rioController.addRioProfile(
  //     this.resolverData.context,
  //     rioProfileInput,
  //   );
  // }
  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => RioProfile)
  async addRioProfile(
    @arg('rioProfileInput') rioProfileInput: RioProfileInput,
  ): Promise<RioProfile> {
    return this.rioController.addRio(
      this.resolverData.context,
      rioProfileInput,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => RioProfile)
  async editRioProfile(
    @arg('rioProfileId', type => ID) rioProfileId: string,
    @arg('rioProfileInput') rioProfileInput: RioProfileInput,
  ): Promise<RioProfile> {
    return this.rioController.edit(
      this.resolverData.context,
      rioProfileId,
      rioProfileInput,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @query(returns => RioProfilesData)
  async getRios(): Promise<RioProfilesData> {
    return this.rioController.getRios(this.resolverData.context);
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @query(returns => RioProfile)
  async getRioById(
    @arg('rioId', type => ID) rioId: string,
  ): Promise<RioProfile> {
    return this.rioController.getRio(this.resolverData.context, rioId);
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Success)
  async deleteRioById(
    @arg('rioProfileId', type => ID) rioProfileId: string,
  ): Promise<Success> {
    return this.rioController.deleteById(
      this.resolverData.context,
      rioProfileId,
    );
  }
  @authorized([Roles.ADMIN, Roles.SUPER_ADMIN, Roles])
  @mutation(returns => Success)
  async assignRioToUniversity(
    @arg('univeristyId', type => ID) univeristyId: string,
    @arg('rioId', type => ID) rioId: string,
  ): Promise<Success> {
    return this.rioController.assignRio(
      this.resolverData.context,
      univeristyId,
      rioId,
    );
  }

  @authorized([Roles.ADMIN, Roles.SUPER_ADMIN, Roles])
  @mutation(returns => Success)
  async deleteAssignRioToUniversity(
    @arg('univeristyId', type => ID) univeristyId: string,
    @arg('rioId', type => ID) rioId: string,
  ): Promise<Success> {
    return this.rioController.deleteAssignRio(
      this.resolverData.context,
      univeristyId,
      rioId,
    );
  }
}
