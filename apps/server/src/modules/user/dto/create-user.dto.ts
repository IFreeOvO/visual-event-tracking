import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { UserStatusEnum } from '@/constants/global.constant'

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '用户名不能为空',
    })
    @MaxLength(10, {
        message: '用户名最长为 10 个字符',
    })
    username: string

    @ApiProperty()
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

    @ApiProperty()
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

    @ApiProperty({ enum: () => UserStatusEnum })
    @IsNotEmpty({
        message: '状态不能为空',
    })
    status: UserStatusEnum

    @ApiProperty()
    @IsArray()
    roles: number[]
}
