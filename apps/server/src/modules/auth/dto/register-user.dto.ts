import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class RegisterUserDto {
    /**
     * 用户名
     */
    @IsNotEmpty({
        message: '用户名不能为空',
    })
    username: string

    /**
     * 密码
     */
    @IsNotEmpty({
        message: '密码不能为空',
    })
    @MaxLength(50, {
        message: '密码最长为 50 个字符',
    })
    @MinLength(6, {
        message: '密码不能少于 6 位',
    })
    password: string

    /**
     * 邮箱
     */
    @IsNotEmpty({
        message: '邮箱不能为空',
    })
    @IsEmail(
        {},
        {
            message: '不是合法的邮箱格式',
        },
    )
    email: string

    /**
     * 验证码
     */
    @IsNotEmpty({
        message: '验证码不能为空',
    })
    captcha: string
}
