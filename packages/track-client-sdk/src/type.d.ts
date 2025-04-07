import { RuleRequiredEnum, SiblingEffectiveEnum, EventTypeEnum } from './enum'

export interface Datasource {
    id?: number
    fieldName: string
    fieldXpath: string
    fieldSnapshot: string
    isRequired?: RuleRequiredEnum
    reg?: string
}

export interface TrackingConfig {
    id: number
    eventName: string
    url: string
    eventType: EventTypeEnum[]
    isSiblingEffective: SiblingEffectiveEnum
    snapshot: string
    xpath: string
    validationMarker: string
    datasource: Datasource[]
    projectId: number
}
