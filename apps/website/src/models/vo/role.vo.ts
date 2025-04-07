import { RoleStatusEnum } from '@/constants/enums'

export interface Role {
    id: number
    roleName: string
    roleDesc: string
    roleCode: string
    status: RoleStatusEnum
}
