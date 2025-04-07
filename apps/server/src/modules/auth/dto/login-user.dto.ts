import { IsNotEmpty } from 'class-validator'

export class LoginUserDto {
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
    password: string
}
