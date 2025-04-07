import { basename, extname, resolve } from 'path'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
    move,
    mkdirs,
    readdir,
    createReadStream,
    createWriteStream,
    unlinkSync,
    statSync,
    existsSync,
    rmdirSync,
} from 'fs-extra'
import { ConfigEnum } from '@/constants/config.constant'

@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {}

    async uploadChunks(chunks: Array<Express.Multer.File>, fileName: string, chunkHash: string) {
        const chunkDir = this.getChunkDir(fileName)
        if (!existsSync(chunkDir)) {
            await mkdirs(chunkDir)
        }

        for (const chunk of chunks) {
            await move(chunk.path, `${chunkDir}/${chunkHash}`, { overwrite: true })
        }
    }

    async merge(fileName: string, chunkHashList: string[]) {
        const chunkDir = this.getChunkDir(fileName)
        const tempRandomStr = Math.random().toString(36).substring(2, 10)
        const uploadDir = `${this.configService.get(ConfigEnum.STATIC_PATH)}/${this.configService.get(ConfigEnum.UPLOAD_PATH)}`
        const localFileName = `${tempRandomStr}_${fileName}`
        const filePath = `${uploadDir}/${localFileName}`

        // 按照chunk的hash顺序拼接
        let start = 0
        const tasks = chunkHashList.map((chunkHash) => {
            const chunkRelativePath = resolve(chunkDir, chunkHash)
            const streamPromise = pipeStream(
                chunkRelativePath,
                createWriteStream(filePath, {
                    start,
                }),
            )
            const chunkSize = statSync(chunkRelativePath).size
            start += chunkSize
            return streamPromise
        })
        await Promise.all(tasks)

        // 合并后删除切片的目录。(由于可能存在相同文件名的文件上传到同一个文件里，所以有可能目录里面还有文件的切片)
        const isEmpty = (await readdir(chunkDir)).length === 0
        if (isEmpty) {
            rmdirSync(chunkDir)
        }

        return this.getFileURL(filePath)
    }

    getChunkDir(fileName: string) {
        const fileNameWithoutExt = basename(fileName, extname(fileName))
        const uploadDir = `${this.configService.get(ConfigEnum.STATIC_PATH)}/${this.configService.get(ConfigEnum.UPLOAD_PATH)}`
        const chunkDir = `${uploadDir}/${fileNameWithoutExt}_chunks`
        return chunkDir
    }

    getFileURL(filePath: string) {
        const serverHost = this.configService.get(ConfigEnum.SERVER_HOST)
        const serverPort = this.configService.get(ConfigEnum.SERVER_PORT)
        return `${serverHost}:${serverPort}${this.configService.get(ConfigEnum.API_PREFIX)}/${filePath}`
    }
}

function pipeStream(path: string, writeStream: NodeJS.WritableStream): Promise<void> {
    return new Promise((resolve) => {
        const readStream = createReadStream(path)
        readStream.on('end', () => {
            unlinkSync(path)
            resolve()
        })
        readStream.pipe(writeStream)
    })
}
