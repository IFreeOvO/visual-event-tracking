import { Injectable, Inject } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
    @Inject('REDIS')
    private redisClient: RedisClientType

    async get(key: string) {
        return await this.redisClient.get(key)
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value)

        if (ttl) {
            await this.redisClient.expire(key, ttl)
        }
    }
}
