import { ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_METADATA } from '@/constants/global.constant'

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(@Inject(Reflector) private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_METADATA, [
            context.getClass(),
            context.getHandler(),
        ])
        if (isPublic) {
            return true
        }
        return super.canActivate(context)
    }

    handleRequest(err: Error, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException('用户未授权，请重新登录')
        }
        return user
    }
}
