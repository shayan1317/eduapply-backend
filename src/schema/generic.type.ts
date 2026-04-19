import {field, ID, objectType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {VerificationStatus} from './enums.type';

@objectType({description: 'Generic success response'})
export class Success {
  @field({
    nullable: false,
    description: 'true if operation was successful',
  })
  success: boolean;
}

@objectType({description: 'Generic success response'})
export class BooleanResult {
  @field({
    nullable: false,
  })
  result: boolean;
}

@objectType({description: 'Generic email verification response'})
export class EmailVerificationStatus {
  @field({
    nullable: false,
    description: 'Current verification state',
  })
  status: VerificationStatus;

  @field({
    nullable: true,
    description: '',
  })
  message?: string;

  @field(type => ID)
  verificationId: string;
}
@objectType({description: 'Generic email verification response'})
export class JwtTokenForOtp {
  @field(type => ID)
  verificationID: string;

  @field(type => ID)
  userId: string;
}

@objectType({description: 'Generic resetpassword response'})
export class ResetPasswordCodeStatus {
  @field(type => ID)
  verificationId: string;

  @field({
    nullable: false,
    description: 'Current verification state',
  })
  status: VerificationStatus;

  @field({
    nullable: true,
    description: '',
  })
  message?: string;

  @field({nullable: true})
  firstName?: string;

  @field({nullable: true})
  lastName?: string;

  @field()
  email?: string;
}

@objectType({description: 'Generic docs object'})
export class Documents {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  url: string;

  @field(type => Date)
  @property()
  createdAt: Date;

  @field(type => Date)
  @property()
  updatedAt: Date;

  @field()
  @property()
  userId: string;
}

@objectType({description: 'Generic location object'})
export class Location {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  lat: string;

  @field()
  @property()
  lon: string;

  @field({nullable: true})
  @property()
  universityProfileId?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;
}

@objectType({description: 'Generic rankings object'})
export class Ranking {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  publisher: string;

  @field()
  @property()
  rank: string;

  @field({nullable: true})
  @property()
  universityProfileId?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;
}
@objectType({description: 'school attended info'})
export class SchoolAttendedCertificates {
  @field(type => ID)
  @property()
  id: string;

  @field({nullable: true})
  url: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field({nullable: true})
  @property()
  schoolAttendedId?: string;
}
@objectType({description: 'Generic SchoolAttended object'})
export class SchoolAttended {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field({nullable: true})
  @property()
  universityProfileId?: string;

  @field({nullable: true})
  @property()
  country?: string;

  @field({nullable: true})
  @property()
  name?: string;

  @field({nullable: true})
  @property()
  level?: string;

  @field({nullable: true})
  @property()
  primaryLanguage?: string;

  @field({nullable: true})
  @property()
  attendedInstutionFrom?: string;

  @field({nullable: true})
  @property()
  attendedInstutionTo?: string;

  @field({nullable: true})
  @property()
  degreeName?: string;

  @field({nullable: true})
  @property()
  isGraduated?: boolean;

  @field({nullable: true})
  @property()
  address?: string;

  @field({nullable: true})
  @property()
  cityTown?: string;

  @field({nullable: true})
  @property()
  provinceState?: string;

  @field({nullable: true})
  @property()
  postalCode?: string;

  @field({nullable: true})
  @property()
  studentProfileId?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field({nullable: true})
  @property()
  documents?: SchoolAttendedCertificates;
}

@objectType({description: 'VISA info object'})
export class VisaInformation {
  @field(type => ID)
  @property({id: true})
  id: string;

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

  @field({nullable: true})
  @property()
  studentProfileId?: string;
  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;
}

@objectType({description: 'Generic video object'})
export class Video {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field({nullable: true})
  @property()
  title?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field({nullable: true})
  @property()
  description?: string;

  @field({nullable: true})
  @property()
  url?: string;

  @field({
    nullable: true,
    description: 'Length of the video in milliseconds',
  })
  @property()
  length?: number;

  @field({nullable: true})
  @property()
  format?: string;
}

@objectType({description: 'DropdownAndOptions'})
export class OptionsForSelect {
  @field(type => ID)
  @property({id: true})
  label: string;

  @field()
  @property()
  value: string;
}
@objectType({description: 'DropdownAndOptions'})
export class DropdownAndOptionsData {
  @field({
    description: 'Json string of all the availaible programs and level map',
  })
  @property()
  uniProgramsByLevelAndField: string;

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  studyOptions: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  studyTimings: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  studyLoactions: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  intakes: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  testTypes: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  rankingPublishers: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  typeOfUnis: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  gradingScheme: OptionsForSelect[];

  @field(type => [OptionsForSelect], {
    nullable: true,
  })
  educationLevel: OptionsForSelect[];
}
