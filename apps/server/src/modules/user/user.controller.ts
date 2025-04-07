import { Body, Controller, Param, Post, Patch, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Crud, CrudController, Override } from '@nestjsx/crud'
import { ActionTypeEnum, OrderEnum, TableEnum } from '@/constants/global.constant'
import { CheckPermission } from '@/decorators/check-permission.decorator'
import { GetUser } from '@/decorators/get-user.decorator'
import { Public } from '@/decorators/public.decorator'
import { makeAbility } from '@/shared/make-ability'
import { SuccessResp } from '@/types/response'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserService } from './user.service'

const TableName = TableEnum.User

@ApiTags('用户管理模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: User,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase'],
        deleteOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))],
        },
        getManyBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Read))],
        },
    },
    dto: {
        create: CreateUserDto,
        update: UpdateUserDto,
    },
    query: {
        exclude: ['id'], // 不加这个会报错error: column reference "User_id" is ambiguous。见https://github.com/nestjsx/crud/issues/777
        sort: [{ field: 'id', order: OrderEnum.ASC }],
        join: {
            roles: {
                eager: true,
            },
        },
    },
})
@Controller(TableName)
export class UserController implements CrudController<User> {
    constructor(public readonly service: UserService) {}

    @Post('init')
    @ApiOperation({ summary: '初始化用户表' })
    @Public()
    async initUsers(): Promise<SuccessResp> {
        await this.service.initUsers()
        return undefined
    }

    @Override()
    @Post()
    @ApiOperation({ summary: '创建用户' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Create))
    async create(@Body() createdUser: CreateUserDto): Promise<SuccessResp> {
        const res = await this.service.create(createdUser)
        await this.service.saveUserRoles({
            userId: res.id,
            roleIds: createdUser.roles,
        })
        return undefined
    }

    @Override()
    @Patch(':id')
    @ApiOperation({ summary: '修改用户信息' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Update))
    async update(
        @Param('id') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<SuccessResp> {
        await this.service.updateUser(userId, updateUserDto)
        return undefined
    }

    @Get('menu')
    @ApiOperation({ summary: '获取用户菜单' })
    async getUserMenu(@GetUser('id') userId: number) {
        const res = await this.service.getUserMenu(userId)
        return res
    }
}
