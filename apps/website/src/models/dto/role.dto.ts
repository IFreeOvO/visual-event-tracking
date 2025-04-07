import type { PermissionTypeEnum, RoleStatusEnum } from '@/constants/enums'

export interface SearchRoleForm {
    roleName?: string
    roleDesc?: string
    status?: RoleStatusEnum
}

export interface SaveRoleMenuDto {
    roleId: number
    permissionIds: number[]
    type: PermissionTypeEnum
}
