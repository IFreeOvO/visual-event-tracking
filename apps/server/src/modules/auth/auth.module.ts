import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '@/modules/user/user.module'
import { EmailModule } from '@/providers/email/email.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/auth.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
    imports: [PassportModule, UserModule, EmailModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
