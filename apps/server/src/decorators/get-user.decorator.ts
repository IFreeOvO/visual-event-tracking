import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetUser = createParamDecorator((key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (!request.user) {
        return null
    }
    return key ? request.user[key] : request.user
})
