import { Exclude, Transform } from 'class-transformer'
import dayjs from 'dayjs'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from 'typeorm'
import { EventTypeEnum, SiblingEffectiveEnum, TableEnum } from '@/constants/global.constant'
import { Project } from './project.entity'
import { TrackingDatasource } from './tracking-datasource.entity'

@Entity({
    name: TableEnum.Tracking,
})
export class Tracking {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        comment: '事件名称',
    })
    eventName: string

    @Column({
        comment: '埋点页面地址',
    })
    url: string

    @Column({
        comment: '埋点元素的xpath',
    })
    xpath: string

    @Column({
        comment: '验证xpath是否正确命中的标记',
    })
    validationMarker: string

    @Column({
        comment: '埋点事件类型',
        type: 'simple-array',
        transformer: {
            to: (value: EventTypeEnum[]) => value,
            from: (value: string[]) => {
                return value.map((v) => Number(v) as EventTypeEnum)
            },
        },
    })
    eventType: EventTypeEnum[]

    @Column({
        type: 'int',
        comment: '同级元素是否生效',
        default: SiblingEffectiveEnum.No,
    })
    isSiblingEffective: SiblingEffectiveEnum

    @Column({
        comment: '埋点元素快照',
    })
    snapshot: string

    @Exclude()
    @CreateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    createTime: Date

    @Exclude()
    @UpdateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    updateTime: Date

    @OneToMany(() => TrackingDatasource, (trackingDatasource) => trackingDatasource.trackingId, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    datasource: Relation<TrackingDatasource>

    @ManyToOne(() => Project, (project) => project.trackingList)
    @JoinColumn({ name: 'projectId' })
    @Column()
    projectId: number
}
