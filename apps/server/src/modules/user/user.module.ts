import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ActionModule } from '@/modules/action/action.module'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { MenuModule } from '@/modules/menu/menu.module'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { PermissionModule } from '@/modules/permission/permission.module'
import { ProjectModule } from '@/modules/project/project.module'
import { Role } from '@/modules/role/entities/role.entity'
import { RoleModule } from '@/modules/role/role.module'
import { SubjectModule } from '@/modules/subject/subject.module'
import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Permission, Menu]),
        RoleModule,
        PermissionModule,
        MenuModule,
        SubjectModule,
        ActionModule,
        ProjectModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
