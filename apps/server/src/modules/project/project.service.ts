import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Tracking } from '@/modules/tracking/entities/tracking.entity'
import { Project } from './entities/project.entity'

@Injectable()
export class ProjectService extends TypeOrmCrudService<Project> {
    constructor(
        @InjectRepository(Project) repo: Repository<Project>,
        private dataSource: DataSource,
    ) {
        super(repo)
    }

    async initProject() {
        const defaultData = [
            {
                projectName: '模拟真实项目埋点',
                projectDesc: '测试项目为开源vue播放器',
                projectUrl: 'http://localhost:5600',
            },
        ]

        const projects: Project[] = []
        defaultData.forEach((item) => {
            const project = new Project()
            project.projectName = item.projectName
            project.projectDesc = item.projectDesc
            project.projectUrl = item.projectUrl
            projects.push(project)
        })
        await this.repo.save(projects)
    }

    async deleteProject(id: number) {
        await this.repo.manager.transaction(async (transactionalManager: EntityManager) => {
            const trackingList = await transactionalManager.find(Tracking, {
                where: {
                    projectId: id,
                },
            })

            for (const tracking of trackingList) {
                await transactionalManager.delete(Tracking, tracking.id)
            }

            await transactionalManager.delete(Project, id)
        })
    }
}
