import type { ChunkObj } from '@/shared/upload-large-file'
import SparkMD5 from 'spark-md5'

export function createChunk(file: File, chunkIndex: number, chunkSize: number): Promise<ChunkObj> {
    return new Promise((resolve) => {
        const start = chunkIndex * chunkSize
        const end = start + chunkSize
        const spark = new SparkMD5.ArrayBuffer()
        const fileReader = new FileReader()
        const blob = file.slice(start, end)

        fileReader.onload = function (e) {
            const result = e.target?.result
            if (result instanceof ArrayBuffer) {
                spark.append(result)
                resolve({
                    start,
                    end,
                    index: chunkIndex,
                    hash: spark.end(),
                    blob,
                })
            }
        }
        fileReader.readAsArrayBuffer(blob)
    })
}

interface Data {
    file: File
    start: number
    end: number
    CHUNK_SIZE: number
}

onmessage = async (e: MessageEvent<Data>) => {
    const { file, start, end, CHUNK_SIZE } = e.data
    const taskList = []
    for (let i = start; i < end; i++) {
        const createChunkPromise = createChunk(file, i, CHUNK_SIZE)
        taskList.push(createChunkPromise)
    }
    const chunks = await Promise.all(taskList)
    postMessage(chunks)
}
