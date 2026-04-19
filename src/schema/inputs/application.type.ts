import {field, inputType} from '@loopback/graphql';

import {DOC_STATUS} from '../enums.type';
import {
  EligibilityFilter,
  Pagination,
  ProgramDetailsFilter,
  SchoolDetailsFilter,
  VideoInput,
} from './generic.type';
@inputType()
export class GetApplicationFilter {
  @field(type => Pagination, {
    nullable: true,
  })
  pagination?: Pagination;

  @field(type => EligibilityFilter, {
    nullable: true,
  })
  eligibilityFilter?: EligibilityFilter;

  @field(type => SchoolDetailsFilter, {
    nullable: true,
  })
  schoolDetailsFilter?: SchoolDetailsFilter;

  @field(type => ProgramDetailsFilter, {
    nullable: true,
  })
  programDetailsFilter?: ProgramDetailsFilter;
}

@inputType()
export class ApplicationNoteInput {
  @field({
    nullable: true,
  })
  title?: string;

  @field({
    nullable: true,
  })
  text?: string;

  @field({
    nullable: true,
  })
  dateOfCreation: string;
}

// todo --> agentsAndAdmins should be able to update status

@inputType()
export class ApplicationRequirementInput {
  @field({
    nullable: true,
  })
  url?: string;

  @field({
    nullable: true,
  })
  dateOfUpload?: string;
}

@inputType()
export class ApplicationTrackRecordInput {
  @field()
  id: string;

  @field({
    nullable: true,
  })
  title?: string;

  @field(type => DOC_STATUS, {
    nullable: true,
  })
  status?: string;

  @field({nullable: true})
  url?: string;
}

@inputType()
export class UpdateApplicationInput {
  @field(type => ApplicationTrackRecordInput, {
    nullable: true,
  })
  applicationTrackRecords?: ApplicationTrackRecordInput;

  @field(type => ApplicationRequirementInput, {nullable: true})
  offerLetter?: ApplicationRequirementInput;

  @field(type => ApplicationRequirementInput, {nullable: true})
  addmissionFeeVerification?: ApplicationRequirementInput;

  @field(type => ApplicationRequirementInput, {nullable: true})
  visaSupportLetter?: ApplicationRequirementInput;

  @field(type => ApplicationRequirementInput, {nullable: true})
  refundLetter?: ApplicationRequirementInput;

  @field(type => VideoInput, {
    nullable: true,
  })
  video?: VideoInput;
  @field(type => ApplicationNoteInput, {
    nullable: true,
  })
  notes?: ApplicationNoteInput;
}

@inputType()
export class GetAllApplicationsInput {
  @field({
    description:
      'If agentProfileId is provided, it will return all the applications of that agent',
    nullable: true,
  })
  agentProfileId?: string;

  @field({
    description:
      'If studentProfileId is provided, it will return all the applications of that student',
    nullable: true,
  })
  studentProfileId?: string;

  @field({
    defaultValue: false,
    description:
      'If true, it will return all the applications of all the agents',
  })
  allAgentsApplications: boolean;

  @field({
    defaultValue: false,
    description:
      'If true, it will return all the applications of all the students',
  })
  allStudentsApplications: boolean;
}
