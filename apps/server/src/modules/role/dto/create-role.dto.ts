import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength } from 'class-validator'
import { RoleStatusEnum } from '@/constants/global.constant'

export class CreateRoleDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '角色名不能为空',
    })
    @MaxLength(20, {
        message: '角色名最长为 20 个字符',
    })
    roleName: string

    @ApiProperty()
    @IsNotEmpty({
        message: '角色描述不能为空',
    })
    @MaxLength(200, {
        message: '角色描述最长为 200 个字符',
    })
    roleDesc: string

    @ApiProperty()
    @IsNotEmpty({
        message: '角色编码不能为空',
    })
    @MaxLength(50, {
        message: '角色编码最长为 50 个字符',
    })
    roleCode: string

    @ApiProperty({ enum: () => RoleStatusEnum })
    @IsNotEmpty({
        message: '状态不能为空',
    })
    status: RoleStatusEnum
}
