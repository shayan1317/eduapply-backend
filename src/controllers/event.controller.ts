// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Event as EventModel} from '../models';
import {
  EventRepository,
  StudentEventRepository,
  StudentProfileRepository,
} from '../repositories';
import {Success} from '../schema';
import {Event, EventData, RegisteredEvent} from '../schema/event.type';
import {Filter} from '../schema/inputs';
import {
  CreateEvent,
  GetEvents,
  RegisteredEventInput,
} from '../schema/inputs/event.type';
export class EventController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;
  @repository(StudentProfileRepository)
  private studentProfileRepo: StudentProfileRepository;

  @repository(StudentEventRepository)
  studentEventRepo: StudentEventRepository;
  constructor(
    @repository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async createEvent(context: any, eventData: CreateEvent): Promise<Event> {
    try {
      const newEvent = await this.eventRepository.create(eventData);
      return newEvent;
    } catch (error) {
      this.logger.error('createEvent', error);
      throw error;
    }
  }

  async editEvent(
    context: any,
    eventData: CreateEvent,
    eventId: string,
  ): Promise<Event> {
    try {
      const event = await this.eventRepository.findById(eventId);
      if (!event) throw HttpErrors.NotFound('event not found');
      const updateEvent = await this.eventRepository.updateById(eventId, {
        ...eventData,
        updatedAt: Date.now(),
      });
      const updatedEvent = await this.eventRepository.findById(eventId);

      return updatedEvent;
    } catch (error) {
      this.logger.error('edit event', error);
      throw error;
    }
  }

  async getEvent(context: any, eventId: string): Promise<Event> {
    try {
      const Event = await this.eventRepository.findById(eventId, {
        include: [{relation: 'studentEvents'}],
      });

      if (!Event) throw HttpErrors.NotFound('event not found');

      return Event;
    } catch (err) {
      throw err;
    }
  }

  async deleteEventById(context: any, eventId: string): Promise<Success> {
    try {
      const newEvent = await this.eventRepository.findById(eventId, {
        include: [{relation: 'studentEvents'}],
      });
      if (!newEvent) throw HttpErrors.NotFound('event not found');
      await this.eventRepository.deleteById(eventId);

      return {success: true};
    } catch (error) {
      this.logger.error('delete', error);
      throw error;
    }
  }

  async getEvents(
    context: any,
    count: number,
    offset: number,
    filter: Filter,
    getEvents: GetEvents,
  ): Promise<EventData> {
    try {
      const {name: courseName, subject, eventPlace} = filter || {};
      const {userDate} = getEvents;
      const whereBuilder = new WhereBuilder<EventModel>();
      if (userDate) {
        const startOfDay = new Date(
          userDate.getFullYear(),
          userDate.getMonth(),
          userDate.getDate(),
        );
        const endOfDay = new Date(
          userDate.getFullYear(),
          userDate.getMonth(),
          userDate.getDate() + 1,
        );
        whereBuilder.between('date', startOfDay, endOfDay);
      }
      if (courseName) {
        whereBuilder.ilike('name', `%${courseName}%`);
      } else if (subject) {
        whereBuilder.ilike('subject', `%${subject}%`);
      } else if (eventPlace) {
        whereBuilder.ilike('place', `%${eventPlace}%`);
      }
      const where = whereBuilder?.build();
      const events = await this.eventRepository.find({
        where,
        limit: count,
        skip: offset,
        order: ['date DESC'],
      });
      let total = null;
      if (whereBuilder) {
        total = await this.eventRepository.count(where);
      } else {
        total = await this.eventRepository.count();
      }

      return {
        events,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('errorGetAllEvents', error);
      throw error;
    }
  }

  async registerStudentToEvent(
    context: any,
    // studentProfileId: string,
    eventId: string,
    eventRegistrationInput: RegisteredEventInput,
  ): Promise<RegisteredEvent> {
    try {
      const {firstName, lastName, email, phonenum, state, country, city} =
        eventRegistrationInput;
      const Event = await this.eventRepository.findById(eventId);
      if (!Event) throw HttpErrors.NotFound('event not found');
      const eventHasStudent = await this.studentEventRepo.findOne({
        where: {
          and: [{eventId}, {email}],
        },
      });
      if (eventHasStudent)
        throw HttpErrors.NotFound('email already registered not found');
      // const StudentProfile = await this.studentProfileRepo.findById(
      //   studentProfileId,
      // );
      // if (!StudentProfile)
      //   throw HttpErrors.NotFound('student Profile not found');

      const eventRegistration = await this.studentEventRepo.create({
        firstName,
        lastName,
        city,
        phonenum,
        country,
        state,
        email,

        eventId,
      });

      return eventRegistration;
    } catch (err) {
      throw err;
    }
  }

  async deleteRegisterStudentToEvent(
    context: any,
    studentRegisteredId: string,
  ): Promise<Success> {
    try {
      const studentEvent = await this.studentEventRepo.findById(
        studentRegisteredId,
      );
      if (!studentEvent)
        throw HttpErrors.NotFound('student not regsitered  this event');

      await this.studentEventRepo.deleteById(studentRegisteredId);

      return {success: true};
    } catch (err) {
      throw err;
    }
  }
}
