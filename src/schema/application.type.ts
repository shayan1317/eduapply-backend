import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';
import {Course} from './course.type';
import {
  APPLICATION_FEE_STATUS_ENUM,
  CURRENCY_ENUM,
  DOC_STATUS,
  EventNames,
  TutionFeeVerification,
} from './enums.type';
import {Video} from './generic.type';
import {GetStudentRes} from './student.type';
@objectType({description: 'Generic application status '})
export class StudentApplicationStatus {
  @field(type => ID)
  id: string;

  @field()
  status: string;

  @field({
    nullable: true,
  })
  date: Date;

  @field({nullable: true})
  title: string;

  @field(type => Date)
  @property()
  createdAt: Date;

  @field(type => Date)
  @property()
  updatedAt: Date;

  @field(type => EventNames)
  eventName: EventNames;
}

@objectType({description: 'Generic application status '})
export class GetApplicationStatusRes {
  @field(type => [StudentApplicationStatus])
  applicationStatus: StudentApplicationStatus[];
}
@objectType({description: 'Generic ApplicationRequirement object'})
export class ApplicationRequirement {
  @field(type => ID, {
    nullable: true,
  })
  @property({id: true})
  url?: string;

  @field({nullable: true})
  @property()
  title?: string;

  @field(type => Date, {
    nullable: true,
  })
  @property()
  createdAt?: Date;

  @field(type => Date, {
    nullable: true,
  })
  @property()
  updatedAt?: Date;

  @field({
    nullable: true,
  })
  @property()
  studentId?: string;

  @field({
    nullable: true,
  })
  @property()
  status?: string;
}

@objectType({description: 'student uploaded documents details'})
export class StudentDocuments {
  @field({
    nullable: true,
  })
  url?: string;

  @field({
    nullable: true,
  })
  dateOfUpload?: string;

  @field(type => Date, {nullable: true})
  @property()
  createdAt?: Date;

  @field(type => Date, {nullable: true})
  @property()
  updatedAt?: Date;
}

@objectType({description: 'OfferLetter'})
export class OfferLetter {
  //application id
  @field(type => ID, {
    nullable: true,
  })
  id: number;

  @field({
    nullable: true,
  })
  url?: string;

  @field({
    nullable: true,
  })
  dateOfUpload?: string;

  @field({
    nullable: true,
  })
  createdAt?: string;

  @field({
    nullable: true,
  })
  updatedAt?: string;
}

@objectType({description: 'VisaSupportLetter'})
export class VisaSupportLetter {
  //application id
  @field(type => ID, {
    nullable: true,
  })
  id: number;

  @field({
    nullable: true,
  })
  url?: string;

  @field({
    nullable: true,
  })
  dateOfUpload?: string;

  @field({
    nullable: true,
  })
  createdAt?: string;

  @field({
    nullable: true,
  })
  updatedAt?: string;
}

@objectType({description: 'Generic ApplicationNotes object'})
export class ApplicationNotes {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field({
    nullable: true,
  })
  @property()
  title?: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field({
    nullable: true,
  })
  @property()
  dateOfCreation?: string;
  @field({nullable: true})
  @property()
  text?: string;

  @field({nullable: true})
  @property()
  sender?: string;
}

@objectType({description: 'Generic ApplicationTrackRecord object'})
export class ApplicationTrackRecord {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field({
    nullable: true,
  })
  @property()
  title?: string;

  @field(type => DOC_STATUS)
  @property()
  status: string;

  @field({
    nullable: true,
  })
  @property()
  url?: string;

  @field({
    nullable: true,
  })
  @property()
  applicationId?: number;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;
}

@objectType({description: 'Generic Uni department object without courses'})
export class DepartmentDetails {
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
}

@objectType({description: 'Generic Uni details object without relations'})
export class UniversityDetails {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field()
  @property()
  universityNumber: number;

  @field()
  @property()
  name: string;

  @field({nullable: true})
  totalStudents?: number;

  @field()
  @property()
  website: string;

  @field()
  @property()
  email: string;

  @field()
  @property()
  country: string;

  @field(type => Date)
  @property()
  yearOfEstablished: Date;

  @field()
  @property()
  type: string;

  @field()
  @property()
  address: string;

