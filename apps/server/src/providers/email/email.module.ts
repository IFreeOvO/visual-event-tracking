import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { ConfigEnum } from '@/constants/config.constant'
import { EmailService } from './email.service'

@Module({
    imports: [
        NestMailerModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get(ConfigEnum.SMTP_HOST),
                    port: configService.get(ConfigEnum.SMTP_PORT),
                    secure: false,
                    auth: {
                        user: configService.get(ConfigEnum.SMTP_USER),
                        pass: configService.get(ConfigEnum.SMTP_PASS),
                    },
                },
                defaults: {
                    from: {
                        name: configService.get(ConfigEnum.PROJECT_NAME),
                        address: configService.get(ConfigEnum.SMTP_USER),
                    },
                },
                template: {
                    dir: join(__dirname, '..', '..', '/assets/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
