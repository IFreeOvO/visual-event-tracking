import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { EventTypeEnum, RuleRequiredEnum, SiblingEffectiveEnum } from '@/constants/global.constant'

export class DatasourceDto {
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

export class CreateTrackingDto {
    @ApiProperty({ description: '事件名称' })
    @IsString()
    @IsNotEmpty()
    eventName: string

    @ApiProperty({ description: '埋点页面地址' })
    @IsString()
    @IsNotEmpty()
    url: string

    @ApiProperty({ description: '埋点元素的xpath' })
    @IsString()
    @IsNotEmpty()
    xpath: string

    @ApiProperty({ description: '验证xpath是否正确命中的标记' })
    @IsString()
    @IsNotEmpty()
    validationMarker: string

    @ApiProperty({ description: '埋点事件类型', enum: () => EventTypeEnum })
    @IsArray()
    eventType: EventTypeEnum[]

    @ApiProperty({ description: '同级元素是否生效', enum: () => SiblingEffectiveEnum })
    @IsNumber()
    isSiblingEffective: SiblingEffectiveEnum

    @ApiProperty({ description: '埋点元素快照' })
    @IsString()
    @IsNotEmpty()
    snapshot: string

    @ApiProperty({ description: '数据源', type: () => DatasourceDto })
    @IsArray()
    @IsOptional()
    datasource: DatasourceDto[]

    @ApiProperty({ description: '项目ID' })
    @IsNumber()
    @IsNotEmpty()
    projectId: number
}
