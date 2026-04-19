import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';

//used in student-profile
@objectType({description: 'TestInformation object'})
@model()
export class TestInformation {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field({nullable: true})
  @property()
  studentProfileId?: string;

  @field({nullable: true})
  @property()
  type?: string;
  // Ielts

  @field({nullable: true})
  @property()
  dateOfExam?: string;

  @field({nullable: true})
  @property()
  readingScore?: string;

  @field({nullable: true})
  @property()
  listeningScore?: string;

  @field({nullable: true})
  @property()
  speakingScore?: string;

  @field({nullable: true})
  @property()
  writingScore?: string;

  // duolingo
  @field({nullable: true})
  @property()
  totalScore?: string;

  //gmat
  @field({nullable: true})
  @property()
  verbalScore?: string;

  @field({nullable: true})
  @property()
  quantativeScore?: string;

  @field({nullable: true})
  @property()
  awaScore?: string;

  @field({nullable: true})
  @property()
  totalRank?: string;

  @field({nullable: true})
  @property()
  verbalRank?: string;

  @field({nullable: true})
  @property()
  quantativeRank?: string;

  @field({nullable: true})
  @property()
  certificates?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;
}

//used in course
@objectType({description: 'TestInformation object'})
@model()
export class RequiredTestCourse {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  type: string;

  @field({nullable: true})
  @property()
  dateOfExam?: Date;

  @field({nullable: true})
  @property()
  readingScore?: number;

  @field({nullable: true})
  @property()
  listeningScore?: number;

  @field({nullable: true})
  @property()
  speakingScore?: number;

  @field({nullable: true})
  @property()
  writingScore?: number;

  @field({nullable: true})
  @property()
  totalScore?: number;

  @field({nullable: true})
  @property()
  verbalScore?: number;

  @field({nullable: true})
  @property()
  quantativeScore?: number;

  @field({nullable: true})
  @property()
  awaScore?: number;

  @field({nullable: true})
  @property()
  totalRank?: number;

  @field({nullable: true})
  @property()
  verbalRank?: number;

  @field({nullable: true})
  @property()
  quantativeRank?: number;

  @field({nullable: true})
  @property()
  awaRank?: number;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field({nullable: true})
  @property()
  coursesId?: string;

  @field({nullable: true})
  @property()
  departmentId?: string;

  @field({nullable: true})
  @property()
  universityId?: string;
}
