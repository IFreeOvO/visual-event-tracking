import type { AddFeature, SearchFeatureForm, UpdateFeature } from '@/models/dto/feature.dto'
import type { Feature } from '@/models/vo/feature.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import request from '../request'

export function getFeatures(data: Api.commonGetDto<SearchFeatureForm>) {
    const query = getQueryWithFilter(data, [{ field: 'subjectDesc', condition: '$contL' }])
    return request.get<Api.commonGetResp<Feature>>(`/subject?${query}`)
}

export function createFeature(data: AddFeature) {
    return request.post<Feature>('/subject', data)
}

export function deleteFeature(id: number) {
    return request.delete(`/subject/${id}`)
}

export function updateFeature(id: number, params: UpdateFeature) {
    return request.patch(`/subject/${id}`, params)
}

export function getSubjectNames() {
    return request.get<string[]>(`/subject/names`)
}
