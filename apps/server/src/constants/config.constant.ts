export enum ConfigEnum {
    // nest 服务配置
    SERVER_PORT = 'server_port',
    SERVER_HOST = 'server_host',
    API_PREFIX = 'api_prefix',
    DOC_PATH = 'doc_path',
    PROJECT_NAME = 'project_name',
    FRONT_END_DOMAIN = 'front_end_domain',
    STATIC_PATH = 'static_path',
    // redis 相关配置
    REDIS_HOST = 'redis_host',
    REDIS_PORT = 'redis_port',
    REDIS_PASSWORD = 'redis_password',
    REDIS_DB = 'redis_db',
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
    // jwt 配置
    JWT_SECRET = 'jwt_secret',
    JWT_ACCESS_TOKEN_EXPIRES_IN = 'jwt_access_token_expires_in',
    // 邮件配置
    SMTP_HOST = 'smtp_host',
    SMTP_PORT = 'smtp_port',
    SMTP_USER = 'smtp_user',
    SMTP_PASS = 'smtp_pass',
    // 验证码
    REGISTER_CAPTCHA_EXPIRATION = 'register_captcha_expiration',
    // 上传配置
    UPLOAD_PATH = 'upload_path',
    // log微服务
    LOG_MICROSERVICE_HOST = 'log_microservice_host',
    LOG_MICROSERVICE_PORT = 'log_microservice_port',
}
