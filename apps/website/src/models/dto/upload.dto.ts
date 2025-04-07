export interface UploadMergeDto {
    filename: string
    chunkHashList: string[]
}

export interface UploadResponseData {
    filename: string
    url: string
}

export type UploadResponseDto = UploadResponseData[]
