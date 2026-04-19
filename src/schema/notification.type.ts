import {ID, field, objectType} from '@loopback/graphql';

@objectType({description: 'notification message output'})
export class NotificationOutput {
  @field(type => ID)
  id: string;

  @field({nullable: true})
  title?: string;

  @field(type => ID)
  userId: string;

  @field({nullable: true})
  description?: string;

  @field(type => Date)
  createdAt: Date;

  @field(type => Date)
  updatedAt: Date;
}
