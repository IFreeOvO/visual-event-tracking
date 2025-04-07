import { createClient } from '@clickhouse/client'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ConfigEnum } from '@/constants/config.constant'
import { CLICKHOUSE_PROVIDE_NAME } from '@/constants/global.constant'
import { ClickhouseService } from './clickhouse.service'
@Global()
@Module({
    providers: [
        ClickhouseService,
        {
            provide: CLICKHOUSE_PROVIDE_NAME,
            async useFactory(configService: ConfigService) {
                return createClient({
                    url: configService.get(ConfigEnum.CLICKHOUSE_URL),
                    username: configService.get(ConfigEnum.CLICKHOUSE_USERNAME),
                    password: configService.get(ConfigEnum.CLICKHOUSE_PASSWORD),
                    database: configService.get(ConfigEnum.CLICKHOUSE_DATABASE),
                })
            },
            inject: [ConfigService],
        },
    ],
    exports: [CLICKHOUSE_PROVIDE_NAME, ClickhouseService],
})
export class ClickhouseModule {}
