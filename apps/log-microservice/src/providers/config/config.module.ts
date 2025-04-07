import { Module } from '@nestjs/common'
import { ConfigModule as Config } from '@nestjs/config'
import { CURRENT_ENV } from '@/constants/global.constant'

@Module({
    imports: [
        Config.forRoot({
            isGlobal: true,
            envFilePath: [`.env.${CURRENT_ENV}`, '.env', '.env.local'],
        }),
    ],
})
export class ConfigModule {}
