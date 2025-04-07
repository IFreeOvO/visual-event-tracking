import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { Public } from './decorators/public.decorator'

@Controller()
export class AppController {
    constructor(public readonly service: AppService) {}

    @Get('ping')
    @Public()
    ping(): string {
        return 'pong'
    }
}
