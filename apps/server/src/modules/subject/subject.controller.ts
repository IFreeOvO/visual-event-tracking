import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseInterceptors,
} from '@nestjs/common'
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
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'
import { Subject } from './entities/subject.entity'
import { SubjectService } from './subject.service'

const TableName = TableEnum.Subject

@ApiTags('功能管理模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Subject,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase'],
        updateOneBase: {
            decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Update))],
        },
        // deleteOneBase: {
        //     decorators: [CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))],
        // },
    },
    dto: {
        create: CreateSubjectDto,
        update: UpdateSubjectDto,
    },
    query: {
        exclude: ['id'],
        sort: [{ field: 'id', order: OrderEnum.ASC }],
        join: {
            action: {
                eager: true,
            },
        },
    },
})
@Controller(TableName)
export class SubjectController implements CrudController<Subject> {
    constructor(public readonly service: SubjectService) {}

    @Override()
    @Post()
    @ApiOperation({ summary: '创建功能' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Create))
    async create(@Body() createdSubject: CreateSubjectDto): Promise<SuccessResp> {
        const res = await this.service.create(createdSubject)
        await this.service.saveSubjectActions({
            subjectId: res.id,
            actionId: createdSubject.actionId,
        })
        return undefined
    }

    @Override()
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiOperation({ summary: '查询功能' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Read))
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMany(crudReq)
        const normalizedRes = normalizedQueryResult(res)
        return normalizedRes
    }

    @Get('names')
    @ApiOperation({ summary: '获取所有功能名称' })
    async getSubjectNames() {
        const res = this.service.getSubjectNames()
        return res
    }

    @Post('init')
    @ApiOperation({ summary: '初始化功能表' })
    @Public()
    async initSubjects(): Promise<SuccessResp> {
        await this.service.initSubjects()
        return undefined
    }

    @Override()
    @Delete(':id')
    @ApiOperation({ summary: '删除功能' })
    @CheckPermission(makeAbility(TableName, ActionTypeEnum.Delete))
    async deleteSubject(@Param('id', ParseIntPipe) id: number) {
        return await this.service.deleteSubject(id)
    }
}
