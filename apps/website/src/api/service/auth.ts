import { LoginDTO, RegisterUserDto, SendEmailDto } from '@/models/dto/auth.dto'
import { LoginVO } from '@/models/vo/auth.vo'
import request from '../request'

export function login(data: LoginDTO) {
    return request.post<LoginVO>('/auth/login', data)
}

export function register(data: RegisterUserDto) {
    return request.post('/auth/register', data)
}

export function sendCaptcha(data: SendEmailDto) {
    return request.post('/auth/send-captcha', data)
}
