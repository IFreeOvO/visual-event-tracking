import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserInfo } from '@/modules/auth/vo/login-user.vo'
import { Request } from './../../devtools-frontend/models/har/Log.d'

export const User = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request: Request & {
        user?: UserInfo & {
            [key: string]: any
        }
    } = ctx.switchToHttp().getRequest<Request>()
    if (!request.user) {
        return null
    }
    return key ? request.user[key] : request.user
})
