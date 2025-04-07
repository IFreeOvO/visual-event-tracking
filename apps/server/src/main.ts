import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { WsAdapter } from '@nestjs/platform-ws'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { ConfigEnum } from '@/constants/config.constant'
import { isDev } from '@/constants/global.constant'
import { AppModule } from './app.module'
import metadata from './metadata'

async function setupSwagger(app: NestExpressApplication, configService: ConfigService) {
    const config = new DocumentBuilder()
        .setTitle(configService.get(ConfigEnum.PROJECT_NAME))
        .setDescription('api 接口文档')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            description: '基于jwt验证',
        })
        .build()

    await SwaggerModule.loadPluginMetadata(metadata)
    const document = SwaggerModule.createDocument(app as any, config)
    SwaggerModule.setup(configService.get(ConfigEnum.DOC_PATH), app as any, document)
}

// TODO: 项目启动两次问题目前官方没修https://github.com/swc-project/swc/issues/9379
async function bootstrap() {
    const app = (await NestFactory.create(AppModule)) as NestExpressApplication
    const configService = app.get(ConfigService)
    app.setGlobalPrefix(configService.get(ConfigEnum.API_PREFIX))
    app.enableCors({
        credentials: true,
        origin: `${configService.get<string>(ConfigEnum.FRONT_END_DOMAIN)}`.split(','),
    })

    if (isDev) {
        setupSwagger(app, configService)
    }

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    app.useStaticAssets('devtools-frontend', {
        prefix: `${configService.get(ConfigEnum.API_PREFIX)}/devtools-frontend`,
    })
    app.useStaticAssets(configService.get(ConfigEnum.STATIC_PATH), {
        prefix: `${configService.get(ConfigEnum.API_PREFIX)}/static`,
    })
    app.useWebSocketAdapter(new WsAdapter(app))

    await app.listen(configService.get(ConfigEnum.SERVER_PORT), function () {
        console.log(
            '服务启动成功：' +
                `${configService.get(ConfigEnum.SERVER_HOST)}:${configService.get(ConfigEnum.SERVER_PORT)}`,
        )
        if (isDev) {
            console.log(
                'swagger文档地址：' +
                    `${configService.get(ConfigEnum.SERVER_HOST)}:${configService.get(ConfigEnum.SERVER_PORT)}${configService.get(ConfigEnum.DOC_PATH)}`,
            )
        }
    })
}
bootstrap()
