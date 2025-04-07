import type { Response } from 'express'
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Res,
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
import { OrderEnum, TableEnum } from '@/constants/global.constant'
import { Public } from '@/decorators/public.decorator'
import { normalizedQueryResult } from '@/shared/normalized-query-result'
import { SuccessResp } from '@/types/response'
import { CreateTrackingDto } from './dto/create-tracking.dto'
import { GetLogListDto } from './dto/get-log-list.dto'
import { ReportTrackingDto } from './dto/report-tracking.dto'
import { UpdateTrackingDto } from './dto/update-tracking.dto'
import { Tracking } from './entities/tracking.entity'
import { TrackingService } from './tracking.service'

const tableName = TableEnum.Tracking

@ApiTags('埋点模块')
@ApiBearerAuth()
@Crud({
    model: {
        type: Tracking,
    },
    routes: {
        only: ['createOneBase', 'getManyBase', 'updateOneBase', 'deleteOneBase', 'getOneBase'],
    },
    dto: {
        create: CreateTrackingDto,
        update: UpdateTrackingDto,
    },
    query: {
        exclude: ['id'],
        sort: [{ field: 'id', order: OrderEnum.ASC }],
        join: {
            datasource: {
                eager: true,
            },
        },
    },
})
@Controller(tableName)
export class TrackingController implements CrudController<Tracking> {
    constructor(public readonly service: TrackingService) {}

    @Override()
    @Get()
    @UseInterceptors(CrudRequestInterceptor)
    @ApiOperation({ summary: '查询所有埋点' })
    @Public()
    async getMany(@ParsedRequest() crudReq: CrudRequest) {
        const res = await this.service.getMany(crudReq)
        const normalizedRes = normalizedQueryResult(res)
        return normalizedRes
    }

    @Delete('datasource/:id')
    @ApiOperation({ summary: '删除埋点数据源' })
    async deleteDatasource(@Param('id') id: number) {
        return await this.service.deleteDatasource(id)
    }

    @Get('track.gif')
    @ApiOperation({ summary: 'gif数据上报' })
    @Public()
    async track(@Query() params: ReportTrackingDto, @Res() res: Response) {
        // 返回透明 1x1 GIF
        const gifBuffer = Buffer.from(
            'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
            'base64',
        )
        res.setHeader('Content-Type', 'image/gif')
        res.setHeader('Cache-Control', 'no-store, max-age=0')
        res.send(gifBuffer)

        this.service.processLog(params)
    }

    @Post('report')
    @ApiOperation({ summary: 'sendBeacon数据上报' })
    @Public()
    async report(@Body() body: ReportTrackingDto): Promise<SuccessResp> {
        this.service.processLog(body)
        return undefined
    }

    @Get('log')
    @ApiOperation({ summary: '获取埋点日志' })
    async getLogList(@Query() params: GetLogListDto) {
        return await this.service.getLogList(params)
    }
}
