import type { SearchMenuForm } from '@/models/dto/menu.dto'
import type { Menu } from '@/models/vo/menu.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import request from '../request'

export function createMenu(data: Omit<Menu, 'id'>) {
    return request.post<Omit<Menu, 'id'>>('/menu', data)
}

export function getMenus(data: Api.commonGetDto<SearchMenuForm>) {
    const query = getQueryWithFilter(data, [
        { field: 'name', condition: '$contL' },
        { field: 'path', condition: '$contL' },
        { field: 'status', condition: '$eq' },
    ])
    return request.get<Api.commonGetResp<Menu>>(`/menu?${query}`)
}

export function deleteMenu(id: number) {
    return request.delete(`/menu/${id}`)
}

export function updateMenu(id: number, params: Menu) {
    return request.patch(`/menu/${id}`, params)
}
