import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Secrets} from '../types';
const AWS = require('aws-sdk');

const bucket = process.env.S3_BUCKET;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const AWS_REGION = process.env.AWS_REGION ?? 'us-east-1';

@injectable({scope: BindingScope.SINGLETON})
export class AwsService {
  // client: any;
  s3;
  constructor(/* Add @inject to inject parameters */) {
    this.s3 = new AWS.S3();
  }

  async uploadToS3(filename: string, file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {Bucket: bucket, Key: filename, Body: file};
      this.s3.upload(params, function (err: any, data: any) {
        if (err) {
          reject(err);
        }
        if (CLOUDFRONT_DOMAIN) {
          resolve(CLOUDFRONT_DOMAIN + filename);
        }
        if (data?.Location) resolve(data.Location);
        reject(new HttpErrors.ExpectationFailed('Upload service failed'));
      });
    });
  }

  async getSecrets(secretName: string): Promise<Secrets> {
    return new Promise((resolve, reject) => {
      const client = new AWS.SecretsManager({
        region: AWS_REGION,
      });

      client.getSecretValue(
        {SecretId: secretName},
        function (err: any, data: any) {
          if (err) {
            reject(err);
          } else {
            if ('SecretString' in data) {
              resolve(JSON.parse(data.SecretString));
            }
            reject('Secret Not found');
          }
        },
      );
    });
  }
}
