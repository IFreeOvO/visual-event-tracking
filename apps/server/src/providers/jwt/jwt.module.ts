import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule as Jwt } from '@nestjs/jwt'
import { ConfigEnum } from '@/constants/config.constant'

@Module({
    imports: [
        Jwt.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>(ConfigEnum.JWT_SECRET),
                signOptions: {
                    expiresIn: configService.get<string>(ConfigEnum.JWT_ACCESS_TOKEN_EXPIRES_IN), // h小时,d天
                },
            }),
            inject: [ConfigService],
        }),
    ],
})
export class JwtModule {}
