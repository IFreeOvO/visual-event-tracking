import { LayoutEnum, VisibleStatusEnum } from '@/constants/enums'

export interface Menu {
    componentName?: string
    icon?: string
    id: number
    name: string
    order: number
    parentId: number
    path?: string
    visibleStatus: VisibleStatusEnum
    layout: LayoutEnum
    children?: Menu[]
}
