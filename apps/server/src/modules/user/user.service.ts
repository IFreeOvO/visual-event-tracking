import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import * as argon2 from 'argon2'
import { In, Repository } from 'typeorm'
import {
    OrderEnum,
    PermissionStatusEnum,
    PermissionTypeEnum,
    RoleStatusEnum,
    UserStatusEnum,
} from '@/constants/global.constant'
import { ActionService } from '@/modules/action/action.service'
import { RegisterUserDto } from '@/modules/auth/dto/register-user.dto'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { MenuService } from '@/modules/menu/menu.service'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { PermissionService } from '@/modules/permission/permission.service'
import { ProjectService } from '@/modules/project/project.service'
import { Role } from '@/modules/role/entities/role.entity'
import { SubjectService } from '@/modules/subject/subject.service'
import { RoleService } from '../role/role.service'
import { CreateUserRoleDto } from './dto/create-user-role.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
    @InjectRepository(Role)
    private roleRepository: Repository<Role>

    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>

    constructor(
        @InjectRepository(User) repo: Repository<User>,
        private readonly actionService: ActionService,
        private readonly subjectService: SubjectService,
        private readonly menuService: MenuService,
        private readonly permissionService: PermissionService,
        private readonly roleService: RoleService,
        private readonly projectService: ProjectService,
    ) {
        super(repo)
    }

    async initUsers() {
        await this.actionService.initActions()
        await this.subjectService.initSubjects()
        await this.menuService.initMenus()
        await this.permissionService.initPermissions()
        await this.roleService.initRole()
        await this.projectService.initProject()

        const admin = new User()
        admin.username = 'admin'
        admin.email = 'admin@qq.com'
        admin.password = await argon2.hash('123456')
        admin.status = UserStatusEnum.Enabled

        const testUser = new User()
        testUser.username = 'test'
        testUser.email = 'test@qq.com'
        testUser.password = await argon2.hash('123456')
        testUser.status = UserStatusEnum.Enabled

        const roles = await this.roleRepository.find()
        admin.roles = roles
        testUser.roles = roles
        await this.repo.save([admin, testUser])
    }

    async findUser(username: string) {
        const user = await this.repo.findOne({
            where: { username },
            relations: ['roles', 'roles.permissions'],
        })
        return user
    }

    async findUserByEmail(email: string) {
        const user = await this.repo.findOne({
            where: { email },
            relations: ['roles', 'roles.permissions'],
        })
        return user
    }

    async create(createdUser: Omit<RegisterUserDto, 'captcha'>) {
        const newUser = new User()
        newUser.username = createdUser.username
        newUser.email = createdUser.email
        newUser.password = await argon2.hash(createdUser.password)

        const res = await this.repo.save(newUser)
        return res
    }

    async saveUserRoles(createUserRoleDto: CreateUserRoleDto) {
        const { userId, roleIds } = createUserRoleDto

        const user = await this.repo.findOne({
            where: { id: userId },
            relations: ['roles'],
        })

        const roles = (
            await this.roleRepository.findBy({
                id: In(roleIds),
            })
        ).filter((role) => role.status === RoleStatusEnum.Enabled)

        if (roles.length !== roleIds.length) {
            throw new BadRequestException('入参角色不存在或被禁用')
        }

        user.roles = roles
        return await this.repo.save(user)
    }

    async updateUser(userId: number, updatedData: any) {
        const user = await this.repo.findOne({
            where: { id: userId },
            relations: ['roles'],
        })

        const { status, email, roles: roleIds } = updatedData

        const roles = (
            await this.roleRepository.findBy({
                id: In(roleIds),
            })
        ).filter((role) => role.status === RoleStatusEnum.Enabled)

        if (roles.length !== roleIds.length) {
            throw new BadRequestException('入参包含不存在或被禁用的角色')
        }

        Object.assign(user, {
            status,
            email,
            roles,
        })

        return this.repo.save(user)
    }

    async getUserMenu(userId: number) {
        const user = await this.repo.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions', 'roles.permissions.menu'],
        })

        // 获取用户去重后的菜单权限
        const permissionMap = new Map<number, Permission>()
        user.roles.forEach((role) => {
            role.permissions.forEach((permission) => {
                const isMenuPermission = permission.permissionType === PermissionTypeEnum.Menu
                const isEnabledPermission = permission.status === PermissionStatusEnum.Enabled
                if (!permissionMap.has(permission.id) && isMenuPermission && isEnabledPermission) {
                    permissionMap.set(permission.id, permission)
                }
            })
        })
        const uniquePermissions: Permission[] = Array.from(permissionMap.values())

        // 根据权限转菜单
        const menus = uniquePermissions.map((item) => item.menu)

        // 获取所有菜单的id
        const menuIds = new Set<number>()
        menus.forEach((menu) => {
            menuIds.add(menu.id)
        })

        const userMenus = await this.menuRepository.find({
            where: {
                id: In(Array.from(menuIds)),
            },
            order: {
                parentId: OrderEnum.ASC, // 为了让父级菜单排前面
                order: OrderEnum.ASC,
            },
        })

        // 过滤掉没有父级菜单的子菜单
        const validMenus = userMenus.filter((menu) => {
            const isParentMenu = menu.parentId === 0
            if (!isParentMenu) {
                const isExistParentMenu = userMenus.some((v) => v.id === menu.parentId)
                return isExistParentMenu
            }
            return true
        })

        return validMenus
    }
}
