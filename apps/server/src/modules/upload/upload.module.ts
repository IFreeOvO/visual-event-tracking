import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { ConfigEnum } from '@/constants/config.constant'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                storage: diskStorage({
                    destination: `${configService.get(ConfigEnum.STATIC_PATH)}/${configService.get(ConfigEnum.UPLOAD_PATH)}`,
                    filename: (_req, file, callback) => {
                        const randomStr = Math.random().toString(36).substring(2, 10)
                        const filename = decodeURIComponent(file.originalname)
                        callback(null, `${randomStr}_${filename}`)
                    },
                }),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
