import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateSubjectDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '功能名称不能为空',
    })
    subjectName: string

    @ApiProperty()
    @IsNotEmpty({
        message: '功能编码不能为空',
    })
    subjectCode: string

    @ApiProperty()
    @IsNotEmpty({
        message: '功能描述不能为空',
    })
    subjectDesc: string

    @IsNumber()
    actionId: number
}
