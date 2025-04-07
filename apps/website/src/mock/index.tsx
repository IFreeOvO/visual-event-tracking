import { faker } from '@faker-js/faker/locale/zh_CN'
import { HttpStatusCode } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { axiosInstance } from '@/api/request/axios'
import { RoleStatusEnum } from '@/constants/enums'

const total = 50

if (import.meta.env.MODE === 'mock') {
    const mock = new MockAdapter(axiosInstance)
    generateMockData(mock)
}

function generateMockData(mock: MockAdapter) {
    // Auth 相关接口
    mock.onPost('/auth/login').reply(() => {
        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    accessToken: faker.string.alphanumeric(32),
                    user: {
                        id: faker.number.int(100),
                        username: faker.internet.userName(),
                    },
                },
            },
        ]
    })

    mock.onPost('/auth/register').reply(() => {
        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    id: faker.number.int(100),
                    username: faker.internet.userName(),
                    email: faker.internet.email(),
                    createdAt: faker.date.past().toISOString(),
                    updatedAt: faker.date.past().toISOString(),
                },
            },
        ]
    })

    mock.onGet('/user/menu').reply(() => {
        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: [
                    {
                        id: 1,
                        name: '首页',
                        parentId: 0,
                        componentName: 'home',
                        path: '/home',
                        icon: 'HomeOutlined',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 4,
                        name: '埋点编辑器',
                        parentId: 0,
                        componentName: 'editor-page',
                        path: 'tracking/editor/:id',
                        icon: '',
                        layout: '1',
                        order: 1,
                        visibleStatus: '0',
                    },
                    {
                        id: 5,
                        name: '埋点验证',
                        parentId: 0,
                        componentName: 'validation',
                        path: 'tracking/validation/:id',
                        icon: '',
                        layout: '1',
                        order: 1,
                        visibleStatus: '0',
                    },
                    {
                        id: 2,
                        name: '系统管理',
                        parentId: 0,
                        componentName: '',
                        path: 'system',
                        icon: 'AppstoreOutlined',
                        layout: '0',
                        order: 2,
                        visibleStatus: '1',
                    },
                    {
                        id: 3,
                        name: '项目埋点',
                        parentId: 0,
                        componentName: '',
                        path: 'tracking',
                        icon: 'DotChartOutlined',
                        layout: '0',
                        order: 3,
                        visibleStatus: '1',
                    },
                    {
                        id: 11,
                        name: '行为管理',
                        parentId: 2,
                        componentName: 'action-manage',
                        path: 'action-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 7,
                        name: '角色管理',
                        parentId: 2,
                        componentName: 'role-manage',
                        path: 'role-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 6,
                        name: '用户管理',
                        parentId: 2,
                        componentName: 'user-manage',
                        path: 'user-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 8,
                        name: '权限管理',
                        parentId: 2,
                        componentName: 'permission-manage',
                        path: 'permission-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 9,
                        name: '菜单管理',
                        parentId: 2,
                        componentName: 'menu-manage',
                        path: 'menu-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 10,
                        name: '功能管理',
                        parentId: 2,
                        componentName: 'feature-manage',
                        path: 'feature-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 12,
                        name: '项目配置',
                        parentId: 3,
                        componentName: 'project-config',
                        path: 'project-config',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 13,
                        name: '日志查询',
                        parentId: 3,
                        componentName: 'log-query',
                        path: 'log-query',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                ],
            },
        ]
    })

    mock.onGet(/\/action\?.*/).reply(() => {
        const actions = Array.from({ length: total }, () => ({
            id: faker.number.int(100),
            actionName: faker.helpers.arrayElement(['新增', '删除', '修改', '查看']),
            actionDesc: faker.lorem.sentence(),
        }))

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data: actions,
                },
            },
        ]
    })

    // 角色相关接口
    mock.onGet(/\/role\?.*/).reply(() => {
        const roles = Array.from({ length: total }, () => ({
            id: faker.number.int(100),
            roleName: faker.helpers.arrayElement([
                '超级管理员',
                '系统管理员',
                '运维管理员',
                '安全管理员',
                '审计管理员',
                '普通用户',
                '访客用户',
            ]),
            roleDesc: faker.helpers.arrayElement([
                '拥有系统所有权限',
                '管理系统基础配置',
                '负责系统运维工作',
                '管理系统安全策略',
                '负责系统审计工作',
                '具有基础操作权限',
                '仅具有查看权限',
            ]),
            roleCode: faker.helpers.arrayElement([
                'super_admin',
                'sys_admin',
                'ops_admin',
                'security_admin',
                'audit_admin',
                'normal_user',
                'guest_user',
            ]),
            status: faker.helpers.arrayElement(Object.values(RoleStatusEnum)),
        }))

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data: roles,
                },
            },
        ]
    })

    mock.onGet('/permission/menu').reply(() => {
        const data = [
            {
                permissionId: 1,
                permissionCode: 'menu:1',
                permissionType: 'menu',
                permissionRelationId: 1,
                status: '1',
                title: '首页',
                key: 1,
            },
            {
                permissionId: 4,
                permissionCode: 'menu:4',
                permissionType: 'menu',
                permissionRelationId: 4,
                status: '1',
                title: '埋点编辑器',
                key: 4,
            },
            {
                permissionId: 5,
                permissionCode: 'menu:5',
                permissionType: 'menu',
                permissionRelationId: 5,
                status: '1',
                title: '埋点验证',
                key: 5,
            },
            {
                permissionId: 2,
                permissionCode: 'menu:2',
                permissionType: 'menu',
                permissionRelationId: 2,
                status: '1',
                title: '系统管理',
                key: 2,
                children: [
                    {
                        permissionId: 11,
                        permissionCode: 'menu:11',
                        permissionType: 'menu',
                        permissionRelationId: 11,
                        status: '1',
                        title: '行为管理',
                        key: 11,
                    },
                    {
                        permissionId: 7,
                        permissionCode: 'menu:7',
                        permissionType: 'menu',
                        permissionRelationId: 7,
                        status: '1',
                        title: '角色管理',
                        key: 7,
                    },
                    {
                        permissionId: 6,
                        permissionCode: 'menu:6',
                        permissionType: 'menu',
                        permissionRelationId: 6,
                        status: '1',
                        title: '用户管理',
                        key: 6,
                    },
                    {
                        permissionId: 8,
                        permissionCode: 'menu:8',
                        permissionType: 'menu',
                        permissionRelationId: 8,
                        status: '1',
                        title: '权限管理',
                        key: 8,
                    },
                    {
                        permissionId: 9,
                        permissionCode: 'menu:9',
                        permissionType: 'menu',
                        permissionRelationId: 9,
                        status: '1',
                        title: '菜单管理',
                        key: 9,
                    },
                    {
                        permissionId: 10,
                        permissionCode: 'menu:10',
                        permissionType: 'menu',
                        permissionRelationId: 10,
                        status: '1',
                        title: '功能管理',
                        key: 10,
                    },
                ],
            },
            {
                permissionId: 3,
                permissionCode: 'menu:3',
                permissionType: 'menu',
                permissionRelationId: 3,
                status: '1',
                title: '项目埋点',
                key: 3,
                children: [
                    {
                        permissionId: 12,
                        permissionCode: 'menu:12',
                        permissionType: 'menu',
                        permissionRelationId: 12,
                        status: '1',
                        title: '项目配置',
                        key: 12,
                    },
                    {
                        permissionId: 13,
                        permissionCode: 'menu:13',
                        permissionType: 'menu',
                        permissionRelationId: 13,
                        status: '1',
                        title: '日志查询',
                        key: 13,
                    },
                ],
            },
        ]

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data,
            },
        ]
    })

    mock.onGet(/\/role\/\d+\/permission\/menu/).reply(() => {
        const data = [
            {
                id: 1,
                permissionCode: 'menu:1',
                permissionType: 'menu',
                permissionRelationId: 1,
                status: '1',
            },
            {
                id: 2,
                permissionCode: 'menu:2',
                permissionType: 'menu',
                permissionRelationId: 2,
                status: '1',
            },
            {
                id: 3,
                permissionCode: 'menu:3',
                permissionType: 'menu',
                permissionRelationId: 3,
                status: '1',
            },
            {
                id: 4,
                permissionCode: 'menu:4',
                permissionType: 'menu',
                permissionRelationId: 4,
                status: '1',
            },
            {
                id: 5,
                permissionCode: 'menu:5',
                permissionType: 'menu',
                permissionRelationId: 5,
                status: '1',
            },
            {
                id: 6,
                permissionCode: 'menu:6',
                permissionType: 'menu',
                permissionRelationId: 6,
                status: '1',
            },
            {
                id: 7,
                permissionCode: 'menu:7',
                permissionType: 'menu',
                permissionRelationId: 7,
                status: '1',
            },
            {
                id: 8,
                permissionCode: 'menu:8',
                permissionType: 'menu',
                permissionRelationId: 8,
                status: '1',
            },
            {
                id: 9,
                permissionCode: 'menu:9',
                permissionType: 'menu',
                permissionRelationId: 9,
                status: '1',
            },
            {
                id: 10,
                permissionCode: 'menu:10',
                permissionType: 'menu',
                permissionRelationId: 10,
                status: '1',
            },
            {
                id: 11,
                permissionCode: 'menu:11',
                permissionType: 'menu',
                permissionRelationId: 11,
                status: '1',
            },
            {
                id: 12,
                permissionCode: 'menu:12',
                permissionType: 'menu',
                permissionRelationId: 12,
                status: '1',
            },
            {
                id: 13,
                permissionCode: 'menu:13',
                permissionType: 'menu',
                permissionRelationId: 13,
                status: '1',
            },
        ]

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data,
            },
        ]
    })

    mock.onGet('/permission/subject').reply(() => {
        const data = [
            {
                title: 'action表',
                key: -14,
                children: [
                    {
                        permissionId: 14,
                        permissionCode: 'api:1',
                        permissionType: 'api',
                        permissionRelationId: 1,
                        status: '1',
                        title: '新增',
                        key: 14,
                    },
                    {
                        permissionId: 15,
                        permissionCode: 'api:2',
                        permissionType: 'api',
                        permissionRelationId: 2,
                        status: '1',
                        title: '删除',
                        key: 15,
                    },
                    {
                        permissionId: 16,
                        permissionCode: 'api:3',
                        permissionType: 'api',
                        permissionRelationId: 3,
                        status: '1',
                        title: '编辑',
                        key: 16,
                    },
                    {
                        permissionId: 17,
                        permissionCode: 'api:4',
                        permissionType: 'api',
                        permissionRelationId: 4,
                        status: '1',
                        title: '查看',
                        key: 17,
                    },
                ],
            },
            {
                title: 'menu表',
                key: -18,
                children: [
                    {
                        permissionId: 18,
                        permissionCode: 'api:5',
                        permissionType: 'api',
                        permissionRelationId: 5,
                        status: '1',
                        title: '新增',
                        key: 18,
                    },
                    {
                        permissionId: 19,
                        permissionCode: 'api:6',
                        permissionType: 'api',
                        permissionRelationId: 6,
                        status: '1',
                        title: '删除',
                        key: 19,
                    },
                    {
                        permissionId: 20,
                        permissionCode: 'api:7',
                        permissionType: 'api',
                        permissionRelationId: 7,
                        status: '1',
                        title: '编辑',
                        key: 20,
                    },
                    {
                        permissionId: 21,
                        permissionCode: 'api:8',
                        permissionType: 'api',
                        permissionRelationId: 8,
                        status: '1',
                        title: '查看',
                        key: 21,
                    },
                ],
            },
            {
                title: 'permission表',
                key: -22,
                children: [
                    {
                        permissionId: 22,
                        permissionCode: 'api:9',
                        permissionType: 'api',
                        permissionRelationId: 9,
                        status: '1',
                        title: '新增',
                        key: 22,
                    },
                    {
                        permissionId: 23,
                        permissionCode: 'api:10',
                        permissionType: 'api',
                        permissionRelationId: 10,
                        status: '1',
                        title: '删除',
                        key: 23,
                    },
                    {
                        permissionId: 24,
                        permissionCode: 'api:11',
                        permissionType: 'api',
                        permissionRelationId: 11,
                        status: '1',
                        title: '编辑',
                        key: 24,
                    },
                    {
                        permissionId: 25,
                        permissionCode: 'api:12',
                        permissionType: 'api',
                        permissionRelationId: 12,
                        status: '1',
                        title: '查看',
                        key: 25,
                    },
                ],
            },
            {
                title: 'project表',
                key: -26,
                children: [
                    {
                        permissionId: 26,
                        permissionCode: 'api:13',
                        permissionType: 'api',
                        permissionRelationId: 13,
                        status: '1',
                        title: '新增',
                        key: 26,
                    },
                    {
                        permissionId: 27,
                        permissionCode: 'api:14',
                        permissionType: 'api',
                        permissionRelationId: 14,
                        status: '1',
                        title: '删除',
                        key: 27,
                    },
                    {
                        permissionId: 28,
                        permissionCode: 'api:15',
                        permissionType: 'api',
                        permissionRelationId: 15,
                        status: '1',
                        title: '编辑',
                        key: 28,
                    },
                    {
                        permissionId: 29,
                        permissionCode: 'api:16',
                        permissionType: 'api',
                        permissionRelationId: 16,
                        status: '1',
                        title: '查看',
                        key: 29,
                    },
                ],
            },
            {
                title: 'remote-devtool表',
                key: -30,
                children: [
                    {
                        permissionId: 30,
                        permissionCode: 'api:17',
                        permissionType: 'api',
                        permissionRelationId: 17,
                        status: '1',
                        title: '新增',
                        key: 30,
                    },
                    {
                        permissionId: 31,
                        permissionCode: 'api:18',
                        permissionType: 'api',
                        permissionRelationId: 18,
                        status: '1',
                        title: '删除',
                        key: 31,
                    },
                    {
                        permissionId: 32,
                        permissionCode: 'api:19',
                        permissionType: 'api',
                        permissionRelationId: 19,
                        status: '1',
                        title: '编辑',
                        key: 32,
                    },
                    {
                        permissionId: 33,
                        permissionCode: 'api:20',
                        permissionType: 'api',
                        permissionRelationId: 20,
                        status: '1',
                        title: '查看',
                        key: 33,
                    },
                ],
            },
            {
                title: 'role表',
                key: -34,
                children: [
                    {
                        permissionId: 34,
                        permissionCode: 'api:21',
                        permissionType: 'api',
                        permissionRelationId: 21,
                        status: '1',
                        title: '新增',
                        key: 34,
                    },
                    {
                        permissionId: 35,
                        permissionCode: 'api:22',
                        permissionType: 'api',
                        permissionRelationId: 22,
                        status: '1',
                        title: '删除',
                        key: 35,
                    },
                    {
                        permissionId: 36,
                        permissionCode: 'api:23',
                        permissionType: 'api',
                        permissionRelationId: 23,
                        status: '1',
                        title: '编辑',
                        key: 36,
                    },
                    {
                        permissionId: 37,
                        permissionCode: 'api:24',
                        permissionType: 'api',
                        permissionRelationId: 24,
                        status: '1',
                        title: '查看',
                        key: 37,
                    },
                ],
            },
            {
                title: 'subject表',
                key: -38,
                children: [
                    {
                        permissionId: 38,
                        permissionCode: 'api:25',
                        permissionType: 'api',
                        permissionRelationId: 25,
                        status: '1',
                        title: '新增',
                        key: 38,
                    },
                    {
                        permissionId: 39,
                        permissionCode: 'api:26',
                        permissionType: 'api',
                        permissionRelationId: 26,
                        status: '1',
                        title: '删除',
                        key: 39,
                    },
                    {
                        permissionId: 40,
                        permissionCode: 'api:27',
                        permissionType: 'api',
                        permissionRelationId: 27,
                        status: '1',
                        title: '编辑',
                        key: 40,
                    },
                    {
                        permissionId: 41,
                        permissionCode: 'api:28',
                        permissionType: 'api',
                        permissionRelationId: 28,
                        status: '1',
                        title: '查看',
                        key: 41,
                    },
                ],
            },
            {
                title: 'tracking表',
                key: -42,
                children: [
                    {
                        permissionId: 42,
                        permissionCode: 'api:29',
                        permissionType: 'api',
                        permissionRelationId: 29,
                        status: '1',
                        title: '新增',
                        key: 42,
                    },
                    {
                        permissionId: 43,
                        permissionCode: 'api:30',
                        permissionType: 'api',
                        permissionRelationId: 30,
                        status: '1',
                        title: '删除',
                        key: 43,
                    },
                    {
                        permissionId: 44,
                        permissionCode: 'api:31',
                        permissionType: 'api',
                        permissionRelationId: 31,
                        status: '1',
                        title: '编辑',
                        key: 44,
                    },
                    {
                        permissionId: 45,
                        permissionCode: 'api:32',
                        permissionType: 'api',
                        permissionRelationId: 32,
                        status: '1',
                        title: '查看',
                        key: 45,
                    },
                ],
            },
            {
                title: 'upload表',
                key: -46,
                children: [
                    {
                        permissionId: 46,
                        permissionCode: 'api:33',
                        permissionType: 'api',
                        permissionRelationId: 33,
                        status: '1',
                        title: '新增',
                        key: 46,
                    },
                    {
                        permissionId: 47,
                        permissionCode: 'api:34',
                        permissionType: 'api',
                        permissionRelationId: 34,
                        status: '1',
                        title: '删除',
                        key: 47,
                    },
                    {
                        permissionId: 48,
                        permissionCode: 'api:35',
                        permissionType: 'api',
                        permissionRelationId: 35,
                        status: '1',
                        title: '编辑',
                        key: 48,
                    },
                    {
                        permissionId: 49,
                        permissionCode: 'api:36',
                        permissionType: 'api',
                        permissionRelationId: 36,
                        status: '1',
                        title: '查看',
                        key: 49,
                    },
                ],
            },
            {
                title: 'user表',
                key: -50,
                children: [
                    {
                        permissionId: 50,
                        permissionCode: 'api:37',
                        permissionType: 'api',
                        permissionRelationId: 37,
                        status: '1',
                        title: '新增',
                        key: 50,
                    },
                    {
                        permissionId: 51,
                        permissionCode: 'api:38',
                        permissionType: 'api',
                        permissionRelationId: 38,
                        status: '1',
                        title: '删除',
                        key: 51,
                    },
                    {
                        permissionId: 52,
                        permissionCode: 'api:39',
                        permissionType: 'api',
                        permissionRelationId: 39,
                        status: '1',
                        title: '编辑',
                        key: 52,
                    },
                    {
                        permissionId: 53,
                        permissionCode: 'api:40',
                        permissionType: 'api',
                        permissionRelationId: 40,
                        status: '1',
                        title: '查看',
                        key: 53,
                    },
                ],
            },
        ]

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data,
            },
        ]
    })

    mock.onGet(/\/role\/\d+\/permission\/subject/).reply(() => {
        const data = [
            {
                id: 14,
                permissionCode: 'api:1',
                permissionType: 'api',
                permissionRelationId: 1,
                status: '1',
            },
            {
                id: 15,
                permissionCode: 'api:2',
                permissionType: 'api',
                permissionRelationId: 2,
                status: '1',
            },
            {
                id: 16,
                permissionCode: 'api:3',
                permissionType: 'api',
                permissionRelationId: 3,
                status: '1',
            },
            {
                id: 17,
                permissionCode: 'api:4',
                permissionType: 'api',
                permissionRelationId: 4,
                status: '1',
            },
            {
                id: 18,
                permissionCode: 'api:5',
                permissionType: 'api',
                permissionRelationId: 5,
                status: '1',
            },
            {
                id: 19,
                permissionCode: 'api:6',
                permissionType: 'api',
                permissionRelationId: 6,
                status: '1',
            },
            {
                id: 20,
                permissionCode: 'api:7',
                permissionType: 'api',
                permissionRelationId: 7,
                status: '1',
            },
            {
                id: 21,
                permissionCode: 'api:8',
                permissionType: 'api',
                permissionRelationId: 8,
                status: '1',
            },
            {
                id: 22,
                permissionCode: 'api:9',
                permissionType: 'api',
                permissionRelationId: 9,
                status: '1',
            },
            {
                id: 23,
                permissionCode: 'api:10',
                permissionType: 'api',
                permissionRelationId: 10,
                status: '1',
            },
            {
                id: 24,
                permissionCode: 'api:11',
                permissionType: 'api',
                permissionRelationId: 11,
                status: '1',
            },
            {
                id: 25,
                permissionCode: 'api:12',
                permissionType: 'api',
                permissionRelationId: 12,
                status: '1',
            },
            {
                id: 26,
                permissionCode: 'api:13',
                permissionType: 'api',
                permissionRelationId: 13,
                status: '1',
            },
            {
                id: 27,
                permissionCode: 'api:14',
                permissionType: 'api',
                permissionRelationId: 14,
                status: '1',
            },
            {
                id: 28,
                permissionCode: 'api:15',
                permissionType: 'api',
                permissionRelationId: 15,
                status: '1',
            },
            {
                id: 29,
                permissionCode: 'api:16',
                permissionType: 'api',
                permissionRelationId: 16,
                status: '1',
            },
            {
                id: 30,
                permissionCode: 'api:17',
                permissionType: 'api',
                permissionRelationId: 17,
                status: '1',
            },
            {
                id: 31,
                permissionCode: 'api:18',
                permissionType: 'api',
                permissionRelationId: 18,
                status: '1',
            },
            {
                id: 32,
                permissionCode: 'api:19',
                permissionType: 'api',
                permissionRelationId: 19,
                status: '1',
            },
            {
                id: 33,
                permissionCode: 'api:20',
                permissionType: 'api',
                permissionRelationId: 20,
                status: '1',
            },
            {
                id: 34,
                permissionCode: 'api:21',
                permissionType: 'api',
                permissionRelationId: 21,
                status: '1',
            },
            {
                id: 35,
                permissionCode: 'api:22',
                permissionType: 'api',
                permissionRelationId: 22,
                status: '1',
            },
            {
                id: 36,
                permissionCode: 'api:23',
                permissionType: 'api',
                permissionRelationId: 23,
                status: '1',
            },
            {
                id: 37,
                permissionCode: 'api:24',
                permissionType: 'api',
                permissionRelationId: 24,
                status: '1',
            },
            {
                id: 38,
                permissionCode: 'api:25',
                permissionType: 'api',
                permissionRelationId: 25,
                status: '1',
            },
            {
                id: 39,
                permissionCode: 'api:26',
                permissionType: 'api',
                permissionRelationId: 26,
                status: '1',
            },
            {
                id: 40,
                permissionCode: 'api:27',
                permissionType: 'api',
                permissionRelationId: 27,
                status: '1',
            },
            {
                id: 41,
                permissionCode: 'api:28',
                permissionType: 'api',
                permissionRelationId: 28,
                status: '1',
            },
            {
                id: 42,
                permissionCode: 'api:29',
                permissionType: 'api',
                permissionRelationId: 29,
                status: '1',
            },
            {
                id: 43,
                permissionCode: 'api:30',
                permissionType: 'api',
                permissionRelationId: 30,
                status: '1',
            },
            {
                id: 44,
                permissionCode: 'api:31',
                permissionType: 'api',
                permissionRelationId: 31,
                status: '1',
            },
            {
                id: 45,
                permissionCode: 'api:32',
                permissionType: 'api',
                permissionRelationId: 32,
                status: '1',
            },
            {
                id: 46,
                permissionCode: 'api:33',
                permissionType: 'api',
                permissionRelationId: 33,
                status: '1',
            },
            {
                id: 47,
                permissionCode: 'api:34',
                permissionType: 'api',
                permissionRelationId: 34,
                status: '1',
            },
            {
                id: 48,
                permissionCode: 'api:35',
                permissionType: 'api',
                permissionRelationId: 35,
                status: '1',
            },
            {
                id: 49,
                permissionCode: 'api:36',
                permissionType: 'api',
                permissionRelationId: 36,
                status: '1',
            },
            {
                id: 50,
                permissionCode: 'api:37',
                permissionType: 'api',
                permissionRelationId: 37,
                status: '1',
            },
            {
                id: 51,
                permissionCode: 'api:38',
                permissionType: 'api',
                permissionRelationId: 38,
                status: '1',
            },
            {
                id: 52,
                permissionCode: 'api:39',
                permissionType: 'api',
                permissionRelationId: 39,
                status: '1',
            },
            {
                id: 53,
                permissionCode: 'api:40',
                permissionType: 'api',
                permissionRelationId: 40,
                status: '1',
            },
        ]

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data,
            },
        ]
    })

    // 用户相关接口
    mock.onGet(/\/user\?.*/).reply(() => {
        const data = Array.from({ length: total }, () => ({
            id: faker.number.int(100),
            username: faker.person.firstName(),
            email: faker.internet.email(),
            status: faker.helpers.arrayElement(['0', '1']),
            roles: [
                {
                    id: faker.number.int(100),
                    roleName: faker.helpers.arrayElement([
                        '管理员',
                        '运维',
                        '开发',
                        '测试',
                        '访客',
                    ]),
                    roleDesc: faker.lorem.sentence(),
                    roleCode: faker.lorem.word(),
                    status: faker.helpers.arrayElement(['0', '1']),
                },
            ],
        }))

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data,
                },
            },
        ]
    })

    // 权限相关接口
    mock.onGet(/\/permission\?.*/).reply(() => {
        const data = Array.from({ length: total }, () => {
            const item: Record<string, any> = {
                id: faker.number.int(100),
                permissionCode: faker.lorem.word(),
                permissionType: faker.helpers.arrayElement(['api', 'menu']),
                permissionRelationId: faker.number.int(100),
                status: faker.helpers.arrayElement(['0', '1']),
            }
            if (item.permissionType === 'api') {
                item.subject = {
                    subjectDesc: faker.lorem.word(),
                }
            } else {
                item.menu = {
                    name: faker.lorem.word(),
                }
            }
            return item
        })

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data,
                },
            },
        ]
    })

    // 菜单相关接口
    mock.onGet(/\/menu\?.*/).reply(() => {
        const data = [
            {
                id: 1,
                name: '首页',
                parentId: 0,
                componentName: 'home',
                path: '/home',
                icon: 'HomeOutlined',
                layout: '0',
                order: 1,
                visibleStatus: '1',
            },
            {
                id: 4,
                name: '埋点编辑器',
                parentId: 0,
                componentName: 'editor-page',
                path: 'tracking/editor/:id',
                icon: '',
                layout: '1',
                order: 1,
                visibleStatus: '0',
            },
            {
                id: 5,
                name: '埋点验证',
                parentId: 0,
                componentName: 'validation',
                path: 'tracking/validation/:id',
                icon: '',
                layout: '1',
                order: 1,
                visibleStatus: '0',
            },
            {
                id: 2,
                name: '系统管理',
                parentId: 0,
                componentName: '',
                path: 'system',
                icon: 'AppstoreOutlined',
                layout: '0',
                order: 2,
                visibleStatus: '1',
                children: [
                    {
                        id: 6,
                        name: '用户管理',
                        parentId: 2,
                        componentName: 'user-manage',
                        path: 'user-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 7,
                        name: '角色管理',
                        parentId: 2,
                        componentName: 'role-manage',
                        path: 'role-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 8,
                        name: '权限管理',
                        parentId: 2,
                        componentName: 'permission-manage',
                        path: 'permission-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 9,
                        name: '菜单管理',
                        parentId: 2,
                        componentName: 'menu-manage',
                        path: 'menu-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 10,
                        name: '功能管理',
                        parentId: 2,
                        componentName: 'feature-manage',
                        path: 'feature-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 11,
                        name: '行为管理',
                        parentId: 2,
                        componentName: 'action-manage',
                        path: 'action-manage',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                ],
            },
            {
                id: 3,
                name: '项目埋点',
                parentId: 0,
                componentName: '',
                path: 'tracking',
                icon: 'DotChartOutlined',
                layout: '0',
                order: 3,
                visibleStatus: '1',
                children: [
                    {
                        id: 12,
                        name: '项目配置',
                        parentId: 3,
                        componentName: 'project-config',
                        path: 'project-config',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                    {
                        id: 13,
                        name: '日志查询',
                        parentId: 3,
                        componentName: 'log-query',
                        path: 'log-query',
                        icon: '',
                        layout: '0',
                        order: 1,
                        visibleStatus: '1',
                    },
                ],
            },
        ]

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    count: 5,
                    total: 5,
                    page: 1,
                    pageCount: 1,
                    data,
                },
            },
        ]
    })

    // 功能
    mock.onGet(/\/subject\?.*/).reply(() => {
        const data = Array.from({ length: total }, () => ({
            id: faker.number.int(100),
            subjectName: faker.lorem.word(),
            subjectCode: faker.lorem.word(),
            subjectDesc: faker.lorem.sentence(),
            action: {
                id: faker.number.int(100),
                actionName: faker.lorem.word(),
                actionDesc: faker.lorem.word(),
            },
        }))

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data,
                },
            },
        ]
    })

    // 项目
    mock.onGet(/\/project\?.*/).reply(() => {
        const data = Array.from({ length: total }, () => ({
            id: faker.number.int(1000),
            projectName: faker.company.name(),
            projectDesc: faker.company.catchPhrase(),
            projectUrl: faker.internet.url(),
        }))

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data,
                },
            },
        ]
    })

    // 日志
    mock.onGet(/\/tracking\/log?.*/).reply(() => {
        const data = Array.from({ length: total }, () => {
            return {
                createDate: faker.date
                    .recent({ days: 7 })
                    .toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        fractionalSecondDigits: 3,
                    })
                    .replace(/\//g, '-'),
                id: faker.number.int(100),
                eventName: faker.lorem.word(),
                eventType: faker.helpers.arrayElement([0, 1]),
                projectId: faker.number.int(100),
                url: faker.internet.url(),
                xpath: generateXPath(),
                ruleRequired: faker.number.int({ min: 0, max: 1 }),
                snapshot: faker.image.url({
                    width: 100,
                    height: 120,
                }),
                params: generateRandomParams(),
            }
        })

        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: {
                    total,
                    data,
                },
            },
        ]
    })

    mock.onAny().reply(() => {
        return [
            HttpStatusCode.Ok,
            {
                code: 200,
                data: null,
            },
        ]
    })
}

function generateXPath() {
    const tags = [
        'html',
        'body',
        'div',
        'main',
        'section',
        'article',
        'nav',
        'header',
        'footer',
        'h1',
        'h2',
        'p',
        'span',
        'button',
        'a',
    ]
    const depth = faker.number.int({ min: 1, max: 3 })
    const path = []

    for (let i = 0; i < depth; i++) {
        const tag = tags[faker.number.int({ min: 0, max: tags.length - 1 })]
        const index = faker.number.int({ min: 1, max: 3 })
        path.push(`${tag}[${index}]`)
    }

    return `/html[1]/${path.join('/')}`
}

function generateRandomParams() {
    const paramCount = faker.number.int({ min: 1, max: 3 })
    const params: Record<string, any> = {}

    for (let i = 0; i < paramCount; i++) {
        const key = faker.lorem.word()
        const valueType = faker.helpers.arrayElement(['string', 'number', 'boolean'])

        switch (valueType) {
            case 'string':
                params[key] = faker.lorem.word()
                break
            case 'number':
                params[key] = faker.number.int(10)
                break
            case 'boolean':
                params[key] = faker.datatype.boolean()
                break
        }
    }

    return JSON.stringify(params)
}
