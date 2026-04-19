import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';

@inputType()
export class TestInformationInput {
  @field({nullable: true})
  @property()
  type?: string;
  //

  @field({nullable: true})
  dateOfExam?: string;

  @field({nullable: true})
  @property()
  readingScore?: string;

  @field({nullable: true})
  @property()
  listeningScore?: string;

  @field({nullable: true})
  @property()
  writingScore?: string;

  @field({nullable: true})
  @property()
  speakingScore?: string;

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
  awaRank?: string;

  @field({nullable: true})
  @property()
  resultAnnounced?: boolean;

  @field(type => String, {
    nullable: true,
  })
  certificates?: string;
}

@inputType()
export class RequiredTestCourseInput {
  @field()
  @property()
  type: string;

  @field({nullable: true})
  @property()
  dateOfExam?: string;

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

  @field({nullable: true})
  @property()
  resultAnnounced?: boolean;
}
