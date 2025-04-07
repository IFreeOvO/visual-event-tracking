import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
    Crud,
    CrudController,
    CrudRequest,
    CrudRequestInterceptor,
    Override,
    ParsedRequest,
} from '@nestjsx/crud'
import {
    ActionTypeEnum,
    OrderEnum,
    PermissionTypeEnum,
    TableEnum,
} from '@/constants/global.constant'
import { CheckPermission } from '@/decorators/check-permission.decorator'
import { Public } from '@/decorators/public.decorator'
import { makeAbility } from '@/shared/make-ability'
import { normalizedQueryResult } from '@/shared/normalized-query-result'
import { SuccessResp } from '@/types/response'
import { CreateRolePermissionsDto } from './dto/create-role-permissions.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'
import { RoleService } from './role.service'

const TableName = TableEnum.Role

@ApiTags('角色管理模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Role,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase'],
        createOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Create))],
        },
        updateOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Update))],
        },
        deleteOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))],
        },
    },
    dto: {
        create: CreateRoleDto,
        update: UpdateRoleDto,
    },
    query: {
        exclude: ['createTime', 'updateTime'],
        sort: [{ field: 'id', order: OrderEnum.ASC }],
    },
})
@Controller(TableName)
export class RoleController implements CrudController<Role> {
    constructor(public readonly service: RoleService) {}

    @Post('permission')
    @ApiOperation({ summary: '保存角色权限' })
    async saveRoleMenus(
        @Body() createRolePermissionsDto: CreateRolePermissionsDto,
    ): Promise<SuccessResp> {
        await this.service.saveRolePermissions(createRolePermissionsDto)
        return undefined
    }

    @Get(':id/permission/menu')
    @ApiOperation({ summary: '查询角色关联的菜单' })
    async getRoleMenus(@Param('id', ParseIntPipe) id: number) {
        const res = this.service.getRolePermissions(id, PermissionTypeEnum.Menu)
        return res
    }

    @Get(':id/permission/subject')
    @ApiOperation({ summary: '查询角色关联的接口权限' })
    async getRoleSubjects(@Param('id', ParseIntPipe) id: number) {
        const res = this.service.getRolePermissions(id, PermissionTypeEnum.Api)
        return res
    }

    @Override()
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiOperation({ summary: '查询角色' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Read))
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMany(crudReq)
        const normalizedRes = normalizedQueryResult(res)
        return normalizedRes
    }

    @Post('init')
    @ApiOperation({ summary: '初始化角色表' })
    @Public()
    async initActions(): Promise<SuccessResp> {
        await this.service.initRole()
        return undefined
    }
}
