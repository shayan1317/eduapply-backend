import {registerEnumType} from '@loopback/graphql';

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export enum UserStatus {
  CODE_SENT = 'PENDING',
  VERIFIED = 'VERIFIED',
}

export enum TutionFeeVerification {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}
export enum VerificationStatus {
  CODE_SENT = 'CODE_SENT',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  RESET_PASSWORD_CODE_SENT = 'RESET_PASSWORD_CODE_SENT',
  NOT_ASSIGNED = 'NOT_ASSIGNED',
  PASSWORD_SENT_IN_EMAIL = 'PASSWORD_SENT_IN_EMAIL',
}

export enum Roles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  RIO = 'RIO', //Research and Innovation Officer
  AGENT = 'AGENT',
  STUDENT = 'STUDENT',
  NOT_ASSIGNED = 'NOT_ASSIGNED',
  UNI_FOCAL_PERSON = 'UNI_FOCAL_PERSON',
  STAFF = 'STAFF',
}

export enum Status {
  NEW_LEAD = 'NEW_LEAD',
  FOLLOW_UP = 'FOLLOW_UP',
  READY_TO_APPLY = 'READY_TO_APPLY',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FORWARDED = 'FORWARDED',
}
export enum EventNames {
  // StudentApplicationSubmitted = 'Student_Application_Submitted',
  // RIOEvaluation = 'RIO_Evaluation',
  // ApplicationForwardedToUniversity = 'Application_forwarded_to_University',
  // OfferLetter = 'Offer_letter',
  // AdmissionFeeVerification = 'Admission_Fee_Verification',
  // VisaSupportLetter = 'Visa_Support_Letter',
  // RefundFormUpload = 'Refund_Form_Upload',
  STUDENT_APPLICATION_SUBMITTED = 'STUDENT_APPLICATION_SUBMITTED',
  RIO_EVALUATION = 'RIO_EVALUATION',
  APPLICATION_FORWARDED_TO_UNIVERSITY = 'APPLICATION_FORWARDED_TO_UNIVERSITY',
  OFFER_LETTER = 'OFFER_LETTER',
  ADMISSION_FEE_VERIFICATION = 'ADMISSION_FEE_VERIFICATION',
  VISA_SUPPORT_LETTER = 'VISA_SUPPORT_LETTER',
  REFUND_FORM_UPLOAD = 'REFUND_FORM_UPLOAD',
}

export enum DOC_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRED = 'REQUIRED',
}

export enum Intake {
  JAN = 'JAN',
  FEB = 'FEB',
  MAR = 'MAR',
  APR = 'APR',
  MAY = 'MAY',
  JUN = 'JUN',
  JUL = 'JUL',
  AUG = 'AUG',
  SEP = 'SEP',
  OCT = 'OCT',
  NOV = 'NOV',
  DEC = 'DEC',
}

export enum CURRENCY_ENUM {
  USD = 'usd',
  AED = 'aed',
  EUR = 'eur',
  GBP = 'gbp',
}

export enum APPLICATION_FEE_STATUS_ENUM {
  PENDING = 'pending',
  PAID = 'paid',
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(TutionFeeVerification, {
  name: 'TutionFeeVerification',
});

registerEnumType(EventNames, {
  name: 'EventNames',
});
registerEnumType(VerificationStatus, {
  name: 'VerificationStatus',
});

registerEnumType(Roles, {
  name: 'ROLES',
});

registerEnumType(Status, {
  name: 'Status',
});

registerEnumType(ApplicationStatus, {
  name: 'ApplicationStatus',
});

registerEnumType(Intake, {
  name: 'Intake',
});

registerEnumType(CURRENCY_ENUM, {
  name: 'CURRENCY_ENUM',
});

registerEnumType(APPLICATION_FEE_STATUS_ENUM, {
  name: 'APPLICATION_FEE_STATUS_ENUM',
});

registerEnumType(DOC_STATUS, {
  name: 'DOC_STATUS',
});
