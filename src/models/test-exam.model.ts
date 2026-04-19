import {Entity, model, property} from '@loopback/repository';
@model()
export class TestExam extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  // Ielts
  @property({type: 'string', required: false})
  type?: string;

  @property({
    type: 'string',
  })
  dateOfExam?: string;

  @property({type: 'string', required: false})
  readingScore?: string;

  @property({type: 'string', required: false})
  listeningScore?: string;

  @property({type: 'string', required: false})
  speakingScore: string;

  @property({type: 'string', required: false})
  writingScore: string;

  //toefl

  // duolingo

  @property({type: 'string', required: false})
  totalScore?: string;

  //gmat

  @property({type: 'string', required: false})
  verbalScore?: string;

  @property({type: 'string', required: false})
  quantativeScore?: string;

  @property({type: 'string', required: false})
  awaScore?: string;

  @property({type: 'string', required: false})
  totalRank?: string;

  @property({type: 'string', required: false})
  verbalRank?: string;

  @property({type: 'string', required: false})
  quantativeRank?: string;

  @property({type: 'string', required: false})
  awaRank?: string;

  @property({type: 'string', required: false})
  resultAnnounced?: boolean;

  @property({type: 'string', reqired: false})
  certificates?: string;

  //gre

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

  constructor(data?: Partial<TestExam>) {
    super(data);
  }
}

export interface TestExamRelations {
  // describe navigational properties here
}

export type TestExamWithRelations = TestExam & TestExamRelations;
