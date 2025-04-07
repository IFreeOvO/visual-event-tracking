import { HttpStatus, Inject, Logger } from '@nestjs/common'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import * as requestIp from 'request-ip'
import { FAIL_MESSAGE } from '@/constants/http.constant'
import { FailResp } from '@/types/response'

// 自定义错误请求的返回值
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const errorInfo = {
            code: httpStatus,
            path: request.url,
            methods: request.method,
            body: request.body,
            query: request.query,
            ip: requestIp.getClientIp(request),
            name: exception?.name,
            error: exception?.message,
        }

        this.logger.error(JSON.stringify(errorInfo))

        let errorMessage = ''
        // 统一拦截违反唯一性约束的错误
        if (exception.message.includes('duplicate key value violates unique constraint')) {
            const matches = exception.detail.replaceAll('"', '').match(/Key \((.*?)\)/) // User表的报错信息里的key没有引号。所以统一都不带引号进行匹配
            if (matches && matches[1]) {
                const fieldName = matches[1]
                errorMessage = `${fieldName}字段值不能重复`
            } else {
                errorMessage = '违反唯一性约束'
            }
        }

        const responseBody: FailResp = {
            code: httpStatus,
            message: FAIL_MESSAGE,
            error: exception?.response?.message ?? errorMessage,
        }

        httpAdapter.reply(response, responseBody, httpStatus)
    }
}
