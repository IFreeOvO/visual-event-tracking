import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateProjectDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '项目名称不能为空',
    })
    projectName: string

    @ApiProperty()
    @IsOptional()
    projectDesc: string

    @ApiProperty()
    @IsNotEmpty({
        message: '项目地址不能为空',
    })
    projectUrl: string
}
