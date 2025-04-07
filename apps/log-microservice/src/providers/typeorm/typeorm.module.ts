import type { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule as TypeOrm } from '@nestjs/typeorm'
import { ConfigEnum } from '@/constants/config.constant'

@Module({
    imports: [
        TypeOrm.forRootAsync({
            useFactory(configService: ConfigService) {
                const mysqlConfig = {
                    type: 'postgres',
                    host: configService.get(ConfigEnum.POSTGRESQL_HOST),
                    port: configService.get(ConfigEnum.POSTGRESQL_PORT),
                    username: configService.get(ConfigEnum.POSTGRESQL_USERNAME),
                    password: configService.get(ConfigEnum.POSTGRESQL_PASSWORD),
                    database: configService.get(ConfigEnum.POSTGRESQL_DATABASE),
                    synchronize: JSON.parse(configService.get(ConfigEnum.POSTGRESQL_SYNCHRONIZE)),
                    autoLoadEntities: true,
                    logging: JSON.parse(configService.get(ConfigEnum.POSTGRESQL_LOGGING)),
                } as TypeOrmModuleOptions
                return mysqlConfig
            },
            inject: [ConfigService],
        }),
    ],
})
export class TypeOrmModule {}
