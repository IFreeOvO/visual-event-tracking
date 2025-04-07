import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { Role } from './entities/role.entity'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

@Module({
    imports: [TypeOrmModule.forFeature([Role, Menu, Permission])],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
