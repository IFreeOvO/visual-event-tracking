import { Module } from '@nestjs/common'
import { ThrottlerModule as Throttler, minutes } from '@nestjs/throttler'

@Module({
    imports: [
        Throttler.forRootAsync({
            useFactory: () => ({
                errorMessage: '当前操作过于频繁，请稍后再试！',
                throttlers: [{ ttl: minutes(1), limit: 100 }],
            }),
        }),
    ],
})
export class ThrottlerModule {}
