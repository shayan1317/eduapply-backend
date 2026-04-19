import {field, inputType} from '@loopback/graphql';

@inputType()
export class NotificationInput {
  @field()
  title: string;

  @field()
  description: string;
}
