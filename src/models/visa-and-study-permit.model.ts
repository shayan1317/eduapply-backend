import {Entity, model, property} from '@loopback/repository';

@model()
export class VisaAndStudyPermit extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    defaultFn: 'uuid',
  })
  id: string;

  @property({
    type: 'boolean',
    default: false,
  })
  everRefusedEuVisa?: boolean;

  @property({
    default: false,
    type: 'boolean',
  })
  spainVisa?: boolean;

  @property({
    default: false,
    type: 'boolean',
  })
  schengenF1Visa?: boolean;

  @property({
    default: false,
    type: 'boolean',
  })
  ukStudyVisa?: boolean;

  @property({
    default: false,
    type: 'boolean',
  })
  switzerlandTier4Visa?: boolean;

  @property({
    default: false,
    type: 'boolean',
  })
  irelandStamp2?: boolean;

  @property({
    default: false,
    type: 'boolean',
  })
  isHavingVisa?: boolean;

  @property({
    type: 'string',
  })
  visaDetails?: string;

  @property({
    default: false,
    type: 'boolean',
  })
  fakePrevStatmentOrDocs?: boolean;

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
    type: 'string',
  })
  studentProfileId?: string;

  constructor(data?: Partial<VisaAndStudyPermit>) {
    super(data);
  }
}

export interface VisaAndStudyPermitRelations {
  // describe navigational properties here
}

export type VisaAndStudyPermitWithRelations = VisaAndStudyPermit &
  VisaAndStudyPermitRelations;
