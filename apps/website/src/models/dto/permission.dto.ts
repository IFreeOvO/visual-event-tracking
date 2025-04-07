import { PermissionStatusEnum, PermissionTypeEnum } from '@/constants/enums'

export interface SearchPermissionForm {
    permissionCode?: string
    permissionType?: PermissionTypeEnum
    status?: PermissionStatusEnum
}

export interface AddPermission {
    permissionCode?: string
    permissionType?: PermissionTypeEnum
    status?: PermissionStatusEnum
    permissionRelationId?: number
}

export interface UpdatePermission {
    status?: PermissionStatusEnum
}
