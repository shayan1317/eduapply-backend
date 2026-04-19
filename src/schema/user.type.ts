import {field, ID, objectType} from '@loopback/graphql';
import {model, property} from '@loopback/repository';

import {CompleteAgentProfile, StaffProfile} from './agent.type';
import {Roles, VerificationStatus} from './enums.type';
import {RioProfile} from './rio.type';
import {StudentProfile} from './student.type';
@objectType({description: 'Profile object'})
@model({settings: {strict: false}})
export class AdminProfile {
  @field(type => ID)
  id: string;

  @field()
  @property()
  adminNumber: number;

  @field({
    nullable: false,
  })
  @property()
  firstName: string;

  @field({
    nullable: false,
  })
  @property()
  lastName: string;

  @field({
    nullable: false,
  })
  @property()
  email: string;

  @field({
    nullable: true,
  })
  @property()
  photo?: string;

  @field()
  @property()
  userId: string;

  @field(type => Date)
  @property()
  createdAt: Date;

  @field(type => Date)
  @property()
  updatedAt: Date;
}

@objectType({description: 'User object'})
@model({settings: {strict: false}})
export class User {
  @field(type => ID)
  id: string;

  @field()
  @property()
  username: string;

  @field(type => Date)
  @property()
  createdAt: Date;

  @field(type => Date)
  @property()
  updatedAt: Date;

  @field(type => VerificationStatus)
  @property()
  verificationStatus: VerificationStatus;

  @field(type => Roles)
  @property()
  roleId: Roles;
}

@objectType({description: 'Authenticated user and access token'})
export class AuthenticatedUser {
  @field(type => User)
  user: User;

  @field()
  token: string;

  @field(type => AdminProfile, {
    nullable: true,
  })
  adminProfile?: AdminProfile;

  @field(type => StaffProfile, {
    nullable: true,
  })
  staffProfile?: StaffProfile;

  @field(type => StudentProfile, {
    nullable: true,
  })
  studentProfile?: StudentProfile;

  @field(type => CompleteAgentProfile, {
    nullable: true,
  })
  agentProfile?: CompleteAgentProfile;

  @field(type => RioProfile, {
    nullable: true,
  })
  rioProfile?: RioProfile;
}
@objectType({description: 'update user info '})
export class UpdateInfoOutput {
  @field(type => User)
  user: User;

  @field(type => AdminProfile, {
    nullable: true,
  })
  adminProfile?: AdminProfile;

  @field(type => StaffProfile, {
    nullable: true,
  })
  staffProfile?: StaffProfile;

  @field(type => StudentProfile, {
    nullable: true,
  })
  studentProfile?: StudentProfile;

  @field(type => CompleteAgentProfile, {
    nullable: true,
  })
  agentProfile?: CompleteAgentProfile;

  @field(type => RioProfile, {
    nullable: true,
  })
  rioProfile?: RioProfile;
}

@objectType({description: ' user info output '})
export class UserInfoOutput {
  @field()
  username: string;

  @field()
  firstName: string;
  @field()
  lastName: string;
}
@objectType({description: 'Authenticated user and access token'})
export class SignupAdmin {
  @field({
    nullable: false,
    description: 'true if operation was successful',
  })
  success: boolean;

  @field(type => AdminProfile)
  adminProfile: AdminProfile;

  @field(type => User)
  user: User;

  @field()
  token: string;
}
