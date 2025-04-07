import type { CrudController, CrudRequest } from '@nestjsx/crud'
import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudRequestInterceptor, Override, ParsedRequest } from '@nestjsx/crud'
import { ActionTypeEnum, OrderEnum, TableEnum } from '@/constants/global.constant'
import { CheckPermission } from '@/decorators/check-permission.decorator'
import { Public } from '@/decorators/public.decorator'
import { makeAbility } from '@/shared/make-ability'
import { SuccessResp } from '@/types/response'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { Menu } from './entities/menu.entity'
import { MenuService } from './menu.service'

const TableName = TableEnum.Menu

@ApiTags('菜单管理模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Menu,
    },
    routes: {
        only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
        createOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Create))],
        },
        updateOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Update))],
        },
    },
    dto: {
        create: CreateMenuDto,
        update: UpdateMenuDto,
    },
    query: {
        exclude: ['id'],
        sort: [{ field: 'id', order: OrderEnum.ASC }],
    },
})
@Controller(TableName)
export class MenuController implements CrudController<Menu> {
    constructor(public readonly service: MenuService) {}

    @Post('init')
    @ApiOperation({ summary: '初始化菜单表' })
    @Public()
    async initActions(): Promise<SuccessResp> {
        await this.service.initMenus()
        return undefined
    }

    @Override()
    @Get()
    @ApiOperation({ summary: '查询菜单' })
    @UseInterceptors(CrudRequestInterceptor)
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Read))
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMenuWithChildren(crudReq)
        return res
    }

    @Override()
    @Delete(':id')
    @ApiOperation({ summary: '删除菜单' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))
    async deleteMenu(@Param('id', ParseIntPipe) id: number) {
        return await this.service.deleteMenu(id)
    }
}
