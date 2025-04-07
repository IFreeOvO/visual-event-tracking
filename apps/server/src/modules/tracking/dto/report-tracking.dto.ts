import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class ReportTrackingDto {
    @ApiProperty({ description: '事件id' })
    @IsNotEmpty()
    eventId: string

    @ApiProperty({ description: '事件类型' })
    @IsNotEmpty()
    eventType: string

    // 因为列表元素的埋点，只靠eventId无法确定是哪个元素。所以需要传入xpath
    @ApiProperty({ description: '埋点元素xpath' })
    @IsNotEmpty()
    xpath: string

    @ApiProperty({ description: '数据' })
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value)
            } catch {
                return value
            }
        }
        return value
    })
    data: Record<string, any>
}
