import {inject} from '@loopback/core';
import {
  GraphQLBindings,
  ResolverData,
  arg,
  authorized,
  mutation,
  query,
  resolver,
} from '@loopback/graphql';
import {NotificationController} from '../controllers';
import {NotificationOutput, Roles, Success} from '../schema';
import {NotificationInput} from '../schema/inputs';

@resolver()
export class NotificationResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.NotificationController')
    private notificationController: NotificationController,
  ) {}

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
  ])
  @mutation(returns => Success)
  async sendNotificationToUser(
    @arg('applicationId') applicationId: number,

    @arg('notificationMessageInput')
    notificationMessageInput: NotificationInput,
    @arg('registrationToken', {nullable: true}) registrationToken?: string,
  ) {
    return this.notificationController.sendNotificationMessage(
      this.resolverData.context,
      applicationId,

      notificationMessageInput,
      registrationToken,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
  ])
  @query(returns => [NotificationOutput])
  async getNotifications(): Promise<NotificationOutput[]> {
    return this.notificationController.getNotifications(
      this.resolverData.context,
    );
  }
}
