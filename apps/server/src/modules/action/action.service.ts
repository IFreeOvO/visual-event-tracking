import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { EntityManager, In, Repository } from 'typeorm'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { Role } from '@/modules/role/entities/role.entity'
import { Subject } from '@/modules/subject/entities/subject.entity'
import { Action } from './entities/action.entity'

@Injectable()
export class ActionService extends TypeOrmCrudService<Action> {
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>

    constructor(@InjectRepository(Action) repo: Repository<Action>) {
        super(repo)
    }

    async initActions() {
        const defaultData = [
            {
                actionName: 'create',
                actionDesc: '新增',
            },
            {
                actionName: 'delete',
                actionDesc: '删除',
            },
            {
                actionName: 'update',
                actionDesc: '编辑',
            },
            {
                actionName: 'read',
                actionDesc: '查看',
            },
        ]

        const actionList: Action[] = []
        defaultData.forEach((item) => {
            const action = new Action()
            action.actionName = item.actionName
            action.actionDesc = item.actionDesc
            actionList.push(action)
        })
        await this.repo.save(actionList)
    }

    async deleteAction(id: number) {
        await this.repo.manager.transaction(async (transactionalManager: EntityManager) => {
            // 获取行为关联的所有权限
            const subjects = await transactionalManager.find(Subject, {
                where: { action: { id } },
            })
            const subjectIds = subjects.map((subject) => subject.id)
            const permissions = await transactionalManager.find(Permission, {
                where: { subject: { id: In(subjectIds) } },
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

            // 解除角色和权限的关联
            for (const role of roleList) {
                role.permissions = role.permissions.filter((p) => !permissionIds.includes(p.id))
                await transactionalManager.save(Role, role)
            }

            await transactionalManager.delete(Action, id)
        })
    }
}
