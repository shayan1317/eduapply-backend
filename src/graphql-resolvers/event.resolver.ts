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
import {EventController} from '../controllers';
import {Roles, Success} from '../schema';
import {Event, EventData, RegisteredEvent} from '../schema/event.type';
import {Filter} from '../schema/inputs';
import {
  CreateEvent,
  GetEvents,
  RegisteredEventInput,
} from '../schema/inputs/event.type';
@resolver()
export class EventResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.EventController')
    private eventController: EventController,
  ) {}

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.STUDENT])
  @query(returns => EventData)
  async getEvents(
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

    @arg('getEvents') getEvents: GetEvents,
  ): Promise<EventData> {
    return this.eventController.getEvents(
      this.resolverData.context,
      count,
      offset,
      filter,
      getEvents,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Event)
  async createEvent(
    @arg('createEvent') createEvent: CreateEvent,
  ): Promise<Event> {
    return this.eventController.createEvent(
      this.resolverData.context,
      createEvent,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Success)
  async deleteEventById(
    @arg('eventId', type => ID) eventId: string,
  ): Promise<Success> {
    return this.eventController.deleteEventById(
      this.resolverData.context,
      eventId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Event)
  async editEventById(
    @arg('eventData') eventData: CreateEvent,
    @arg('eventId', type => ID) eventId: string,
  ): Promise<Event> {
    return this.eventController.editEvent(
      this.resolverData.context,
      eventData,
      eventId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN, Roles.STUDENT])
  @query(returns => Event)
  async getEventById(
    @arg('eventId', type => ID) eventId: string,
  ): Promise<Event> {
    return this.eventController.getEvent(
      this.resolverData.context,

      eventId,
    );
  }

  @authorized([Roles.STUDENT, Roles.STUDENT, Roles.ADMIN])
  @mutation(returns => RegisteredEvent)
  async registerToEvent(
    // @arg('studentProfileId') studentProfileId: string,
    @arg('eventId') eventId: string,
    @arg('eventRegistrationInput') eventRegistrationInput: RegisteredEventInput,
  ): Promise<RegisteredEvent> {
    return this.eventController.registerStudentToEvent(
      this.resolverData.context,
      // studentProfileId,
      eventId,
      eventRegistrationInput,
    );
  }

  @authorized([Roles.STUDENT, Roles.STUDENT, Roles.ADMIN])
  @mutation(returns => Success)
  async deleteRegisteredStudentToEvent(
    // @arg('studentProfileId') studentProfileId: string,
    @arg('studentRegisteredId') studentRegisteredId: string,
  ): Promise<Success> {
    return this.eventController.deleteRegisterStudentToEvent(
      this.resolverData.context,
      studentRegisteredId,
    );
  }
}
