import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'
import { LayoutEnum, VisibleStatusEnum } from '@/constants/global.constant'

export class CreateMenuDto {
    @ApiProperty()
    @IsNotEmpty({
        message: '菜单名称不能为空',
    })
    @MaxLength(20, {
        message: '菜单名称最长为 20 个字符',
    })
    name: string

    @ApiProperty()
    @IsNotEmpty({
        message: '父级菜单id不能为空',
    })
    parentId: number

    @ApiProperty()
    @IsOptional()
    @MaxLength(100, {
        message: '组件名称最长为 100 个字符',
    })
    componentName: string

    @ApiProperty()
    @IsOptional()
    @MaxLength(100, {
        message: '路径最长为 100 个字符',
    })
    path: string

    @ApiProperty()
    @IsOptional()
    @MaxLength(100, {
        message: '图标最长为 100 个字符',
    })
    icon: string

    @ApiProperty({ enum: () => LayoutEnum })
    @IsOptional()
    layout: LayoutEnum

    @ApiProperty()
    @IsNotEmpty({
        message: '排序不能为空',
    })
    order: number

    @ApiProperty({ enum: () => VisibleStatusEnum })
    @IsOptional()
    visibleStatus: VisibleStatusEnum
}
