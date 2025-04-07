import { EventTypeEnum, RuleRequiredEnum, SiblingEffectiveEnum } from '@/constants/enums'

export interface TrackingDatasourceRule {
    reg?: string
    isRequired?: RuleRequiredEnum
}

export type TrackingDatasource = {
    tempId?: string
    id?: number
    fieldName: string
    fieldXpath: string
    fieldSnapshot: string
} & TrackingDatasourceRule

export interface Tracking {
    id: number
    eventName: string
    url: string
    eventType: EventTypeEnum[]
    isSiblingEffective: SiblingEffectiveEnum
    snapshot: string
    xpath: string
    validationMarker: string
    datasource: TrackingDatasource[]
    projectId: number
}

export interface TrackLog {
    eventId: number
    eventName: string
    eventType: number
    eventTime: number
    url: string
    xpath: string
    isSiblingEffective: number
    snapshot: string
    projectId: number
    params: string
}

export type SearchLogForm = Partial<
    Pick<TrackLog, 'eventName' | 'eventType' | 'url' | 'projectId'> & {
        eventTime: string[]
    }
>
