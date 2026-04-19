import {Entity, model, property} from '@loopback/repository';

@model()
export class StudentStaff extends Entity {
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
  staffProfileId?: string;

  @property({
    type: 'string',
  })
  studentProfileId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StudentStaff>) {
    super(data);
  }
}

export interface StudentStaffRelations {
  // describe navigational properties here
}

export type StudentStaffWithRelations = StudentStaff & StudentStaffRelations;
