export interface LoginDTO {
    username: string
    password: string
}

export interface RegisterUserDto {
    username: string
    password: string
    email: string
    captcha: string
}

export interface SendEmailDto {
    to: string
}
