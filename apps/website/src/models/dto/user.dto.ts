import type { UserStatusEnum } from '@/constants/enums'

export interface AddUser {
    username: string
    email: string
    password: string
    status: UserStatusEnum
    roles: number[]
}

export interface UpdateUser {
    email: string
    status: UserStatusEnum
    roles: number[]
}

export interface SearchUserForm {
    username?: string
    email?: string
    status?: UserStatusEnum
}
