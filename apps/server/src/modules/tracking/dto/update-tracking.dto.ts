import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { RuleRequiredEnum } from '@/constants/global.constant'
import { CreateTrackingDto } from './create-tracking.dto'

export class UpdateDatasourceDto {
    @ApiProperty({ description: '字段id' })
    @IsOptional()
    id: number

    @ApiProperty({ description: '字段名称' })
    @IsString()
    @IsNotEmpty()
    fieldName: string

    @ApiProperty({ description: '字段xpath' })
    @IsString()
    @IsNotEmpty()
    fieldXpath: string

    @ApiProperty({ description: '字段快照' })
    @IsString()
    @IsNotEmpty()
    fieldSnapshot: string

    @ApiProperty({ description: '验证规则' })
    @IsString()
    @IsOptional()
    reg: string

    @ApiProperty({ description: '是否必传', enum: () => RuleRequiredEnum })
    @IsNumber()
    @IsOptional()
    isRequired: RuleRequiredEnum
}

export class UpdateTrackingDto extends PartialType(CreateTrackingDto) {
    @ApiProperty({ description: '数据源', type: () => UpdateDatasourceDto })
    @IsArray()
    @IsOptional()
    datasource: UpdateDatasourceDto[]
}
