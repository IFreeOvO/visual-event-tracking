import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { RedisService } from '@/providers/redis/redis.service'
import { getRegisterCaptchaKey } from '@/shared/get-redis-key'
import { UserService } from '../user/user.service'
import { JwtPayload } from './auth.interface'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserVo } from './vo/login-user.vo'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private readonly redisService: RedisService,
    ) {}

    async register(registerUser: RegisterUserDto) {
        const res = await this.userService.create(registerUser)
        return res
    }

    async login(loginUser: LoginUserDto) {
        const user = await this.userService.findUser(loginUser.username)

        const loginUserVo = new LoginUserVo()
        const roleCodes = user.roles.map((role) => role.roleCode)
        loginUserVo.user = {
            id: user.id,
            username: user.username,
        }
        const payload: JwtPayload = {
            id: user.id,
            username: user.username,
            roleCodes,
            status: user.status,
            email: user.email,
        }
        loginUserVo.accessToken = this.jwtService.sign(payload)

        return loginUserVo
    }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findUser(username)

        if (!user) {
            return null
        }

        const isPasswordValid = await argon2.verify(user.password, password)
        if (isPasswordValid) {
            return user
        }
        return null
    }

    async validateRegisterCaptcha(registerUser: RegisterUserDto) {
        const { email, captcha: userCaptcha } = registerUser

        if (!userCaptcha) {
            return {
                success: false,
                message: '验证码不能为空',
            }
        }

        const captcha = await this.redisService.get(`${getRegisterCaptchaKey(email)}`)

        if (!captcha) {
            return {
                success: false,
                message: '验证码无效，请重新发送',
            }
        }

        if (captcha !== userCaptcha) {
            return {
                success: false,
                message: '验证码不正确，请重新发送',
            }
        }
        return {
            success: true,
            message: '验证成功',
        }
    }
}
