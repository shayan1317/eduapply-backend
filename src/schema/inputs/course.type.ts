import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {Intake} from '../enums.type';
import {RequiredTestCourseInput} from './test.type';
@inputType()
export class CourseInput {
  @field()
  @property()
  departmentId: string;

  @field()
  @property()
  universityId: string;

  @field({nullable: true})
  @property()
  logo?: string;

  @field()
  @property()
  level: string;

  @field()
  @property()
  field: string;

  @field()
  @property()
  program: string;

  @field({nullable: true})
  @property()
  title?: string;

  @field({nullable: true})
  @property()
  courseOverview?: string;

  @field({nullable: true})
  educationLevel?: string;

  @field({nullable: true})
  gradingAvg?: number;

  @field({nullable: true})
  gradingScale?: number;

  @field({nullable: true})
  gradingScheme?: string;

  @field(type => [Intake], {nullable: true})
  @property()
  intake?: Intake[];

  @field({nullable: true})
  @property()
  studyTime?: string;

  @field()
  @property()
  fee: number;

  @field()
  @property()
  applicationFee: number;

  @field({nullable: true})
  @property()
  studyOptions?: string;

  @field({nullable: true})
  @property()
  locationName?: string;

  @field(type => [RequiredTestCourseInput])
  requiredTestCourses: RequiredTestCourseInput[];

  @field(type => [String], {
    nullable: true,
  })
  reqDocs?: string[];

  @field(type => [String], {
    nullable: true,
  })
  media?: string[];
}
