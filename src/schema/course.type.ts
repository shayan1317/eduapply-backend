// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';
import {Intake} from './enums.type';
import {RequiredTestCourse} from './test.type';

@objectType({description: 'Generic course object'})
export class Course {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  level: string;

  @field({nullable: true})
  @property()
  title?: string;

  @field({nullable: true})
  courseOverview?: string;

  @field({nullable: true})
  @property()
  logo?: string;

  @field({nullable: true})
  educationLevel?: string;

  @field({nullable: true})
  gradingAvg?: number;

  @field({nullable: true})
  gradingScale?: number;

  @field({nullable: true})
  gradingScheme?: string;

  @field(type => [Intake], {nullable: true})
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

  @field()
  @property()
  field: string;

  @field()
  @property()
  program: string;

  @field({nullable: true})
  @property()
  universityProfileId?: string;

  @field({nullable: true})
  @property()
  uniDepartmentId?: string;

  @field(type => [String], {
    nullable: true,
  })
  media?: string[];

  @field(type => [String], {
    nullable: true,
  })
  reqDocs?: string[];

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field(type => [RequiredTestCourse], {
    nullable: true,
  })
  requiredTestCourses?: RequiredTestCourse[];
}

@objectType({description: 'Courses Array'})
@model({settings: {strict: false}})
export class SubjectsData {
  @field(type => [Course])
  courses: Course[];

  @field()
  @property()
  total: number;
}
