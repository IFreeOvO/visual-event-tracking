import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { LayoutEnum, TableEnum, VisibleStatusEnum } from '@/constants/global.constant'
import { Permission } from '@/modules/permission/entities/permission.entity'

@Entity({
    name: TableEnum.Menu,
})
export class Menu {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 20,
        comment: '菜单名称',
        unique: true,
    })
    name: string

    @Column({
        comment: '父级菜单id',
    })
    parentId: number

    @Column({
        length: 100,
        comment: '组件名称',
        nullable: true,
        default: '',
    })
    componentName: string

    @Column({
        length: 100,
        comment: '路径',
        nullable: true,
        default: '',
    })
    path: string

    @Column({
        length: 100,
        comment: '图标',
        nullable: true,
        default: '',
    })
    icon: string

    @Column({
        comment: '布局',
        nullable: true,
        type: 'varchar',
        default: LayoutEnum.Default,
    })
    layout: LayoutEnum

    @Column({
        comment: '排序',
    })
    order: number

    @Column({
        comment: '显示状态',
        type: 'varchar',
        nullable: true,
        default: VisibleStatusEnum.Visible,
    })
    visibleStatus: VisibleStatusEnum

    children: Menu[]

    @OneToOne(() => Permission, (permission) => permission.menu)
    permission: Relation<Permission>
}
