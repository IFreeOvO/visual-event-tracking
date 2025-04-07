import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'
import { UploadService } from './upload.service'

@ApiTags('上传模块')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @ApiOperation({ summary: '多文件上传' })
    @UseInterceptors(FilesInterceptor('files', 20))
    uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        const urls = files.map((file) => {
            return {
                filename: file.filename,
                url: this.uploadService.getFileURL(file.path),
            }
        })
        return urls
    }

    @Post('chunks')
    @ApiOperation({ summary: '分片上传' })
    @SkipThrottle()
    @UseInterceptors(FilesInterceptor('chunks'))
    uploadChunks(
        @UploadedFiles() chunks: Array<Express.Multer.File>,
        @Body() body: { filename: string; chunkHash: string },
    ) {
        return this.uploadService.uploadChunks(chunks, body.filename, body.chunkHash)
    }

    @Post('merge')
    @ApiOperation({ summary: '分片合并' })
    merge(@Body() body: { chunkHashList: string[]; filename: string }) {
        return this.uploadService.merge(body.filename, body.chunkHashList)
    }
}
