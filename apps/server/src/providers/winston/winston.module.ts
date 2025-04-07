import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WinstonModuleOptions, WinstonModule as Winston } from 'nest-winston'
import * as winston from 'winston'
import { ConfigEnum } from '@/constants/config.constant'
import 'winston-daily-rotate-file'

function createDailyRotateTransport(level: string, filename: string) {
    return new winston.transports.DailyRotateFile({
        level, // 记录error级别的日志
        dirname: 'logs',
        filename: `${filename}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD', // 每天记录一次
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    })
}

@Module({
    imports: [
        Winston.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const colorizer = winston.format.colorize()

                return {
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        winston.format.printf((info) => {
                            const prefix = `[${info.level}] ${info.timestamp}`
                            return `${colorizer.colorize(info.level, prefix)} ${info.message}`
                        }),
                    ),
                    transports: [
                        new winston.transports.Console(),
                        ...(configService.get(ConfigEnum.LOG_ON)
                            ? [createDailyRotateTransport('error', 'error')]
                            : []),
                    ],
                } as WinstonModuleOptions
            },
        }),
    ],
})
export class WinstonModule {}
