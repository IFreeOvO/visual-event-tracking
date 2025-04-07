import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { Role } from '@/modules/role/entities/role.entity'
import { Subject } from '@/modules/subject/entities/subject.entity'
import { Permission } from './entities/permission.entity'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

@Module({
    imports: [TypeOrmModule.forFeature([Permission, Menu, Subject, Role])],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
