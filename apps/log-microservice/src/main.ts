import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConfigEnum } from '@/constants/config.constant'
import { AppModule } from './app.module'
import { createKafkaOptions } from './providers/kafka/kafka-options'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)
    app.setGlobalPrefix(configService.get(ConfigEnum.API_PREFIX))

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: configService.get(ConfigEnum.TCP_HOST),
            port: configService.get(ConfigEnum.SERVER_PORT),
        },
    })

    app.connectMicroservice<MicroserviceOptions>(createKafkaOptions(configService))

    console.log('正在启动微服务...')
    await app.startAllMicroservices()
    console.log('微服务已启动 ✅' + `http://localhost:${configService.get(ConfigEnum.SERVER_PORT)}`)
    await app.listen(3300)
}
bootstrap()
