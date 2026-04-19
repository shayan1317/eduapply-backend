import {Entity, hasMany, model, property} from '@loopback/repository';
import {Courses} from './courses.model';

@model()
export class UniDepartment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    required: false,
  })
  logo?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  media?: string[];

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  updatedAt: Date;

  @hasMany(() => Courses)
  courses: Courses[];

  @property({
    type: 'string',
  })
  universityProfileId?: string;

  constructor(data?: Partial<UniDepartment>) {
    super(data);
  }
}

export interface UniDepartmentRelations {
  // describe navigational properties here
}

export type UniDepartmentWithRelations = UniDepartment & UniDepartmentRelations;
