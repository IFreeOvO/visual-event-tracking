import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common'
import {
    APP_FILTER,
    APP_GUARD,
    APP_INTERCEPTOR,
    APP_PIPE,
    DiscoveryModule,
    DiscoveryService,
} from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { HttpExceptionFilter } from '@/filters/http-exception.filter'
import { ResponseInterceptor } from '@/interceptors/response.interceptor'
import { AppController } from './app.controll'
import { AppService } from './app.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { PermissionGuard } from './guards/permission.guard'
import { HelmetMiddleware } from './middleware/helmet.middleware'
import { ActionModule } from './modules/action/action.module'
import { AuthModule } from './modules/auth/auth.module'
import { MenuModule } from './modules/menu/menu.module'
import { PermissionModule } from './modules/permission/permission.module'
import { ProjectModule } from './modules/project/project.module'
import { RemoteDevtoolModule } from './modules/remote-devtool/remote-devtool.module'
import { RoleModule } from './modules/role/role.module'
import { SubjectModule } from './modules/subject/subject.module'
import { TrackingModule } from './modules/tracking/tracking.module'
import { UploadModule } from './modules/upload/upload.module'
import { UserModule } from './modules/user/user.module'
import { ConfigModule } from './providers/config/config.module'
import { JwtModule } from './providers/jwt/jwt.module'
import { RedisModule } from './providers/redis/redis.module'
import { ThrottlerModule } from './providers/throttler/throttler.module'
import { TypeOrmModule } from './providers/typeorm/typeorm.module'
import { WinstonModule } from './providers/winston/winston.module'

const globalModules = [
    ConfigModule,
    WinstonModule,
    TypeOrmModule,
    RedisModule,
    JwtModule,
    ThrottlerModule,
]

@Module({
    imports: [
        DiscoveryModule,
        ...globalModules,
        RemoteDevtoolModule,
        UserModule,
        AuthModule,
        MenuModule,
        RoleModule,
        PermissionModule,
        SubjectModule,
        ActionModule,
        ProjectModule,
        UploadModule,
        TrackingModule,
    ],
    controllers: [AppController],
    providers: [
        DiscoveryService,
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_PIPE,
            useFactory: () => {
                return new ValidationPipe({
                    whitelist: true, // 开启后，在验证过程中，只有 DTO 中定义的属性会被保留
                    forbidNonWhitelisted: true, // 开启后，如果请求中包含未在 DTO 中定义的属性，验证将失败
                    transform: false, // 开启后，输入数据将会被转换为 DTO 中定义的类型
                    forbidUnknownValues: true, // 开启后，如果请求中包含未知的值（即不在 DTO 中定义的值），验证将失败
                })
            },
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HelmetMiddleware).forRoutes('*')
    }
}
