import type { AddUser, SearchUserForm, UpdateUser } from '@/models/dto/user.dto'
import type { Menu } from '@/models/vo/menu.vo'
import type { User } from '@/models/vo/user.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import request from '../request'

export function getUser(data: Api.commonGetDto<SearchUserForm>) {
    const query = getQueryWithFilter(data, [
        { field: 'username', condition: '$contL' },
        { field: 'email', condition: '$contL' },
        { field: 'status', condition: '$eq' },
    ])
    return request.get<Api.commonGetResp<User>>(`/user?${query}`)
}

export function createUser(data: AddUser) {
    return request.post<User>('/user', data)
}

export function deleteUser(id: number) {
    return request.delete(`/user/${id}`)
}

export function updateUser(id: number, params: UpdateUser) {
    return request.patch(`/user/${id}`, params)
}

export function getUserMenuList() {
    return request.get<Menu[]>('/user/menu')
}
