export enum ConfigEnum {
    // nest 服务配置
    SERVER_PORT = 'server_port',
    TCP_HOST = 'tcp_host',
    API_PREFIX = 'api_prefix',
    // clickhouse 服务配置
    CLICKHOUSE_URL = 'clickhouse_url',
    CLICKHOUSE_USERNAME = 'clickhouse_username',
    CLICKHOUSE_PASSWORD = 'clickhouse_password',
    CLICKHOUSE_DATABASE = 'clickhouse_database',
    // kafka 服务配置
    KAFKA_BROKERS = 'kafka_brokers',
    KAFKA_GROUP_ID = 'kafka_group_id',
    // postgresql 相关配置
    POSTGRESQL_HOST = 'postgresql_host',
    POSTGRESQL_PORT = 'postgresql_port',
    POSTGRESQL_USERNAME = 'postgresql_username',
    POSTGRESQL_PASSWORD = 'postgresql_password',
    POSTGRESQL_DATABASE = 'postgresql_database',
    POSTGRESQL_SYNCHRONIZE = 'postgresql_synchronize',
    POSTGRESQL_LOGGING = 'postgresql_logging',
    POSTGRESQL_MIGRATIONS = 'postgresql_migrations',
    // 日志配置
    LOG_ON = 'log_on',
}
