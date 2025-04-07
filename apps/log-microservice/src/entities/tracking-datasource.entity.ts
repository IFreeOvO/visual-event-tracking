import { Exclude, Transform } from 'class-transformer'
import dayjs from 'dayjs'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { RuleRequiredEnum, TableEnum } from '@/constants/global.constant'
import { Tracking } from './tracking.entity'

@Entity({
    name: TableEnum.TrackingDatasource,
})
export class TrackingDatasource {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        comment: '字段名称',
    })
    fieldName: string

    @Column({
        comment: '数据来源元素的xpath',
    })
    fieldXpath: string

    @Column({
        comment: '数据来源元素的快照',
    })
    fieldSnapshot: string

    @Column({
        comment: '验证规则',
        nullable: true,
    })
    reg: string

    @Column({
        comment: '是否必传',
        type: 'int',
        nullable: true,
        default: RuleRequiredEnum.NO,
    })
    isRequired: RuleRequiredEnum

    @Exclude()
    @CreateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    createTime: Date

    @Exclude()
    @UpdateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    updateTime: Date

    @ManyToOne(() => Tracking, (tracking) => tracking.datasource, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'trackingId' })
    @Column()
    trackingId: number
}
