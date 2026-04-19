import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {Intake, Status} from '../enums.type';

import {TestInformationInput} from './test.type';

@inputType()
export class AddVisaAndStudyPermitStudentInput {
  @field({
    nullable: true,
  })
  @property()
  everRefusedEuVisa?: boolean;

  @field({
    nullable: true,
  })
  @property()
  spainVisa?: boolean;

  @field({
    nullable: true,
  })
  @property()
  schengenF1Visa?: boolean;

  @field({
    nullable: true,
  })
  @property()
  ukStudyVisa?: boolean;

  @field({
    nullable: true,
  })
  @property()
  switzerlandTier4Visa?: boolean;

  @field({
    nullable: true,
  })
  @property()
  irelandStamp2?: boolean;

  @field({
    nullable: true,
  })
  @property()
  isHavingVisa?: boolean;

  @field({
    nullable: true,
  })
  @property()
  visaDetails?: string;

  @field({
    nullable: true,
  })
  @property()
  fakePrevStatmentOrDocs?: boolean;
}
@inputType()
export class EditStudentInput {
  @field()
  @property()
  firstname: string;

  @field()
  @property()
  lastname: string;

  @field()
  @property()
  middlename?: string;

  @field({
    nullable: true,
  })
  @property()
  familyname: string;

  @field({
    nullable: true,
  })
  @property()
  skype?: string;

  @field({
    nullable: true,
  })
  @property()
  serviceInterest: string;

  @field({
    nullable: true,
  })
  @property()
  referralSource: string;

  @field(type => Status, {
    nullable: true,
  })
  @property()
  status: Status;

  @field(type => Intake, {
    nullable: true,
  })
  @property()
  intake: Intake;

  @field()
  @property()
  phone: string;

  @field({
    nullable: true,
  })
  @property()
  photo: string;

  @field()
  @property()
  dob: Date;

  @field()
  @property()
  citizenship: string;

  @field()
  @property()
  firstLanguage: string;

  @field()
  @property()
  passportNumber: string;

  @field()
  @property()
  passportExpiryDate: Date;

  @field()
  @property()
  gender: string;

  @field()
  @property()
  martialStatus: string;

  @field()
  @property()
  address: string;

  @field()
  @property()
  cityTown: string;

  @field()
  @property()
  country: string;

  @field()
  @property()
  state?: string;

  @field()
  @property()
  postalZipCode: string;

  @field()
  @property()
  countryOfEducation: string;

  @field()
  @property()
  HighestLevelOfEducation: string;
}

@inputType()
export class CreateStudentData extends EditStudentInput {
  @field()
  @property()
  email: string;

  @field(type => [SchoolAttendedInput])
  schoolAttended: SchoolAttendedInput[];

  @field(type => [TestInformationInput])
  testInformation: TestInformationInput[];

  @field(type => AddVisaAndStudyPermitStudentInput)
  visaInformation: AddVisaAndStudyPermitStudentInput;
}

@inputType()
export class CreateStudentUserInput {
  @field()
  @property()
  firstName: string;

  @field()
  @property()
  lastName: string;

  @field()
  @property()
  email: string;

  @field()
  @property()
  password: string;
}

@inputType()
export class CompleteGeneralInfoStudentInput {
  @field()
  @property()
  firstname: string;

  @field()
  @property()
  lastname: string;

  @field()
  @property()
  email: string;

  @field()
  @property()
  middlename?: string;

  @field({
    nullable: true,
  })
  @property()
  familyname: string;

  @field()
  @property()
  phone: string;

  @field()
  @property()
  dob: Date;

  @field()
  @property()
  citizenship: string;

  @field()
  @property()
  firstLanguage: string;

  @field()
  @property()
  passportNumber: string;

  @field()
  @property()
  passportExpiryDate: Date;
  @field({nullable: true})
  @property()
  isStepperCompleted?: boolean;

  @field()
  @property()
  gender: string;

  @field()
  @property()
  martialStatus: string;

  @field()
  @property()
  address: string;

  @field()
  @property()
  cityTown: string;

  @field()
  @property()
  country: string;

  @field()
  @property()
  state?: string;

  @field()
  @property()
  postalZipCode: string;

  @field()
  @property()
  countryOfEducation?: string;

  @field()
  @property()
  HighestLevelOfEducation?: string;
}
@inputType()
export class SchoolAttendedCertificatesInput {
  @field()
  url?: string;
}
@inputType()
export class SchoolAttendedInput {
  @field()
  @property()
  country?: string;

  @field()
  @property()
  name?: string;

  @field()
  @property()
  level?: string;

  @field()
  @property()
  primaryLanguage?: string;

  @field()
  @property()
  attendedInstutionFrom?: string;

  @field()
  @property()
  attendedInstutionTo?: string;

  @field()
  @property()
  degreeName?: string;

  @field()
  @property()
  isGraduated?: boolean;

  @field()
  @property()
  address?: string;

  @field()
  @property()
  cityTown?: string;

  @field()
  @property()
  provinceState?: string;

  @field()
  @property()
  postalCode?: string;

  @field()
  @property()
  documents?: SchoolAttendedCertificatesInput;
}

@inputType()
export class CompleteEducationHistoryStudentInput {
  @field(type => [SchoolAttendedInput], {
    nullable: true,
  })
  schoolAttended?: SchoolAttendedInput[];
}

@inputType()
export class AddTestsAndExamsResultsStudentInput {
  @field()
  @property()
  studentProfileId: string;

  @field(type => [TestInformationInput], {
    nullable: true,
  })
  testInformation?: TestInformationInput[];
}
