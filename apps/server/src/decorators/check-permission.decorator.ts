import { SetMetadata } from '@nestjs/common'
import { PERMISSION_METADATA } from '@/constants/global.constant'

export const CheckPermission = (...permission: string[]) =>
    SetMetadata(PERMISSION_METADATA, permission)
