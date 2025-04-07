import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_METADATA } from '@/constants/global.constant'

export const Public = () => SetMetadata(IS_PUBLIC_METADATA, true)
