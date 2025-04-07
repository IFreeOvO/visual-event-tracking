import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { TableEnum } from '@/constants/global.constant'
import { Tracking } from '@/modules/tracking/entities/tracking.entity'

@Entity({
    name: TableEnum.Project,
})
export class Project {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20,
        comment: '项目名称',
        unique: true,
    })
    projectName: string

    @Column({
        comment: '项目描述',
        length: 100,
        nullable: true,
    })
    projectDesc: string

    @Column({
        comment: '项目地址',
    })
    projectUrl: string

    @OneToMany(() => Tracking, (tracking) => tracking.projectId, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    trackingList: Tracking[]
}
