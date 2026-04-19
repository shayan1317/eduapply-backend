import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {
  APPLICATION_FEE_STATUS_ENUM,
  CURRENCY_ENUM,
  TutionFeeVerification,
} from '../schema';
import {ApplicationNote} from './application-note.model';
import {ApplicationStatus} from './application-status.model';
import {Courses} from './courses.model';
import {StudentApplicationTrackRecord} from './student-application-track-record.model';
import {StudentProfile} from './student-profile.model';
import {Video} from './video.model';

@model()
export class Application extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  dueDate?: Date;

  @property({
    type: 'string',
    required: false,
    default: TutionFeeVerification.UNPAID,
  })
  paymentStatus?: string;

  @property({
    type: 'string',
    required: false,
    default: APPLICATION_FEE_STATUS_ENUM.PENDING,
    jsonSchema: {
      enum: Object.values(APPLICATION_FEE_STATUS_ENUM),
    },
  })
  applicationFeePaymentStatus: string;

  @property({
    type: 'string',
  })
  applicationFeeCheckoutSessionId?: string;

  @property({
    type: 'string',
  })
  applicationFeeInvoiceId?: string;

  @property({
    type: 'number',
    required: false,
  })
  applicationFee?: number;

  @property({
    type: 'string',
    required: false,
    default: CURRENCY_ENUM.USD,
  })
  applicationFeeCurrency?: string;

  @property({
    type: 'string',
  })
  applicationFeeInvoiceDownloadUrl?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  intakes?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  applicationDate?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  applicationPaymentDate?: Date;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  createdAt: Date;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  updatedAt: Date;

  @property({
    type: 'object',
  })
  offerLetter?: object;

  @property({
    type: 'object',
  })
  addmissionFeeVerification?: object;

  @property({
    type: 'object',
  })
  visaSupportLetter?: object;

  @property({
    type: 'object',
  })
  refundLetter?: object;

  @hasMany(() => ApplicationStatus)
  applicationStatuses: ApplicationStatus[];

  @belongsTo(() => StudentProfile)
  studentProfileId: string;

  @property({
    type: 'string',
  })
  agentProfileId?: string;

  @hasMany(() => StudentApplicationTrackRecord)
  studentApplicationTrackRecords: StudentApplicationTrackRecord[];

  @belongsTo(() => Courses)
  coursesId: string;

  @hasMany(() => Video)
  videos: Video[];

  @hasMany(() => ApplicationNote)
  applicationNotes: ApplicationNote[];

  constructor(data?: Partial<Application>) {
    super(data);
  }
}

export interface ApplicationRelations {
  // describe navigational properties here
}

export type ApplicationWithRelations = Application & ApplicationRelations;
