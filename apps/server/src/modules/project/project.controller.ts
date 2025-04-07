import { Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
    Crud,
    CrudController,
    CrudRequest,
    CrudRequestInterceptor,
    Override,
    ParsedRequest,
} from '@nestjsx/crud'
import { OrderEnum, TableEnum } from '@/constants/global.constant'
import { Public } from '@/decorators/public.decorator'
import { normalizedQueryResult } from '@/shared/normalized-query-result'
import { SuccessResp } from '@/types/response'
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Project } from './entities/project.entity'
import { ProjectService } from './project.service'

const TableName = TableEnum.Project

@ApiTags('项目模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Project,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase'],
    },
    dto: {
        create: CreateProjectDto,
        update: UpdateProjectDto,
    },
    query: {
        sort: [{ field: 'id', order: OrderEnum.ASC }],
    },
})
@Controller(TableName)
export class ProjectController implements CrudController<Project> {
    constructor(public readonly service: ProjectService) {}

    @Post('init')
    @ApiOperation({ summary: '初始化项目' })
    @Public()
    async initActions(): Promise<SuccessResp> {
        await this.service.initProject()
        return undefined
    }

    @Override()
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiOperation({ summary: '查询项目' })
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMany(crudReq)
        const normalizedRes = normalizedQueryResult(res)
        return normalizedRes
    }

    @Override()
    @Delete(':id')
    @ApiOperation({ summary: '删除项目（级联删除关联数据）' })
    async deleteProject(@Param('id') id: number) {
        return await this.service.deleteProject(id)
    }
}
