import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class CreateSubjectActionsDto {
    @ApiProperty()
    @IsNumber()
    subjectId: number

    @ApiProperty()
    @IsNumber()
    actionId: number
}
