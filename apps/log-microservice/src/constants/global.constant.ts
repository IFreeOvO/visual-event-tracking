export const isDev = process.env.NODE_ENV === 'development'
export const CURRENT_ENV = process.env.NODE_ENV

// clickhouse常量
export const CLICKHOUSE_PROVIDE_NAME = 'CLICKHOUSE_CLIENT'
export const CLICKHOUSE_TRACK_LOG_TABLE = 'track_log'

// kafka常量
export const KAFKA_PROVIDE_NAME = 'KAFKA_SERVICE'
export const KAFKA_TOPIC_TRACK_LOG = 'track-log'

export enum EventTypeEnum {
    Click,
    Expose,
}

export enum SiblingEffectiveEnum {
    No,
    Yes,
}

export enum TableEnum {
    Tracking = 'tracking',
    TrackingDatasource = 'tracking_datasource',
    Project = 'project',
}

export enum RuleRequiredEnum {
    NO,
    YES,
}
