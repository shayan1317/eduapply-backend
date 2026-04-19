// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';
import {Course} from './course.type';

@objectType({description: 'Generic Uni department object'})
export class UniDepartmentOutput {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  name: string;

  @field({nullable: true})
  @property()
  logo?: string;

  @field({nullable: true})
  @property()
  description?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field({nullable: true})
  @property()
  universityProfileId?: string;

  @field(type => [String], {
    nullable: true,
  })
  media?: string[];

  @field(type => [Course], {
    nullable: true,
  })
  courses: Course[];
}

@objectType({description: 'Courses Array'})
@model({settings: {strict: false}})
export class UniDepartmentData {
  @field(type => [UniDepartmentOutput])
  uniDepartment: UniDepartmentOutput[];

  @field()
  @property()
  total: number;
}
