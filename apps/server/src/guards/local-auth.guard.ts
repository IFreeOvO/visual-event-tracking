import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    handleRequest(err: Error, user: any) {
        if (err) {
            throw err
        }
        return user
    }
}
