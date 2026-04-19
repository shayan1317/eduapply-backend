import {BindingScope, inject, injectable, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {
  ApplicationFeeInvoiceEmailTemplate,
  ResetPassword,
  SetupPasswordEmailTemplate,
  SignUpCodeEmailTemplate,
  SignUpPasswordEmailTemplate,
} from '../templates';
import {AwsService} from './aws.service';
const nodemailer = require('nodemailer');

const AWS_SECRETS_NAME = process.env.AWS_SECRETS_NAME ?? 'dev';
const SMTP_FROM = process.env.SMTP_FROM ?? 'noreply@doerz.dev';
const PROJECT_NAME = process.env.PROJECT_NAME ?? 'EduApply';

@injectable({scope: BindingScope.SINGLETON})
export class SmtpMailService {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  private transporter: any;

  constructor(
    @service(AwsService)
    private awsService: AwsService,
  ) {
    this.initializeSmtpTransporter();
  }

  async initializeSmtpTransporter() {
    try {
      const secrets = await this.awsService.getSecrets(AWS_SECRETS_NAME);
      this.transporter = nodemailer.createTransport({
        host: secrets.SMTP_HOST,
        port: secrets.SMTP_PORT,
        auth: {
          user: secrets.SMTP_USERNAME,
          pass: secrets.SMTP_PASSWORD,
        },
      });
    } catch (error) {
      this.logger.error('initializeSmtpTransporterError', error);
    }
  }

  async sendPlain(to: string, subject: string, message: string) {
    const result = await this.transporter.sendMail({
      from: {
        name: PROJECT_NAME,
        address: SMTP_FROM,
      },
      to: [to],
      subject: subject,
      text: message,
    });
  }

  async sendHTML(to: string, subject: string, html: string) {
    const response = await this.transporter.sendMail({
      from: {
        name: PROJECT_NAME,
        address: SMTP_FROM,
      },
      name: PROJECT_NAME,
      to: to,
      subject: subject,
      html: html,
    });
    return response;
  }

  async sendPasswordResetEmail(to: string, code: string, userName: string) {
    try {
      const subject = 'EduApply Password Reset';
      const html = ResetPassword(code, userName);
      await this.sendHTML(to, subject, html);
    } catch (error) {
      this.logger.error('initializeSmtpTransporterError', error);
    }
  }

  async sendEmailVerificationCode(to: string, code: string) {
    try {
      const subject = 'EduApply Email Verification';
      const html = SignUpCodeEmailTemplate(code);
      await this.sendHTML(to, subject, html);
    } catch (error) {
      this.logger.error('initializeSmtpTransporterError', error);
    }
  }

  async sendPasswordAndEmail({
    to,
    password,
    name,
  }: {
    to: string;
    password: string;
    name: string;
  }) {
    try {
      const subject = 'EduApply Password Reset';
      const html = SignUpPasswordEmailTemplate({email: to, password, name});
      await this.sendHTML(to, subject, html);
    } catch (error) {
      this.logger.error('initializeSmtpTransporterError', error);
    }
  }

  async sendSetupPasswordLink({
    to,
    link,
    name,
  }: {
    to: string;
    link: string;
    name: string;
  }) {
    try {
      const subject = 'EduApply Invite';
      const html = SetupPasswordEmailTemplate({email: to, link, name});
      await this.sendHTML(to, subject, html);
    } catch (error) {
      this.logger.error('initializeSmtpTransporterError', error);
    }
  }

  async sendApplicationFeePaymentInvoice(
    to: string,
    name: string,
    applicationFee: number,
    currency: string,
    applicationId: string,
    courseName: string,
    universityName: string,
    link: string,
  ) {
    try {
      const subject = 'EduApply Application Fee Invoice';
      const html = ApplicationFeeInvoiceEmailTemplate(
        name,
        applicationFee,
        currency,
        applicationId,
        courseName,
        universityName,
        link,
      );

      await this.sendHTML(to, subject, html);
    } catch (error) {
      this.logger.error('initializeSmtpTransporterError', error);
    }
  }
}
