import {Entity, property} from '@loopback/repository';
export class StudentRecruitment extends Entity {
  @property({
    type: 'string',
  })
  recruitmentFrom: string;
  @property({
    type: 'string',
  })
  totalNumberRecruitFrom: string;
  @property({
    type: 'string',
  })
  recruitmentTo: string;
  @property({
    type: 'string',
  })
  totalNumberRecruitTo: string;
  constructor(data?: Partial<StudentRecruitment>) {
    super(data);
  }
}
