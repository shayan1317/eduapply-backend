import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';

@objectType({description: 'Student Training object'})
@model()
export class StudentTraining {
  @field(type => ID, {
    nullable: true
  })
  id?: number;

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
    nullable: true
  })
  document?: string;

}

@objectType({description: 'Get Pagination StudentTraining'})
@model()
export class StudentTrainingData {
  @field(type => [StudentTraining])
  studentTrainings: StudentTraining[];

  @field()
  @property()
  total: number

}
