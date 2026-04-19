import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {Pagination} from './generic.type';

@inputType()
export class CreateEvent {
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
}
@inputType()
export class GetEvents {
  @field(type => Date, {nullable: true})
  @property()
  userDate?: Date;

  @field({nullable: true})
  @property()
  courseName?: string;

  @field(type => Pagination, {
    nullable: true,
  })
  pagination?: Pagination;
}

@inputType()
export class RegisteredEventInput {
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
}
