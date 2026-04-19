import {UserService} from '@loopback/authentication';
import {/* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {CredentialsInput} from '../schema/inputs';
import {HasherService} from './hasher.service';

@injectable({scope: BindingScope.TRANSIENT})
export class MyUserService implements UserService<User, CredentialsInput> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @service(HasherService)
    public hasher: HasherService,
  ) {}

  async verifyCredentials(credentials: CredentialsInput): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: credentials.username,
      },
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized('user not found');
    }

    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('Invalid credentials');

    return foundUser;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id!.toString(),
      id: user.id,
    };
  }
}
