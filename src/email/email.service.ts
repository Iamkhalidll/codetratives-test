import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  private ses: AWS.SES;
  private readonly defaultFromEmail: string;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.ses = new AWS.SES({ apiVersion: '2010-12-01' });
    this.defaultFromEmail = process.env.DEFAULT_FROM_EMAIL;
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    body: string,
    from: string = this.defaultFromEmail,
  ): Promise<AWS.SES.SendEmailResponse> {
    const params: AWS.SES.SendEmailRequest = {
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: body,
            Charset: 'UTF-8',
          },
        },
      },
    };

    try {
      return await this.ses.sendEmail(params).promise();
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendTemplatedEmail(
    to: string | string[],
    templateName: string,
    templateData: Record<string, any>,
    from: string = this.defaultFromEmail,
  ): Promise<AWS.SES.SendTemplatedEmailResponse> {
    const params: AWS.SES.SendTemplatedEmailRequest = {
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
    };

    try {
      return await this.ses.sendTemplatedEmail(params).promise();
    } catch (error) {
      throw new Error(`Failed to send templated email: ${error.message}`);
    }
  }
}