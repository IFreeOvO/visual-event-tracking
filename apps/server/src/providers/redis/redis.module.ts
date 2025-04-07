import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from 'redis'
import { ConfigEnum } from '@/constants/config.constant'
import { RedisService } from './redis.service'

@Global()
@Module({
    providers: [
        RedisService,
        {
            provide: 'REDIS',
            async useFactory(configService: ConfigService) {
                const client = createClient({
                    socket: {
                        host: configService.get(ConfigEnum.REDIS_HOST),
                        port: configService.get(ConfigEnum.REDIS_PORT),
                    },
                    database: configService.get(ConfigEnum.REDIS_DB),
                    password: configService.get(ConfigEnum.REDIS_PASSWORD),
                })
                await client.connect()
                return client
            },
            inject: [ConfigService],
        },
    ],
    exports: [RedisService],
})
export class RedisModule {}
