import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';

@inputType()
export class DepartmentInput {
  @field({nullable: true})
  @property()
  universityId?: string;

  @field({nullable: true})
  @property()
  name?: string;

  @field({nullable: true})
  @property()
  logo?: string;

  @field(type => [String], {
    nullable: true,
  })
  media?: string[];

  @field({nullable: true})
  @property()
  description?: string;
}
