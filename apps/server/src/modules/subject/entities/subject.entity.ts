import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { TableEnum } from '@/constants/global.constant'
import { Action } from '@/modules/action/entities/action.entity'
import { Permission } from '@/modules/permission/entities/permission.entity'

@Entity({
    name: TableEnum.Subject,
})
export class Subject {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        comment: '功能模块',
    })
    subjectName: string

    @Column({
        comment: '功能编码',
        unique: true,
    })
    subjectCode: string

    @Column({
        comment: '功能描述',
    })
    subjectDesc: string

    @ManyToOne(() => Action, (action) => action.subjectId, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    action: Relation<Action>

    @OneToOne(() => Permission, (permission) => permission.subject)
    permission: Relation<Permission>
}
