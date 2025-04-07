import { Injectable } from '@nestjs/common'

import { ISendMailOptions, MailerService as NestMailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
    constructor(private mailerService: NestMailerService) {}

    async sendCaptcha({ to, subject, template, context }: ISendMailOptions) {
        const mailOptions: ISendMailOptions = {
            to,
            subject,
            template,
            context,
        }
        await this.mailerService.sendMail(mailOptions)
    }
}
