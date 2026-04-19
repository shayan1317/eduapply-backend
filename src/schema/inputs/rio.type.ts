import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';

@inputType()
export class RioProfileInput {
  @field()
  @property()
  firstName: string;

  @field()
  @property()
  lastName: string;

  @field()
  @property()
  email: string;

  // @field()
  // @property()
  // universityProfileId: string;
}
