import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AgentProfileRepository,
  ApplicationRepository,
  NotificationsRepository,
  StudentProfileRepository,
  UserRepository,
} from '../repositories';
import {NotificationOutput, Success} from '../schema';

import {messaging} from '../firebaseInit';
import {User} from '../models';
import {NotificationInput} from '../schema/inputs';

export class NotificationController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @repository(ApplicationRepository)
    private applicationRepo: ApplicationRepository,

    @repository(StudentProfileRepository)
    private studentRepo: StudentProfileRepository,
    @repository(AgentProfileRepository)
    private agentRepo: AgentProfileRepository,

    @repository(NotificationsRepository)
    private notificationRepo: NotificationsRepository,
  ) {}

  async sendNotificationMessage(
    context: any,
    applicationId: number,

    notificationMessageInput: NotificationInput,
    registrationToken?: string,
  ): Promise<Success> {
    try {
      let registrationToken = null;
      let user = null;
      const {title, description} = notificationMessageInput;
      const application = await this.applicationRepo.findById(applicationId);
      if (!application) throw HttpErrors.NotFound('application not found');
      if (application?.agentProfileId) {
        const agentProfile = await this.agentRepo.findOne({
          where: {id: application.agentProfileId},
        });
        if (!agentProfile) throw HttpErrors.NotFound('agent profile not found');

        user = await this.userRepo.findOne({where: {id: agentProfile?.userId}});
        if (!user) throw HttpErrors.NotFound('user  not found');
        registrationToken = user?.registrationToken;
      } else {
        const student = await this.studentRepo.findOne({
          where: {id: application?.studentProfileId},
        });
        if (!student) throw HttpErrors.NotFound('student profile not found');

        user = await this.userRepo.findOne({where: {id: student.userId}});
        if (!user) throw HttpErrors.NotFound('user  not found');
        registrationToken = user?.registrationToken;
      }

      await this.notificationRepo.create({
        title,
        description,
        userId: user?.id,
      });
      try {
        const message = {
          notification: {
            title,
            body: description,
          },
          token: registrationToken,
        };
        await messaging.send(message);
      } catch (err) {
        throw err;
      }

      return {success: true};
    } catch (err) {
      throw err;
    }
  }
  async getNotifications(context: any): Promise<NotificationOutput[]> {
    try {
      const user: User = context.user;
      const notifications = await this.notificationRepo.find({
        where: {userId: user?.id},
        order: ['createdAt DESC '],
      });
      return notifications;
    } catch (err) {
      throw err;
    }
  }
}
