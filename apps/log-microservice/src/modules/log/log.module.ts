import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from '@/entities/project.entity'
import { TrackingDatasource } from '@/entities/tracking-datasource.entity'
import { Tracking } from '@/entities/tracking.entity'
import { LogController } from './log.controller'
import { LogService } from './log.service'

@Module({
    imports: [TypeOrmModule.forFeature([Project, Tracking, TrackingDatasource])],
    controllers: [LogController],
    providers: [LogService],
})
export class LogModule {}
