import {Entity, model, property} from '@loopback/repository';
import {DOC_STATUS} from '../schema';

@model()
export class StudentApplicationTrackRecord extends Entity {
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
  })
  title?: string;

  // @property({
  //   type: 'string',
  // })
  // info?: string;

  @property({
    type: 'string',
    default: DOC_STATUS.REQUIRED,
    jsonSchema: {
      enum: Object.values(DOC_STATUS),
    },
  })
  status: string;

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

  @property({
    type: 'string',
  })
  url?: string;

  @property({
    type: 'number',
  })
  applicationId?: number;

  constructor(data?: Partial<StudentApplicationTrackRecord>) {
    super(data);
  }
}

export interface StudentApplicationTrackRecordRelations {
  // describe navigational properties here
}

export type StudentApplicationTrackRecordWithRelations =
  StudentApplicationTrackRecord & StudentApplicationTrackRecordRelations;
