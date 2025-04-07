import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { PermissionStatusEnum } from '@/constants/global.constant'

export class CreatePermissionDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '权限编码不能为空',
    })
    permissionCode: string

    @ApiProperty()
    @IsNotEmpty({
        message: '权限类型不能为空',
    })
    permissionType: string

    @ApiProperty()
    @IsNotEmpty({
        message: '权限关联id不能为空',
    })
    permissionRelationId: number

    @ApiProperty({ enum: () => PermissionStatusEnum })
    @IsNotEmpty({
        message: '状态不能为空',
    })
    status: PermissionStatusEnum
}
