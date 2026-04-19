import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Event,
  StudentEvent,
} from '../models';
import {EventRepository} from '../repositories';

export class EventStudentEventController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
  ) { }

  @get('/events/{id}/student-events', {
    responses: {
      '200': {
        description: 'Array of Event has many StudentEvent',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(StudentEvent)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<StudentEvent>,
  ): Promise<StudentEvent[]> {
    return this.eventRepository.studentEvents(id).find(filter);
  }

  @post('/events/{id}/student-events', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {'application/json': {schema: getModelSchemaRef(StudentEvent)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudentEvent, {
            title: 'NewStudentEventInEvent',
            exclude: ['id'],
            optional: ['eventId']
          }),
        },
      },
    }) studentEvent: Omit<StudentEvent, 'id'>,
  ): Promise<StudentEvent> {
    return this.eventRepository.studentEvents(id).create(studentEvent);
  }

  @patch('/events/{id}/student-events', {
    responses: {
      '200': {
        description: 'Event.StudentEvent PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudentEvent, {partial: true}),
        },
      },
    })
    studentEvent: Partial<StudentEvent>,
    @param.query.object('where', getWhereSchemaFor(StudentEvent)) where?: Where<StudentEvent>,
  ): Promise<Count> {
    return this.eventRepository.studentEvents(id).patch(studentEvent, where);
  }

  @del('/events/{id}/student-events', {
    responses: {
      '200': {
        description: 'Event.StudentEvent DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(StudentEvent)) where?: Where<StudentEvent>,
  ): Promise<Count> {
    return this.eventRepository.studentEvents(id).delete(where);
  }
}
