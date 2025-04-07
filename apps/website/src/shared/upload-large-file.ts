import { uploadChunks, uploadMerge } from '@/api/service/upload'
import { UploadMergeDto } from '@/models/dto/upload.dto'
import TaskPool from './task-pool'

export interface ChunkObj {
    start: number
    end: number
    index: number
    hash: string
    blob: Blob
}

const CHUNK_SIZE = 1024 * 1024 * 1 // 1MB
const THREAD_COUNT = navigator.hardwareConcurrency ?? 2

async function getFileChunks(file: File | Blob): Promise<ChunkObj[]> {
    return new Promise((resolve) => {
        const chunkCount = Math.ceil(file.size / CHUNK_SIZE)
        const threadResult: ChunkObj[][] = []
        const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT)
        let finishedThreadCount = 0

        for (let i = 0; i < THREAD_COUNT; i++) {
            const worker = new Worker(
                new URL('../workers/calculate-chunk-hash.worker.ts', import.meta.url),
                {
                    type: 'module',
                },
            )
            const start = i * threadChunkCount
            const end = Math.min(start + threadChunkCount, chunkCount)
            worker.postMessage({
                file,
                start,
                end,
                CHUNK_SIZE,
            })
            worker.onmessage = (e: MessageEvent<ChunkObj[]>) => {
                worker.terminate()
                threadResult[i] = e.data
                finishedThreadCount++
                if (finishedThreadCount === THREAD_COUNT) {
                    resolve(threadResult.flat())
                }
            }
        }
    })
}

export async function uploadLargeFile(file: File | Blob, filename: string) {
    // 分片
    const chunks = await getFileChunks(file)
    const taskPool = new TaskPool()
    chunks.map((chunk) => {
        const data = new FormData()
        data.set('filename', filename)
        data.set('chunkHash', chunk.hash)
        data.append('chunks', chunk.blob)
        taskPool.add(() => uploadChunks(data))
    })
    await taskPool.run()

    // 合并分片
    const params: UploadMergeDto = {
        filename,
        chunkHashList: [],
    }
    chunks.forEach((chunk) => {
        params.chunkHashList.push(chunk.hash)
    })
    uploadMerge(params)
}
