import { ConfigService } from '@nestjs/config'
import { KafkaOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'
import { ConfigEnum } from '@/constants/config.constant'

export const createKafkaOptions = (config: ConfigService): KafkaOptions => ({
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: config.get<string>(ConfigEnum.KAFKA_BROKERS).split(','),
            requestTimeout: 10 * 1000, // 必须大于heartbeatInterval
            connectionTimeout: 3 * 1000, // 增加连接超时
            retry: {
                initialRetryTime: 100,
                maxRetryTime: 2 * 1000,
                retries: 3,
            },
        },
        consumer: {
            groupId: config.get<string>(ConfigEnum.KAFKA_GROUP_ID),
            heartbeatInterval: 3 * 1000, // 心跳间隔时间（以毫秒为单位）
            sessionTimeout: 10 * 1000, // 会话超时时间（以毫秒为单位），必须大于3倍heartbeat
        },
        producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
        },
    },
})
