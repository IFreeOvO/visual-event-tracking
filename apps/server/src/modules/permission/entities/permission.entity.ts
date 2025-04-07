import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm'
import { PermissionStatusEnum, PermissionTypeEnum, TableEnum } from '@/constants/global.constant'
import { Menu } from '@/modules/menu/entities/menu.entity'
import { Role } from '@/modules/role/entities/role.entity'
import { Subject } from '@/modules/subject/entities/subject.entity'

@Entity({
    name: TableEnum.Permission,
})
export class Permission {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
        comment: '权限编码',
    })
    permissionCode: string

    @Column({
        type: 'varchar',
        comment: '权限类型',
        default: PermissionTypeEnum.Api,
    })
    permissionType: PermissionTypeEnum

    @Column({
        comment: '权限关联id',
    })
    permissionRelationId: number

    @Column({
        type: 'varchar',
        comment: '状态',
        default: PermissionStatusEnum.Enabled,
    })
    status: PermissionStatusEnum

    @JoinColumn()
    @OneToOne(() => Subject, (subject) => subject.permission, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    subject: Relation<Subject>

    @JoinColumn()
    @OneToOne(() => Menu, (menu) => menu.permission, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    menu: Relation<Menu>

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Relation<Role[]>
}
