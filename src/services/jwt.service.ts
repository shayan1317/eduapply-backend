import {BindingScope, inject, injectable} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {JwtTokenStatusRepository, UserRepository} from '../repositories';
import {JwtTokenForOtp} from '../schema';
const jwt = require('jsonwebtoken');

//move to env
const TOKEN_SECRET_VALUE = process.env.TOKEN_SECRET_VALUE;
const TOKEN_SECRET_VALUE_SETUP_PASSWORD = process.env.TOKEN_SECRET_VALUE_SETUP_PASSWORD;
const TOKEN_EXPIRES_IN_VALUE = Number(process.env.TOKEN_EXPIRES_IN_VALUE) || 604800; // 1 week
@injectable({scope: BindingScope.TRANSIENT})
export class JwtService {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    public userRepo: UserRepository,

    @repository(JwtTokenStatusRepository)
    public jwtTokenStatusRepo: JwtTokenStatusRepository,
  ) {}

  async generateToken(user: UserProfile): Promise<string> {
    const token = jwt.sign(
      {
        exp: Date.now() + TOKEN_EXPIRES_IN_VALUE,
        data: {
          id: user.id,
          email: user.email,
          roles: user.roleId,
        },
      },
      TOKEN_SECRET_VALUE,
    );
    return token;
  }
  async generateTokenForOTP({
    userId,
    verificationID,
  }: JwtTokenForOtp): Promise<string> {
    const token = jwt.sign(
      {
        exp: Date.now() + TOKEN_EXPIRES_IN_VALUE,
        data: {
          id: userId,
          verificationID: verificationID,
        },
      },
      TOKEN_SECRET_VALUE,
    );
    return token;
  }

  async verifyAgentToken(token: string): Promise<JwtTokenForOtp> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`,
      );
    }
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        TOKEN_SECRET_VALUE,
        async function (err: any, decoded: any) {
          if (err != null) {
            return reject(new HttpErrors.Unauthorized(err.message));
          }

          if (decoded == null) {
            return reject(
              new HttpErrors.Unauthorized(
                'Authorization header is not type of Bearer',
              ),
            );
          }

          if (decoded.exp <= Date.now() / 1000) {
            return reject(new HttpErrors.Unauthorized('Token expired'));
          }

          const agentProfile: JwtTokenForOtp = Object.assign(
            {userId: '', verificationID: ''},
            {
              userId: decoded.data.id,
              verificationID: decoded.data.verificationID,
            },
          );

          return resolve(agentProfile);
        },
      );
    });
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`,
      );
    }
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        TOKEN_SECRET_VALUE,
        async function (err: any, decoded: any) {
          if (err != null) {
            return reject(new HttpErrors.Unauthorized(err.message));
          }

          if (decoded == null) {
            return reject(
              new HttpErrors.Unauthorized(
                'Authorization header is not type of Bearer',
              ),
            );
          }

          if (decoded.exp <= Date.now() / 1000) {
            return reject(new HttpErrors.Unauthorized('Token expired'));
          }

          const userProfile: UserProfile = Object.assign(
            {[securityId]: '', id: '', name: ''},
            {
              [securityId]: decoded.data.id,
              id: decoded.data.id,
              name: decoded.data.name,
            },
          );

          return resolve(userProfile);
        },
      );
    });
  }

  async generateSetupPasswordToken({
    userId,
    email,
  }: {
    userId: string;
    email: string;
  }): Promise<string> {
    //create tokenId
    const createTokenRecord = await this.jwtTokenStatusRepo.create({
      status: true,
      assignedToUserId: userId,
    });
    const token = jwt.sign(
      {
        // exp: Date.now() + TOKEN_EXPIRES_IN_VALUE,
        data: {
          userId,
          email,

          tokenId: createTokenRecord.id,
        },
      },
      TOKEN_SECRET_VALUE_SETUP_PASSWORD,
    );
    return token;
  }

  async verifySetupPasswordToken(
    token: string,
  ): Promise<{userId: string; email: string}> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`,
      );
    }
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        TOKEN_SECRET_VALUE_SETUP_PASSWORD,
        async (err: any, decoded: any) => {
          if (err != null) {
            return reject(new HttpErrors.Unauthorized(err.message));
          }

          if (decoded == null) {
            return reject(new HttpErrors.Unauthorized('Token is not valid'));
          }

          // if (decoded.exp <= Date.now() / 1000) {
          //   return reject(new HttpErrors.Unauthorized('Token expired'));
          // }
          //check token status
          const checkTokenStatus = await this.jwtTokenStatusRepo.findById(
            decoded.data.tokenId,
          );
          if (!checkTokenStatus.status) {
            return reject(
              new HttpErrors.Unauthorized(
                'Token is already used, please try reset your password',
              ),
            );
          }

          //update token status //we can also delete token if we want
          await this.jwtTokenStatusRepo.updateById(decoded.data.tokenId, {
            status: false,
            updatedAt: new Date().toString(),
          });

          return resolve({
            userId: decoded.data.userId,
            email: decoded.data.email,
          });
        },
      );
    });
  }
}
