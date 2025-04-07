import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { LogModule } from './modules/log/log.module'
import { ClickhouseModule } from './providers/clickhouse/clickhouse.module'
import { ConfigModule } from './providers/config/config.module'
import { KafkaClientModule } from './providers/kafka/kafka.module'
import { TypeOrmModule } from './providers/typeorm/typeorm.module'
import { WinstonModule } from './providers/winston/winston.module'

@Module({
    imports: [
        ConfigModule,
        WinstonModule,
        TypeOrmModule,
        ClickhouseModule,
        KafkaClientModule,
        LogModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
