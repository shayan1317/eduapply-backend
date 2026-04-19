import {field, inputType} from '@loopback/graphql';
import {Pagination} from './generic.type';

@inputType()
export class StudentTrainingInput {
  @field()
  courseName: string;

  @field()
  programName: string;

  @field()
  totalMarks: string;

  @field()
  timeDuration: string;

  @field()
  questionType: string;

  @field()
  testDate: string;

  @field({
    nullable: true,
  })
  document?: string;
}

@inputType()
export class GetStudentTrainings {
  @field({nullable: true})
  courseName?: string;

  @field(type => Pagination, {
    nullable: true,
  })
  pagination?: Pagination;
}
