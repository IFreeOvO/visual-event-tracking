import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Action } from '@/modules/action/entities/action.entity'
import { Subject } from './entities/subject.entity'
import { SubjectController } from './subject.controller'
import { SubjectService } from './subject.service'

@Module({
    imports: [TypeOrmModule.forFeature([Subject, Action])],
    controllers: [SubjectController],
    providers: [SubjectService],
    exports: [SubjectService],
})
export class SubjectModule {}
