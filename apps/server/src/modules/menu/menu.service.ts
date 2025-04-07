import type { CrudRequest } from '@nestjsx/crud'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { cloneDeep } from 'lodash'
import { EntityManager, In, Repository } from 'typeorm'
import { LayoutEnum, VisibleStatusEnum } from '@/constants/global.constant'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { Role } from '@/modules/role/entities/role.entity'
import { normalizedQueryResult } from '@/shared/normalized-query-result'
import { Menu } from './entities/menu.entity'

type CrudSearchType = CrudRequest['parsed']['search']

@Injectable()
export class MenuService extends TypeOrmCrudService<Menu> {
    constructor(@InjectRepository(Menu) repo: Repository<Menu>) {
        super(repo)
    }

    async initMenus() {
        const parentMenuList: Partial<Menu>[] = [
            {
                name: '首页',
                icon: 'HomeOutlined',
                path: '/home',
                componentName: 'home',
                parentId: 0,
                order: 1,
            },
            {
                name: '系统管理',
                icon: 'AppstoreOutlined',
                parentId: 0,
                path: 'system',
                order: 2,
            },
            {
                name: '项目埋点',
                icon: 'DotChartOutlined',
                path: 'tracking',
                parentId: 0,
                order: 3,
            },
            {
                name: '埋点编辑器',
                componentName: 'editor-page',
                path: 'tracking/editor/:id',
                parentId: 0,
                order: 1,
                visibleStatus: VisibleStatusEnum.Invisible,
                layout: LayoutEnum.Blank,
            },
            {
                name: '埋点验证',
                componentName: 'validation',
                path: 'tracking/validation/:id',
                parentId: 0,
                order: 1,
                visibleStatus: VisibleStatusEnum.Invisible,
                layout: LayoutEnum.Blank,
            },
        ]
        await this.repo.save(parentMenuList)

        const systemMenu = await this.repo.findOne({
            where: {
                name: '系统管理',
            },
        })
        const systemMenuList: Partial<Menu>[] = [
            {
                name: '用户管理',
                componentName: 'user-manage',
                path: 'user-manage',
                parentId: systemMenu.id,
                order: 1,
            },
            {
                name: '角色管理',
                componentName: 'role-manage',
                path: 'role-manage',
                parentId: systemMenu.id,
                order: 1,
            },
            {
                name: '权限管理',
                componentName: 'permission-manage',
                path: 'permission-manage',
                parentId: systemMenu.id,
                order: 1,
            },
            {
                name: '菜单管理',
                componentName: 'menu-manage',
                path: 'menu-manage',
                parentId: systemMenu.id,
                order: 1,
            },
            {
                name: '功能管理',
                componentName: 'feature-manage',
                path: 'feature-manage',
                parentId: systemMenu.id,
                order: 1,
            },
            {
                name: '行为管理',
                componentName: 'action-manage',
                path: 'action-manage',
                parentId: systemMenu.id,
                order: 1,
            },
        ]
        await this.repo.save(systemMenuList)

        const tracingMenu = await this.repo.findOne({
            where: {
                name: '项目埋点',
            },
        })
        const tracingMenuList: Partial<Menu>[] = [
            {
                name: '项目配置',
                componentName: 'project-config',
                path: 'project-config',
                parentId: tracingMenu.id,
                order: 1,
            },
            {
                name: '日志查询',
                componentName: 'log-query',
                path: 'log-query',
                parentId: tracingMenu.id,
                order: 1,
            },
        ]
        await this.repo.save(tracingMenuList)
    }

    async getMenuWithChildren(crudReq: CrudRequest) {
        const modifiedReq = buildParentMenuRequest(crudReq)
        let parentResult = await this.getMany(modifiedReq)

        // 如果分页了，parentResult返回的是对象，反之返回的是数组或undefined。所以需要对parentResult进行归一化
        parentResult = normalizedQueryResult(parentResult)

        if (parentResult.data.length === 0) {
            return parentResult
        }

        // 拼接二级菜单
        const childReq = buildChildMenuRequest(crudReq, parentResult.data)
        const childResult = (await this.getMany(childReq)) as Menu[]
        if (!childResult) {
            return parentResult
        }

        rebuildMenu(parentResult.data, childResult)
        return parentResult
    }

