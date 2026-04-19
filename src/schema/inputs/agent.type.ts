import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';
import {Status} from '../enums.type';

@inputType()
export class RecruitmentDetailsInput {
  @field()
  country?: string;

  @field()
  volume?: string;
}
@inputType()
export class CompleteEditAgentInput {
  @field({nullable: true})
  firstName: string;
  @field({nullable: true})
  lastName: string;
  @field({nullable: true})
  email?: string;
  @field({nullable: true})
  phone: string;
  @field({nullable: true})
  preferedContactMethod: string;
  @field({nullable: true})
  mainSource: string;
  @field({nullable: true})
  isRefered: string;
  @field({nullable: true})
  serviceProvidedToClients: string;
  @field({nullable: true})
  findAboutEduction: string;
  @field({nullable: true})
  recruitingYear: Date;

  @field({nullable: true})
  acitveAgencyAt: string;
  @field({nullable: true})
  facebookLink: string;
  @field({nullable: true})
  instaLink: string;
  @field({nullable: true})
  city: string;
  @field({nullable: true})
  state: string;
  @field({nullable: true})
  country: string;
  @field({nullable: true})
  postalCode: string;
  @field({nullable: true})
  businessName: string;
  @field({nullable: true})
  businessWebsiteURL: string;
  @field({nullable: true})
  businessCertificate: string;
  @field({nullable: true})
  businessLogo: string;
  @field(type => [RecruitmentDetailsInput], {nullable: true})
  recruitmentTo?: RecruitmentDetailsInput[];
  @field(type => [RecruitmentDetailsInput], {nullable: true})
  recruitmentFrom?: RecruitmentDetailsInput[];
  @field({nullable: true})
  marketingType: string;
  @field({nullable: true})
  serviceFee: string;
  @field({nullable: true})
  whyEducationOverCompetitors: string;
  @field({nullable: true})
  helpToGrowYourBusiness: string;
  @field({nullable: true})
  additionalComments: string;
  @field({nullable: true})
  howCanWeHelpYou: string;
}

@inputType()
export class EditAgentInput {
  @field()
  @property()
  name: string;

  @field()
  @property()
  phone: string;

  @field()
  @property()
  designation: string;

  @field({
    nullable: true,
  })
  @property()
  photo?: string;

  @field()
  @property()
  department: string;

  @field(type => Date)
  @property()
  dob: Date;

  @field()
  @property()
  education: string;

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

  @field()
  @property()
  website: string;

  @field()
  @property()
  gender: string;

  @field()
  @property()
  acitveAgencyAt: string;

  @field()
  @property()
  street: string;

  @field()
  @property()
  city: string;

  @field()
  @property()
  state: string;

  @field()
  @property()
  postalCode: string;

  @field()
  @property()
  country: string;

  @field()
  @property()
  bankName: string;

  @field()
  @property()
  accountHolderName: string;

  @field()
  @property()
  AccountNumber: string;

  @field()
  @property()
  iban: string;

  @field()
  @property()
  branchName: string;

  @field()
  @property()
  transitNumber: string;

  @field()
  @property()
  swiftCode: string;
}

@inputType()
export class CreateAgentData extends EditAgentInput {
  @field()
  @property()
  email: string;

  @field(type => [String], {
    nullable: true,
  })
  documents: string[];
}

@inputType()
export class ReviewAgentInput {
  @field()
  ratings: number;

  @field()
  review: string;
}
@inputType()
export class CreateAgentUserInput {
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

export class VerifyAgent {
  @field()
  @property()
  otp: string;

  @field()
  @property()
  token: string;
}

@inputType()
export class createStaffData {
  @field()
  @property()
  name: string;
  @field()
  @property()
  workEmail: string;

  @field()
  @property()
  jobTitle: string;
  @field()
  @property()
  ipRestriction: string;
  @field()
  @property()
  birthDate: string;
  @field()
  @property()
  education: string;
  @field()
  @property()
  website: string;
  @field()
  @property()
  gender: string;
  @field()
  @property()
  country: string;
  @field()
  @property()
  state: string;
  @field()
  @property()
  street: string;
  @field()
  @property()
  city: string;
  @field()
  @property()
  postalCode: string;
}
