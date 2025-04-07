import type { SaveRoleMenuDto, SearchRoleForm } from '@/models/dto/role.dto'
import type { Role } from '@/models/vo/role.vo'
import { Permission } from '@/models/vo/permission.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import request from '../request'

export function getRole(data: Api.commonGetDto<SearchRoleForm>) {
    const query = getQueryWithFilter(data, [
        { field: 'username', condition: '$contL' },
        { field: 'email', condition: '$contL' },
        { field: 'status', condition: '$eq' },
    ])
    return request.get<Api.commonGetResp<Role>>(`/role?${query}`)
}

export function createRole(data: Role) {
    return request.post<Role>('/role', data)
}

export function deleteRole(id: number) {
    return request.delete(`/role/${id}`)
}

export function updateRole(id: number, params: Role) {
    return request.patch(`/role/${id}`, params)
}

export function savePermissions(params: SaveRoleMenuDto) {
    return request.post('/role/permission', params)
}

export function getRoleMenuPermissions(id: number) {
    return request.get<Permission[]>(`/role/${id}/permission/menu`)
}

export function getRoleFeaturePermissions(id: number) {
    return request.get<Permission[]>(`/role/${id}/permission/subject`)
}