  @field()
  @property()
  city: string;

  @field()
  @property()
  state: string;

  @field()
  @property()
  pincode: string;

  @field()
  @property()
  phone: string;

  @field()
  @property()
  faxNumber: string;

  @field()
  @property()
  agentsRelationManager: string;

  @field()
  @property()
  contactPersonName: string;

  @field()
  @property()
  contactPersonEmail: string;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field(type => [String], {
    nullable: true,
  })
  media?: string[];

  @field({
    nullable: true,
  })
  description?: string;

  @field({
    nullable: true,
  })
  campusLife?: string;

  @field({
    nullable: true,
  })
  requirements?: string;

  @field({
    nullable: true,
  })
  alumni?: string;

  @field({
    nullable: true,
  })
  logo?: string;

  @field(type => CURRENCY_ENUM, {nullable: true})
  @property()
  currency?: string;
}

@objectType({description: 'Application'})
@model({settings: {strict: false}})
export class StudentApplication {
  @field(type => ID, {
    nullable: true,
  })
  id?: number;

  @field(type => Date)
  @property()
  createdAt?: Date;

  @field(type => Date)
  @property()
  updatedAt?: Date;

  @field(type => Date, {
    nullable: true,
  })
  @property()
  applicationDate?: Date;

  @field(type => Date, {
    nullable: true,
  })
  @property()
  dueDate?: Date;

  @field(type => Date, {
    nullable: true,
  })
  @property()
  applicationPaymentDate?: Date;

  @field(type => TutionFeeVerification, {
    nullable: true,
  })
  @property()
  paymentStatus?: TutionFeeVerification;

  @field({
    nullable: true,
  })
  @property()
  status?: string;

  @field({
    nullable: true,
  })
  @property()
  applicationFee?: number;

  @field({
    nullable: true,
  })
  @property()
  applicationFeeCurrency?: string;

  @field({
    nullable: true,
  })
  @property()
  intakes?: string;

  @field({
    nullable: true,
  })
  @property()
  coursesId?: string;

  @field({
    nullable: true,
  })
  @property()
  studentProfileId?: string;

  @field({
    nullable: true,
  })
  @property()
  agentProfileId?: string;

  @field(type => APPLICATION_FEE_STATUS_ENUM, {
    nullable: true,
  })
  applicationFeeStatus?: string;

  @field(type => APPLICATION_FEE_STATUS_ENUM, {nullable: true})
  @property()
  applicationFeePaymentStatus?: string;

  @field({nullable: true})
  @property()
  applicationFeeInvoiceDownloadUrl?: string;

  @field(type => [StudentApplicationStatus], {nullable: true})
  applicationStatuses?: StudentApplicationStatus[];

  @field(type => OfferLetter, {nullable: true})
  offerLetter?: OfferLetter;

  @field(type => StudentDocuments, {nullable: true})
  addmissionFeeVerification?: StudentDocuments;

  @field(type => VisaSupportLetter, {nullable: true})
  visaSupportLetter?: VisaSupportLetter;

  @field(type => StudentDocuments, {nullable: true})
  refundLetter?: StudentDocuments;

  @field(type => [ApplicationTrackRecord], {
    nullable: true,
  })
  @property()
  applicationTrackRecords?: ApplicationTrackRecord[];

  @field(type => Course, {
    nullable: true,
  })
  @property()
  courseDetails?: Course;

  @field(type => DepartmentDetails, {
    nullable: true,
  })
  @property()
  departmentDetails?: DepartmentDetails;

  @field(type => UniversityDetails, {
    nullable: true,
  })
  @property()
  universityDetails?: UniversityDetails;

  @field(type => GetStudentRes, {nullable: true})
  studentData?: GetStudentRes;

  @field(type => [Video], {
    nullable: true,
  })
  @property()
  videos?: Video[];

  @field(type => [ApplicationNotes], {
    nullable: true,
  })
  @property()
  applicationNotes?: ApplicationNotes[];
}

@objectType({description: 'Application Array'})
@model({settings: {strict: false}})
export class StudentApplications {
  @field(type => ID)
  @property({id: true})
  id: string;

  @field(type => [StudentApplication])
  studentApplications: StudentApplication[];

  @field()
  @property()
  total: number;
}
