import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'
import { AuthService } from '@/modules/auth/auth.service'

@Injectable()
export class RegisterCaptchaGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const res = await this.authService.validateRegisterCaptcha(request.body)
        if (!res.success) {
            throw new BadRequestException(res.message)
        }
        return res.success
    }
}
