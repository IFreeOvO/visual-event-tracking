import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { map, Observable, catchError, throwError } from 'rxjs'
import { SUCCESS_MESSAGE } from '@/constants/http.constant'
import { SuccessResp } from '@/types/response'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const resp: SuccessResp = {
                    code: HttpStatus.OK,
                    message: SUCCESS_MESSAGE,
                    data,
                }
                return resp
            }),
            catchError((err) => {
                return throwError(() => err)
            }),
        )
    }
}
