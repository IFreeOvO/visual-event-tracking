import { UploadMergeDto, UploadResponseData, UploadResponseDto } from '@/models/dto/upload.dto'
import request from '../request'

export function upload(data: FormData) {
    return request.post<UploadResponseDto>('/upload', data, {
        headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
        },
    })
}

export function uploadChunks(data: FormData) {
    return request.post('/upload/chunks', data, {
        headers: {
            'Content-Type': 'multipart/form-data;charset=utf-8',
        },
    })
}

export function uploadMerge(data: UploadMergeDto) {
    return request.post<UploadResponseData>('/upload/merge', data)
}
