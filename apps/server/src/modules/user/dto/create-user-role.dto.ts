import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber } from 'class-validator'

export class CreateUserRoleDto {
    @ApiProperty()
    @IsNumber()
    userId: number

    @ApiProperty()
    @IsArray()
    roleIds: number[]
}
