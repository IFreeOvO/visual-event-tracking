import type { Role } from '@/models/vo/role.vo'
import { UserStatusEnum } from '@/constants/enums'

export interface User {
    id: number
    username: string
    email: string
    status: UserStatusEnum
    roles: Role[]
}
