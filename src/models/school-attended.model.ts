import {Entity, hasOne, model, property} from '@loopback/repository';
import {Documents} from './documents.model';

@model()
export class SchoolAttended extends Entity {
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
  country?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  level?: string;

  @property({
    type: 'string',
  })
  primaryLanguage?: string;

  @property({
    type: 'string',
  })
  attendedInstutionFrom?: string;

  @property({
    type: 'string',
  })
  attendedInstutionTo?: string;

  @property({
    type: 'string',
  })
  degreeName?: string;

  @property({
    type: 'boolean',
  })
  isGraduated?: boolean;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  cityTown?: string;

  @property({
    type: 'string',
  })
  provinceState?: string;

  @property({
    type: 'string',
  })
  postalCode?: string;

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
  studentProfileId?: string;

  @hasOne(() => Documents)
  documents: Documents;

  constructor(data?: Partial<SchoolAttended>) {
    super(data);
  }
}

export interface SchoolAttendedRelations {
  // describe navigational properties here
}

export type SchoolAttendedWithRelations = SchoolAttended &
  SchoolAttendedRelations;
