import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

class SendEmailDto {
  to: string | string[];
  subject: string;
  body: string;
  from?: string;
}

class SendTemplatedEmailDto {
  to: string | string[];
  templateName: string;
  templateData: Record<string, any>;
  from?: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    return await this.emailService.sendEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.body,
      sendEmailDto.from,
    );
  }

  @Post('send-templated')
  async sendTemplatedEmail(@Body() sendTemplatedEmailDto: SendTemplatedEmailDto) {
    return await this.emailService.sendTemplatedEmail(
      sendTemplatedEmailDto.to,
      sendTemplatedEmailDto.templateName,
      sendTemplatedEmailDto.templateData,
      sendTemplatedEmailDto.from,
    );
  }
}