import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { PermissionTypeEnum } from '@/constants/global.constant'

export class CreateRolePermissionsDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '角色id不能为空',
    })
    @IsNumber()
    roleId: number

    @ApiProperty()
    @IsNotEmpty({
        message: '菜单id不能为空',
    })
    @IsArray()
    permissionIds: number[]

    @ApiProperty({ enum: () => PermissionTypeEnum })
    @IsNotEmpty({
        message: '权限类型不能为空',
    })
    @IsString()
    type: PermissionTypeEnum
}
