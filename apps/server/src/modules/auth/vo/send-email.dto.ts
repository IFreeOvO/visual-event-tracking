import { IsEmail, IsNotEmpty } from 'class-validator'

export class SendEmailDto {
    /**
     * 收件人邮箱地址
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
    to: string
}
