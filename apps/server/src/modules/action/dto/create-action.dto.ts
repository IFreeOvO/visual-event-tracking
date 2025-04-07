import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateActionDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '行为名称不能为空',
    })
    actionName: string

    @ApiProperty()
    @IsNotEmpty({
        message: '行为描述不能为空',
    })
    actionDesc: string
}
