import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TableEnum } from '@/constants/global.constant'
import { Subject } from '@/modules/subject/entities/subject.entity'

@Entity({
    name: TableEnum.Action,
})
export class Action {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        comment: '行为名称',
        unique: true,
    })
    actionName: string

    @Column({
        comment: '行为描述',
    })
    actionDesc: string

    @OneToMany(() => Subject, (subject) => subject.action)
    subjectId: number
}
