import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
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
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { Permission } from './entities/permission.entity'
import { PermissionService } from './permission.service'

const TableName = TableEnum.Permission

@ApiTags('权限管理模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Permission,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase'],
        updateOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Update))],
        },
        deleteOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))],
        },
    },
    dto: {
        create: CreatePermissionDto,
        update: UpdatePermissionDto,
    },
    query: {
        exclude: ['id'],
        sort: [{ field: 'id', order: OrderEnum.ASC }],
        join: {
            subject: {
                eager: true,
            },
            menu: {
                eager: true,
            },
        },
    },
})
@Controller(TableName)
export class PermissionController implements CrudController<Permission> {
    constructor(public readonly service: PermissionService) {}

    @Post('init')
    @ApiOperation({ summary: '初始化权限表' })
    @Public()
    async initActions(): Promise<SuccessResp> {
        await this.service.initPermissions()
        return undefined
    }

    @Override()
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiOperation({ summary: '查询权限' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Read))
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMany(crudReq)
        const normalizedRes = normalizedQueryResult(res)
        return normalizedRes
    }

    @Override()
    @Post()
    @ApiOperation({ summary: '创建权限' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Create))
    async create(@Body() createDto: CreatePermissionDto): Promise<SuccessResp> {
        await this.service.create(createDto)
        return undefined
    }

    @Get('/menu')
    @ApiOperation({ summary: '查询菜单权限' })
    async getMenuPermissions() {
        const res = await this.service.getMenuPermissions()
        return res
    }

    @Get('/subject')
    @ApiOperation({ summary: '查询接口权限' })
    async getApiPermissions() {
        const res = await this.service.getApiPermissions()
        return res
    }
}
