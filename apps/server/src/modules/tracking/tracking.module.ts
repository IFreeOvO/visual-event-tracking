import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigEnum } from '@/constants/config.constant'
import { MicroserviceEnum } from '@/constants/global.constant'
import { TrackingDatasource } from './entities/tracking-datasource.entity'
import { Tracking } from './entities/tracking.entity'
import { TrackingController } from './tracking.controller'
import { TrackingService } from './tracking.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Tracking, TrackingDatasource]),
        ClientsModule.registerAsync([
            {
                name: MicroserviceEnum.LOG,
                imports: [ConfigModule],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get(ConfigEnum.LOG_MICROSERVICE_HOST),
                        port: configService.get(ConfigEnum.LOG_MICROSERVICE_PORT),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [TrackingController],
    providers: [TrackingService],
})
export class TrackingModule {}
