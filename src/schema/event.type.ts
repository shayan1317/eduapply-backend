import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';

@objectType({description: 'Event object'})
@model({settings: {strict: false}})
export class Event {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  name: string;

  @field()
  @property()
  organize: string;

  @field()
  @property()
  place: string;

  @field(type => Date)
  @property()
  date: Date;

  @field()
  @property()
  type: string;

  @field()
  @property()
  host: string;

  @field()
  @property()
  chiefGuest: string;

  @field()
  @property()
  subject: string;

  @field()
  @property()
  description: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  // @field(type => [StudentProfile], {nullable: true})
  // @property()
  // registeredStudentProfiles?: StudentProfile[];

  @field(type => [RegisteredEvent], {nullable: true})
  @property()
  studentEvents?: RegisteredEvent[];
}

@objectType({description: 'event registartion object'})
export class RegisteredEvent {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  firstName: string;

  @field()
  lastName: string;

  @field()
  country: string;

  @field()
  email: string;

  @field()
  city: string;

  @field()
  phonenum: string;

  @field()
  state: string;

  @field(type => Date)
  createdAt: Date;

  @field(type => Date)
  updatedAt: Date;
}

@objectType({description: 'Get Pagination Events'})
@model({settings: {strict: false}})
export class EventData {
  @field(type => [Event])
  events: Event[];

  @field()
  @property()
  total: number;
}