    async deleteMenu(id: number) {
        await this.repo.manager.transaction(async (transactionalManager: EntityManager) => {
            const pendingDeleteMenu = await transactionalManager.findOne(Menu, {
                where: { id },
            })

            // 如果是父级菜单，需要把子菜单一起删除
            const isParentMenu = pendingDeleteMenu.parentId === 0
            if (isParentMenu) {
                const childMenus = await this.repo.find({
                    where: { parentId: id },
                })
                if (childMenus.length > 0) {
                    // 解除子菜单中，角色和权限的关联
                    const childMenusIds = childMenus.map((menu) => menu.id)
                    await this.detachRolePermission(childMenusIds, transactionalManager)
                    await transactionalManager.delete(Menu, childMenusIds)
                }
            }
            // 解除当前菜单中，角色和权限的关联
            await this.detachRolePermission([pendingDeleteMenu.id], transactionalManager)
            await transactionalManager.delete(Menu, id)
        })
    }

    // 解除角色和权限的关联
    async detachRolePermission(menuIds: number[], transactionalManager: EntityManager) {
        const permissions = await transactionalManager.find(Permission, {
            where: { menu: { id: In(menuIds) } },
            relations: ['roles', 'roles.permissions'],
        })

        // 找到与权限关联的、去重后的角色
        const roleMap = new Map<number, Role>()
        permissions.forEach((permission) => {
            permission.roles.forEach((role) => {
                roleMap.set(role.id, role)
            })
        })

        const permissionIds = permissions.map((permission) => permission.id)
        const roleList = Array.from(roleMap.values())

        for (const role of roleList) {
            role.permissions = role.permissions.filter((p) => !permissionIds.includes(p.id))
            await transactionalManager.save(Role, role)
        }
    }
}

function buildParentMenuRequest(originalReq: CrudRequest): CrudRequest {
    const newReq = cloneDeep(originalReq)

    // 前端会传入order排序，但是order值可以重复，可能会出现相同的记录在不同的分页中出现多次。所以再用id排序一次，保证唯一性
    newReq.parsed.sort.push({
        field: 'id',
        order: 'ASC',
    })

    newReq.parsed.search = addSearchCondition(newReq.parsed.search, {
        parentId: { eq: 0 },
    })

    return newReq
}

function buildChildMenuRequest(originalReq: CrudRequest, parentMenus: Menu[]): CrudRequest {
    const parentIds = parentMenus.map((p) => p.id)
    const modifiedReq = cloneDeep(originalReq)

    modifiedReq.parsed.page = 1
    modifiedReq.parsed.limit = 0
    modifiedReq.parsed.sort = [
        {
            field: 'order',
            order: 'ASC',
        },
        {
            field: 'id',
            order: 'ASC',
        },
    ]

    modifiedReq.parsed.search = addSearchCondition(undefined, {
        parentId: { in: parentIds },
    })

    return modifiedReq
}

function addSearchCondition(
    search: CrudSearchType,
    condition: Record<string, any>,
): CrudSearchType {
    const newSearch = search ?? { $and: [] }
    if (!newSearch.$and) {
        newSearch.$and = []
    }
    newSearch.$and.push(condition)
    return newSearch
}

function rebuildMenu(parentMenus: Menu[], childMenus: Menu[]): Menu[] {
    const parentMap = new Map<number, Menu>()
    parentMenus.forEach((parentMenu) => {
        parentMap.set(parentMenu.id, parentMenu)
    })

    childMenus.forEach((childMenu) => {
        const parentMenu = parentMap.get(childMenu.parentId)
        if (parentMenu) {
            if (!parentMenu.children) {
                parentMenu.children = []
            }
            parentMenu.children.push(childMenu)
        }
    })

    return parentMenus
}
