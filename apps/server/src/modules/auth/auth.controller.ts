import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { minutes, Throttle } from '@nestjs/throttler'
import { ISendMailOptions } from '@nestjs-modules/mailer'
import { ConfigEnum } from '@/constants/config.constant'
import { Public } from '@/decorators/public.decorator'
import { LocalAuthGuard } from '@/guards/local-auth.guard'
import { RegisterCaptchaGuard } from '@/guards/register-captcha.guard'
import { EmailService } from '@/providers/email/email.service'
import { RedisService } from '@/providers/redis/redis.service'
import { getRegisterCaptchaKey } from '@/shared/get-redis-key'
import { SuccessResp } from '@/types/response'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { SendEmailDto } from './vo/send-email.dto'

@ApiTags('授权模块')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: '注册' })
    @UseGuards(RegisterCaptchaGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Public()
    async register(@Body() registerUser: RegisterUserDto): Promise<SuccessResp> {
        await this.authService.register(registerUser)
        return undefined
    }

    @Post('login')
    @ApiOperation({ summary: '登录' })
    @UseGuards(LocalAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Public()
    async login(@Body() loginUser: LoginUserDto) {
        const loginUserVo = await this.authService.login(loginUser)
        return loginUserVo
    }

    @Post('send-captcha')
    @ApiOperation({ summary: '发送注册验证码' })
    @Public()
    @Throttle({ default: { limit: 3, ttl: minutes(5) } })
    async sendCaptcha(@Body() sendEmailDto: SendEmailDto): Promise<SuccessResp> {
        const { to } = sendEmailDto
        const code = Math.random().toString().slice(2, 8)

        const ttl =
            JSON.parse(this.configService.get<string>(ConfigEnum.REGISTER_CAPTCHA_EXPIRATION)) * 60
        await this.redisService.set(`${getRegisterCaptchaKey(to)}`, code, ttl)

        const mailOptions: ISendMailOptions = {
            to,
            subject: '验证邮件',
            template: './register-captcha',
            context: {
                code,
                projectName: this.configService.get<string>(ConfigEnum.PROJECT_NAME),
                expiration: this.configService.get<string>(ConfigEnum.REGISTER_CAPTCHA_EXPIRATION),
            },
        }

        await this.emailService.sendCaptcha(mailOptions)
        return undefined
    }
}
