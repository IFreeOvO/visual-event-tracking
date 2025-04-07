import type {
    AddPermission,
    SearchPermissionForm,
    UpdatePermission,
} from '@/models/dto/permission.dto'
import type {
    FeaturePermissionTreeData,
    MenuPermissionTreeData,
    Permission,
} from '@/models/vo/permission.vo'
import { getQueryWithFilter } from '@/shared/get-query-with-filter'
import request from '../request'

export function getPermissions(data: Api.commonGetDto<SearchPermissionForm>) {
    const query = getQueryWithFilter(data, [
        { field: 'permissionCode', condition: '$contL' },
        { field: 'permissionType', condition: '$eq' },
        { field: 'status', condition: '$eq' },
    ])
    return request.get<Api.commonGetResp<Permission>>(`/permission?${query}`)
}

export function createPermission(data: AddPermission) {
    return request.post<Permission>('/permission', data)
}

export function deletePermission(id: number) {
    return request.delete(`/permission/${id}`)
}

export function updatePermission(id: number, params: UpdatePermission) {
    return request.patch(`/permission/${id}`, params)
}

export function getMenuPermissions() {
    return request.get<MenuPermissionTreeData[]>('/permission/menu')
}

export function getFeaturePermissions() {
    return request.get<FeaturePermissionTreeData[]>('/permission/subject')
}
