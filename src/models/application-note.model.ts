import {Entity, model, property} from '@loopback/repository';

@model()
export class ApplicationNote extends Entity {
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

  @property({
    type: 'string',
  })
  text?: string;

  @property({
    type: 'string',
  })
  dateOfCreation?: string;
  @property({
    type: 'string',
  })
  sender?: string;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  createdAt: Date;

  @property({
    type: 'number',
  })
  applicationId?: number;

  constructor(data?: Partial<ApplicationNote>) {
    super(data);
  }
}

export interface ApplicationNoteRelations {
  // describe navigational properties here
}

export type ApplicationNoteWithRelations = ApplicationNote &
  ApplicationNoteRelations;
