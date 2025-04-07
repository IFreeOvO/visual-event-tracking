import { Injectable, NestMiddleware } from '@nestjs/common'
import helmet from 'helmet'

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
    private helmet: any

    constructor() {
        this.helmet = helmet()
    }

    use(req: Request, resp: Response, next: () => void) {
        this.helmet(req, resp, next)
    }
}
