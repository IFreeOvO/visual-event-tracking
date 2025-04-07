import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Project } from './entities/project.entity'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService],
})
export class ProjectModule {}
