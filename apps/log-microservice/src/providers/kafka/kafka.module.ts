import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { KAFKA_PROVIDE_NAME } from '@/constants/global.constant'
import { createKafkaOptions } from './kafka-options'
import { KafkaController } from './kafka.controller'
import { KafkaService } from './kafka.service'

@Global()
@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: KAFKA_PROVIDE_NAME,
                useFactory: (configService: ConfigService) => createKafkaOptions(configService),
                inject: [ConfigService],
            },
        ]),
    ],
    controllers: [KafkaController],
    providers: [KafkaService],
    exports: [KafkaService],
})
export class KafkaClientModule {}
