import type { SearchActionForm } from '@/models/dto/action.dto'
import type { Action } from '@/models/vo/action.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import request from '../request'

export function getActions(data: Api.commonGetDto<SearchActionForm>) {
    const query = getQueryWithFilter(data, [{ field: 'actionDesc', condition: '$contL' }])
    return request.get<Api.commonGetResp<Action>>(`/action?${query}`)
}

export function createAction(data: Action) {
    return request.post<Action>('/action', data)
}

export function deleteAction(id: number) {
    return request.delete(`/action/${id}`)
}

export function updateAction(id: number, params: Action) {
    return request.patch(`/action/${id}`, params)
}
