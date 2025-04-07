import { readdirSync } from 'fs'
import { join } from 'path'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { EntityManager, Repository } from 'typeorm'
import { Action } from '@/modules/action/entities/action.entity'
import { Role } from '@/modules/role/entities/role.entity'
import { Permission } from '../permission/entities/permission.entity'
import { CreateSubjectActionsDto } from './dto/create-subject-actions.dto'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { Subject } from './entities/subject.entity'

@Injectable()
export class SubjectService extends TypeOrmCrudService<Subject> {
    @InjectRepository(Action)
    private actionRepository: Repository<Action>

    constructor(@InjectRepository(Subject) repo: Repository<Subject>) {
        super(repo)
    }

    async create(createdSubject: CreateSubjectDto) {
        const action = await this.actionRepository.findOne({
            where: { id: createdSubject.actionId },
        })

        const subject = new Subject()
        Object.assign(subject, createdSubject, {
            action,
        })

        return await this.repo.save(subject)
    }

    async saveSubjectActions(createSubjectActionsDto: CreateSubjectActionsDto) {
        const { subjectId, actionId } = createSubjectActionsDto

        const subject = await this.repo.findOne({
            where: { id: subjectId },
            relations: ['action'],
        })

        const action = await this.actionRepository.findOne({
            where: { id: actionId },
        })
        subject.action = action
        return await this.repo.save(subject)
    }

    async getSubjectNames() {
        const modulesPath = join(__dirname, '..') // src/modules
        const dirs = readdirSync(modulesPath, { withFileTypes: true })
            .map((dirent) => dirent.name)
            .filter((name) => name != 'auth')

        return dirs
    }

    async initSubjects() {
        const subjectNames = await this.getSubjectNames()
        const actions = await this.actionRepository.find()

        const subjectList: Subject[] = []
        subjectNames.forEach((subject) => {
            actions.forEach((action) => {
                const item = new Subject()
                item.subjectName = subject
                item.action = action
                item.subjectCode = `${subject}:${action.actionName}`
                item.subjectDesc = `${subject}表-${action.actionDesc}`
                subjectList.push(item)
            })
        })
        await this.repo.save(subjectList)
    }

    async deleteSubject(id: number) {
        await this.repo.manager.transaction(async (transactionalManager: EntityManager) => {
            // 解除角色和权限的关联
            const permission = await transactionalManager.findOne(Permission, {
                where: { subject: { id } },
                relations: ['roles', 'roles.permissions'],
            })
            for (const role of permission.roles) {
                role.permissions = role.permissions.filter((p) => p.id !== permission.id)
                await transactionalManager.save(Role, role)
            }

            await transactionalManager.delete(Subject, id)
        })
    }
}
