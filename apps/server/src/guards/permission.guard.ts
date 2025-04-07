import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_METADATA, UserStatusEnum } from '@/constants/global.constant'
import { JwtPayload } from '@/modules/auth/auth.interface'
import { RoleService } from '@/modules/role/role.service'

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        @Inject(Reflector) private reflector: Reflector,
        private readonly roleService: RoleService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissionCodes = this.reflector.getAllAndOverride<string[]>(PERMISSION_METADATA, [
            context.getClass(),
            context.getHandler(),
        ])

        if (!permissionCodes) {
            return true
        }

        const req = context.switchToHttp().getRequest()
        const user: JwtPayload = req.user
        if (!user || user.status === UserStatusEnum.Disabled) {
            return false
        }

        const permissions = await this.roleService.getApiPermissionByRoleCodes(user.roleCodes)
        return permissionCodes.every((permissionCode) => permissions.includes(permissionCode))
    }
}
