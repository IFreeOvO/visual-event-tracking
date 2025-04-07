import type { ReportTrackingDto } from './dto/report-tracking.dto'
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { firstValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { MicroserviceEnum } from '@/constants/global.constant'
import { GetLogListDto } from './dto/get-log-list.dto'
import { TrackingDatasource } from './entities/tracking-datasource.entity'
import { Tracking } from './entities/tracking.entity'

@Injectable()
export class TrackingService extends TypeOrmCrudService<Tracking> {
    @Inject(MicroserviceEnum.LOG)
    private readonly logMicroservice: ClientProxy

    constructor(
        @InjectRepository(Tracking) repo: Repository<Tracking>,
        @InjectRepository(TrackingDatasource)
        private datasourceRepo: Repository<TrackingDatasource>,
    ) {
        super(repo)
    }

    async deleteDatasource(id: number) {
        return await this.datasourceRepo.delete(id)
    }

    async processLog(data: ReportTrackingDto) {
        this.logMicroservice.send('log.report', data).subscribe({
            error: (err) => console.error('消息发送失败:', err),
        })
    }

    async getLogList(params: GetLogListDto) {
        try {
            return await firstValueFrom(this.logMicroservice.send('log.getLogList', params))
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
