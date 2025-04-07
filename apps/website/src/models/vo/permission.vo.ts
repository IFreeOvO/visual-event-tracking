import { PermissionStatusEnum, PermissionTypeEnum } from '@/constants/enums'
import { Feature } from './feature.vo'
import { Menu } from './menu.vo'

export interface Permission {
    id: number
    permissionCode: string
    permissionType: PermissionTypeEnum
    permissionRelationId: number
    status: PermissionStatusEnum
    menu?: Menu
    subject?: Feature
}

export interface MenuPermissionTreeData {
    permissionId: number
    key: number
    permissionCode: string
    permissionType: PermissionTypeEnum
    permissionRelationId: number
    status: PermissionStatusEnum
    title: string
    children?: MenuPermissionTreeData[]
}

export interface FeaturePermissionTreeData {
    permissionId?: number
    key: number
    permissionCode?: string
    permissionType?: PermissionTypeEnum
    permissionRelationId?: number
    status?: PermissionStatusEnum
    title: string
    disabled?: boolean
    children?: FeaturePermissionTreeData[]
}
