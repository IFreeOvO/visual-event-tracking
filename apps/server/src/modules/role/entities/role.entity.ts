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
import { RoleStatusEnum, TableEnum } from '@/constants/global.constant'
import { Permission } from '@/modules/permission/entities/permission.entity'
import { User } from '@/modules/user/entities/user.entity'

const TableName = TableEnum.Role

@Entity({
    name: TableName,
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20,
        comment: '角色名',
    })
    roleName: string

    @Column({
        length: 200,
        comment: '角色描述',
        nullable: true,
    })
    roleDesc: string

    @Column({
        length: 50,
        comment: '角色编码',
        unique: true,
    })
    roleCode: string

    @Column({
        type: 'varchar',
        comment: '角色状态:1-启用,2-禁用',
        default: RoleStatusEnum.Enabled,
    })
    status: RoleStatusEnum

    @Exclude()
    @CreateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    createTime: Date

    @Exclude()
    @UpdateDateColumn()
    @Transform(({ value }) => dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss'))
    updateTime: Date

    @ManyToMany(() => Permission, (permission) => permission.roles, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'role_permissions',
    })
    permissions: Relation<Permission[]>

    @ManyToMany(() => User, (user) => user.roles)
    users: Relation<User[]>
}
