import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
    Crud,
    CrudController,
    CrudRequest,
    CrudRequestInterceptor,
    Override,
    ParsedRequest,
} from '@nestjsx/crud'
import { ActionTypeEnum, OrderEnum, TableEnum } from '@/constants/global.constant'
import { CheckPermission } from '@/decorators/check-permission.decorator'
import { Public } from '@/decorators/public.decorator'
import { makeAbility } from '@/shared/make-ability'
import { normalizedQueryResult } from '@/shared/normalized-query-result'
import { SuccessResp } from '@/types/response'
import { ActionService } from './action.service'
import { CreateActionDto } from './dto/create-action.dto'
import { UpdateActionDto } from './dto/update-action.dto'
import { Action } from './entities/action.entity'

const TableName = TableEnum.Action

@ApiTags('行为管理模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Action,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase'],
        createOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Create))],
        },
        updateOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Update))],
        },
    },
    dto: {
        create: CreateActionDto,
        update: UpdateActionDto,
    },
    query: {
        sort: [{ field: 'id', order: OrderEnum.ASC }],
    },
})
@Controller(TableName)
export class ActionController implements CrudController<Action> {
    constructor(public readonly service: ActionService) {}

    @Post('init')
    @ApiOperation({ summary: '初始化行为表' })
    @Public()
    async initActions(): Promise<SuccessResp> {
        await this.service.initActions()
        return undefined
    }

    @Override()
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiOperation({ summary: '查询行为' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Read))
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMany(crudReq)
        const normalizedRes = normalizedQueryResult(res)
        return normalizedRes
    }

    @Override()
    @Delete(':id')
    @ApiOperation({ summary: '删除行为' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))
    async deleteAction(@Param('id', ParseIntPipe) id: number) {
        return await this.service.deleteAction(id)
    }
}
