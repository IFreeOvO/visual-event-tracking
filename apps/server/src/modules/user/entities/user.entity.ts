import { Exclude, Transform } from 'class-transformer'
import * as dayjs from 'dayjs'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from 'typeorm'
import { TableEnum, UserStatusEnum } from '@/constants/global.constant'
import { Role } from '@/modules/role/entities/role.entity'

@Entity({
    name: TableEnum.User,
})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 10,
        comment: '用户名',
        unique: true,
    })
    username: string

    @Column({
        length: 100,
        comment: '密码',
        default: '',
    })
    @Exclude()
    password: string

    @Column({
        comment: '邮箱',
        default: '',
        unique: true,
    })
    email: string

    @Column({
        comment: '用户状态:1-启用,2-禁用',
        type: 'varchar',
        default: UserStatusEnum.Enabled,
    })
    status: UserStatusEnum

    @Exclude()
    @CreateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    createTime: Date

    @Exclude()
    @UpdateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    updateTime: Date

    @ManyToMany(() => Role, (role) => role.users, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'user_roles',
    })
    roles: Relation<Role[]>
}
