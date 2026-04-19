import {field, inputType} from '@loopback/graphql';
import {property} from '@loopback/repository';

@inputType()
export class CredentialsInput {
  @field()
  username: string;

  @field()
  password: string;
}

@inputType()
export class CreateAdminUserInput {
  @field()
  @property()
  firstName: string;

  @field()
  @property()
  lastName: string;

  @field()
  @property()
  username: string;

  @field()
  @property()
  password: string;

  @field()
  @property()
  superAdminSecret: string;
}

@inputType({description: 'Reset Password Input'})
export class ResetPasswordInput {
  @field({
    nullable: false,
  })
  username: string;

  @field({
    nullable: false,
  })
  newPassword: string;

  @field({
    nullable: false,
  })
  verificationId: string;
}

@inputType({description: 'updateUser Input'})
export class UpdateUserInput {
  @field({
    nullable: true,
  })
  firstName?: string;

  @field({
    nullable: true,
  })
  lastName?: string;

  @field({
    nullable: true,
  })
  username?: string;

  @field({
    nullable: true,
  })
  photo?: string;
}
