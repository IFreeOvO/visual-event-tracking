import { SUCCESS_MESSAGE, FAIL_MESSAGE } from '@/constants/http.constant'

interface SuccessResp<T = any> {
    code: HttpStatus.OK
    message: SUCCESS_MESSAGE
    data?: T
}

interface FailResp<T = any> {
    code: number
    message: FAIL_MESSAGE
    error?: T
}
