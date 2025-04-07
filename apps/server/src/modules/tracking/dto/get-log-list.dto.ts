import { Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class LogListFilter {
    @IsOptional()
    eventName: string

    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === '' || value === null) {
            return undefined
        }
        return Number(value)
    })
    eventType: number

    @IsOptional()
    eventTime: string[]

    @IsOptional()
    url: string

    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === '' || value === null) {
            return undefined
        }
        return Number(value)
    })
    projectId: number
}

export class GetLogListDto {
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    page: number

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    limit: number

    @IsObject()
    @IsOptional()
    @Type(() => LogListFilter)
    filter: LogListFilter

    @IsString()
    @IsOptional()
    sort: string
}
