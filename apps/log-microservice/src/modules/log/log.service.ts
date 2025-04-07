import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CLICKHOUSE_TRACK_LOG_TABLE } from '@/constants/global.constant'
import { Tracking } from '@/entities/tracking.entity'
import { ClickhouseService } from '@/providers/clickhouse/clickhouse.service'
import { GetLogListDto } from './dto/get-log-list.dto'
import { TrackLog, TrackLogKafkaMessage } from './log.d'

@Injectable()
export class LogService {
    constructor(
        private clickhouseService: ClickhouseService,
        @InjectRepository(Tracking)
        private TrackingRepo: Repository<Tracking>,
    ) {}

    async saveLog(message: TrackLogKafkaMessage) {
        const { data, timestamp } = message

        const result = await this.TrackingRepo.findOne({
            where: {
                id: data.eventId,
            },
        })

        const newData: TrackLog = {
            eventId: result.id,
            eventName: result.eventName,
            eventType: data.eventType,
            eventTime: timestamp,
            url: result.url,
            xpath: data.xpath,
            isSiblingEffective: result.isSiblingEffective,
            snapshot: result.snapshot,
            projectId: result.projectId,
            params: JSON.stringify(data.data),
        }

        await this.clickhouseService.insert([newData])
    }

    async getLogList(params: GetLogListDto) {
        return await this.clickhouseService.queryWithPagination(
            CLICKHOUSE_TRACK_LOG_TABLE,
            params.page,
            params.limit,
            params.filter,
            params.sort,
        )
    }
}
