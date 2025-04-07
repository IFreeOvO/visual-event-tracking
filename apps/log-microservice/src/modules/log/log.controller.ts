import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { KAFKA_TOPIC_TRACK_LOG } from '@/constants/global.constant'
import { KafkaService } from '@/providers/kafka/kafka.service'
import { GetLogListDto } from './dto/get-log-list.dto'
import { TrackLogKafkaMessage, TrackLogMessage } from './log.d'
import { LogService } from './log.service'

@Controller('log')
export class LogController {
    constructor(
        private readonly logService: LogService,
        private kafkaClient: KafkaService,
    ) {}

    @MessagePattern('log.getLogList')
    async getLogList(@Payload() params: GetLogListDto) {
        return await this.logService.getLogList(params)
    }

    @MessagePattern('log.report')
    async generateSdk(data: TrackLogMessage) {
        this.kafkaClient.emitTrackMessage({
            value: {
                data,
                timestamp: new Date().getTime(),
            },
        })
    }

    @EventPattern(KAFKA_TOPIC_TRACK_LOG)
    handleMessage(@Payload() data: TrackLogKafkaMessage) {
        this.logService.saveLog(data)
    }
}
