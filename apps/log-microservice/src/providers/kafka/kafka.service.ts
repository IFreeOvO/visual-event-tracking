import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientKafka } from '@nestjs/microservices'
import { Kafka } from 'kafkajs'
import { ConfigEnum } from '@/constants/config.constant'
import { KAFKA_PROVIDE_NAME, KAFKA_TOPIC_TRACK_LOG } from '@/constants/global.constant'

@Injectable()
export class KafkaService implements OnModuleInit {
    private topicsConfig = [
        {
            topic: KAFKA_TOPIC_TRACK_LOG,
            numPartitions: 1,
            replicationFactor: 1,
            configEntries: [
                { name: 'cleanup.policy', value: 'delete' },
                { name: 'retention.ms', value: '604800000' }, // 保留7天数据
            ],
        },
    ]

    constructor(
        @Inject(KAFKA_PROVIDE_NAME) private readonly client: ClientKafka,
        private configService: ConfigService,
    ) {}

    async onModuleInit() {
        await this.initializeKafkaTopics()
        this.topicsConfig.forEach((config) => {
            this.client.subscribeToResponseOf(config.topic)
        })
        await this.client.connect()
    }

    // 初始化kafka主题
    private async initializeKafkaTopics() {
        const kafka = new Kafka({
            clientId: 'log-service',
            brokers: this.configService.get<string>(ConfigEnum.KAFKA_BROKERS).split(','),
        })
        const admin = kafka.admin()
        const existingTopics = await admin.listTopics()
        const topicsToCreate = this.topicsConfig.filter(
            (config) => !existingTopics.includes(config.topic),
        )

        if (topicsToCreate.length > 0) {
            await admin.createTopics({
                topics: topicsToCreate.map((config) => ({
                    topic: config.topic,
                    numPartitions: config.numPartitions,
                    replicationFactor: config.replicationFactor,
                    configEntries: config.configEntries,
                })),
            })
        }
        await admin.disconnect()
    }

    emitTrackMessage(data: Record<string, any>) {
        return this.client.emit<Record<string, any>>(KAFKA_TOPIC_TRACK_LOG, data)
    }
}
