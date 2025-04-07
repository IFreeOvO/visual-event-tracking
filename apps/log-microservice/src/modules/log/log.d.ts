export interface TrackLogMessage {
    eventId: number
    eventType: number
    xpath: string
    data: Record<string, any>
}

export interface TrackLogKafkaMessage {
    timestamp: number
    data: TrackLogMessage
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
