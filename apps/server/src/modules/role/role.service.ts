import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { In, Repository } from 'typeorm'
import { PermissionTypeEnum, RoleStatusEnum } from '@/constants/global.constant'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { CreateRolePermissionsDto } from './dto/create-role-permissions.dto'
import { Role } from './entities/role.entity'

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>

    constructor(@InjectRepository(Role) repo: Repository<Role>) {
        super(repo)
    }

    async saveRolePermissions(createRolePermissionsDto: CreateRolePermissionsDto): Promise<Role> {
        const { roleId, permissionIds, type } = createRolePermissionsDto
        const role = await this.repo.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        })
        const otherPermissions = role.permissions.filter((item) => item.permissionType !== type)

        // 删除当前类型权限，保留其他类型权限
        if (permissionIds.length === 0) {
            role.permissions = otherPermissions
            return await this.repo.save(role)
        }

        const permissions = await this.permissionRepository.find({
            where: { id: In(permissionIds) },
        })

        if (permissions.length !== permissionIds.length) {
            throw new BadRequestException('入参包含不存在的权限')
        }

        role.permissions = [...otherPermissions, ...permissions]
        return await this.repo.save(role)
    }

    async getRolePermissions(roleId: number, type: PermissionTypeEnum) {
        const role = await this.repo.findOne({
            where: { id: roleId },
            relations: ['permissions'],
        })
        const permissions = role.permissions.filter((item) => item.permissionType === type)
        return permissions
    }

    async getApiPermissionByRoleCodes(roleCodes: string[]) {
        const roles = await this.repo.find({
            where: {
                roleCode: In(roleCodes),
            },
            relations: ['permissions'],
        })

        const permissions: Permission[] = []
        const permissionMap: Record<string, Permission> = {}
        roles.forEach((role) => {
            role.permissions.forEach((permission) => {
                if (!permissionMap[permission.permissionCode]) {
                    permissionMap[permission.permissionCode] = permission
                    permissions.push(permission)
                }
            })
        })
        const permissionIds = permissions
            .filter((item) => item.permissionType === PermissionTypeEnum.Api)
            .map((item) => item.id)

        const subjects = await this.permissionRepository.find({
            where: {
                id: In(permissionIds),
            },
            relations: ['subject'],
        })
        const subjectCodes = subjects.map((item) => item.subject.subjectCode)
        return subjectCodes
    }

    async initRole() {
        const adminRole = new Role()
        adminRole.roleName = '管理员'
        adminRole.roleDesc = '拥有所有权限'
        adminRole.roleCode = 'admin'
        adminRole.status = RoleStatusEnum.Enabled

        const permissions = await this.permissionRepository.find()
        adminRole.permissions = permissions

        await this.repo.save(adminRole)
    }
}
