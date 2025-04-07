import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { Repository } from 'typeorm'
import { OrderEnum, PermissionStatusEnum, PermissionTypeEnum } from '@/constants/global.constant'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { Role } from '@/modules/role/entities/role.entity'
import { Subject } from '@/modules/subject/entities/subject.entity'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { Permission } from './entities/permission.entity'

export interface PermissionTreeData {
    permissionId?: number
    key: number
    permissionCode?: string
    permissionType?: PermissionTypeEnum
    permissionRelationId?: number
    status?: PermissionStatusEnum
    title: string
    children?: PermissionTreeData[]
}

@Injectable()
export class PermissionService extends TypeOrmCrudService<Permission> {
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>

    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>

    @InjectRepository(Role)
    private roleRepository: Repository<Role>

    constructor(@InjectRepository(Permission) repo: Repository<Permission>) {
        super(repo)
    }

    async initMenuPermissions() {
        const menus = await this.menuRepository.find()
        const permissionList: Permission[] = []
        for (const menu of menus) {
            const permission = new Permission()
            permission.permissionType = PermissionTypeEnum.Menu
            permission.permissionRelationId = menu.id
            permission.permissionCode = `${permission.permissionType}:${permission.permissionRelationId}`
            permission.status = PermissionStatusEnum.Enabled
            permission.menu = menu
            permissionList.push(permission)
        }
        await this.repo.save(permissionList)
    }

    async initSubjectPermissions() {
        const subjects = await this.subjectRepository.find()
        const permissionList: Permission[] = []
        for (const subject of subjects) {
            const permission = new Permission()
            permission.permissionType = PermissionTypeEnum.Api
            permission.permissionRelationId = subject.id
            permission.permissionCode = `${permission.permissionType}:${permission.permissionRelationId}`
            permission.status = PermissionStatusEnum.Enabled
            permission.subject = subject
            permissionList.push(permission)
        }
        await this.repo.save(permissionList)
    }

    async initPermissions() {
        await this.initMenuPermissions()
        await this.initSubjectPermissions()
    }

    async create(createdPermission: CreatePermissionDto) {
        const permission = new Permission()
        Object.assign(permission, createdPermission)

        if (createdPermission.permissionType === PermissionTypeEnum.Menu) {
            const menu = await this.menuRepository.findOne({
                where: { id: createdPermission.permissionRelationId },
            })
            permission.menu = menu
        } else if (createdPermission.permissionType === PermissionTypeEnum.Api) {
            const subject = await this.subjectRepository.findOne({
                where: { id: createdPermission.permissionRelationId },
            })
            permission.subject = subject
        }

        return await this.repo.save(permission)
    }

    async getMenuPermissions() {
        const entities = await this.repo.find({
            where: {
                permissionType: PermissionTypeEnum.Menu,
            },
            relations: ['menu'],
            order: {
                menu: {
                    parentId: OrderEnum.ASC, // 为了让父级菜单排前面
                    order: OrderEnum.ASC,
                },
            },
        })

        const treeData: PermissionTreeData[] = []
        const parentNodeMap: Record<number, PermissionTreeData> = {}
        entities.forEach((entity) => {
            const node: PermissionTreeData = {
                permissionId: entity.id,
                permissionCode: entity.permissionCode,
                permissionType: entity.permissionType,
                permissionRelationId: entity.permissionRelationId,
                status: entity.status,
                title: entity.menu.name,
                key: entity.id,
            }
            const isParent = entity.menu.parentId === 0
            if (isParent) {
                parentNodeMap[entity.menu.id] = node
                treeData.push(node)
            } else {
                // 排除被禁用的子菜单
                if (entity.status === PermissionStatusEnum.Disabled) {
                    return
                }
                if (parentNodeMap[entity.menu.parentId].children) {
                    parentNodeMap[entity.menu.parentId].children.push(node)
                } else {
                    parentNodeMap[entity.menu.parentId].children = [node]
                }
            }
        })

        // 排除被禁用的父菜单
        const newTreeData = treeData.filter((item) => item.status === PermissionStatusEnum.Enabled)
        return newTreeData
    }

    async getApiPermissions() {
        const entities = await this.repo.find({
            where: { permissionType: PermissionTypeEnum.Api, status: PermissionStatusEnum.Enabled },
            relations: ['subject'],
        })

        const treeData: PermissionTreeData[] = []
        const parentNodeMap: Record<string, PermissionTreeData> = {}
        entities.forEach((entity) => {
            const subjectDescArr = entity.subject.subjectDesc.split('-')
            const tableName = subjectDescArr.slice(0, subjectDescArr.length - 1).join('-')
            const actionName = subjectDescArr[subjectDescArr.length - 1]

            const node: PermissionTreeData = {
                permissionId: entity.id,
                permissionCode: entity.permissionCode,
                permissionType: entity.permissionType,
                permissionRelationId: entity.permissionRelationId,
                status: entity.status,
                title: actionName,
                key: entity.id,
            }

            if (parentNodeMap[tableName]) {
                const parentNode = parentNodeMap[tableName]
                parentNode.children.push(node)
            } else {
                // 同一个表的行为，放到同一个父节点下
                const parentNode: PermissionTreeData = {
                    title: tableName,
                    key: -entity.id,
                    children: [node],
                }
                parentNodeMap[tableName] = parentNode
                treeData.push(parentNode)
            }
        })
        return treeData
    }
}
