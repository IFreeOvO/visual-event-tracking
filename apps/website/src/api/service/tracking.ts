import { SearchLogForm, Tracking, TrackLog } from '@/models/vo/tracking.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import { removeEmptyStringKeys } from '@/shared/remove-empty-string-keys'
import request from '../request'

export function getTrackingList(data: Api.commonGetDto<Partial<Tracking>>, ...args: any[]) {
    const query = getQueryWithFilter(data, [
        { field: 'eventName', condition: '$contL' },
        { field: 'url', condition: '$eq' },
        { field: 'projectId', condition: '$eq' },
    ])
    return request.get<Api.commonGetResp<Tracking>>(`/tracking?${query}`, ...args)
}

export function createTracking(data: Omit<Tracking, 'id'>) {
    return request.post('/tracking', data)
}

export function deleteTracking(id: number) {
    return request.delete(`/tracking/${id}`)
}

export function updateTracking(id: number, data: Tracking) {
    return request.patch(`/tracking/${id}`, data)
}

export function deleteTrackingDatasource(id: number) {
    return request.delete(`/tracking/datasource/${id}`)
}

export function getTracking(id: number) {
    return request.get<Tracking>(`/tracking/${id}`)
}

export function getLogList(data: Api.commonGetDto<SearchLogForm>) {
    return request.get<Api.commonGetResp<TrackLog>>('/tracking/log', removeEmptyStringKeys(data))
}
