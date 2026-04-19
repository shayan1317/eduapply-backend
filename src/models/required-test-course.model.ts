import {Entity, model, property} from '@loopback/repository';

@model()
export class RequiredTestCourse extends Entity {
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
  type: string;

  @property({type: 'date'})
  dateOfExam: Date;

  @property({type: 'number'})
  readingScore?: number;

  @property({type: 'number'})
  listeningScore?: number;

  @property({type: 'number'})
  speakingScore?: number;

  @property({type: 'number'})
  writingScore?: number;

  @property({
    type: 'number',
  })
  totalScore?: number;

  @property({type: 'number'})
  verbalScore?: number;

  @property({type: 'number'})
  quantativeScore?: number;

  @property({
    type: 'number',
  })
  awaScore?: number;

  @property({
    type: 'number',
  })
  totalRank?: number;

  @property({
    type: 'number',
  })
  verbalRank?: number;

  @property({
    type: 'number',
  })
  quantativeRank?: number;

  @property({
    type: 'number',
  })
  awaRank?: number;

  @property({
    type: 'boolean',
  })
  resultAnnounced?: boolean;

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
  universityId?: string;

  @property({
    type: 'string',
  })
  departmentId?: string;

  @property({
    type: 'string',
  })
  coursesId?: string;

  constructor(data?: Partial<RequiredTestCourse>) {
    super(data);
  }
}

export interface RequiredTestCourseRelations {
  // describe navigational properties here
}

export type RequiredTestCourseWithRelations = RequiredTestCourse &
  RequiredTestCourseRelations;
