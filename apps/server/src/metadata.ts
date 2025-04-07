/* eslint-disable */
export default async () => {
    const t = {
        ['./constants/global.constant']: await import('./constants/global.constant'),
        ['./modules/role/entities/role.entity']: await import(
            './modules/role/entities/role.entity'
        ),
        ['./modules/permission/entities/permission.entity']: await import(
            './modules/permission/entities/permission.entity'
        ),
        ['./modules/user/entities/user.entity']: await import(
            './modules/user/entities/user.entity'
        ),
        ['./modules/action/entities/action.entity']: await import(
            './modules/action/entities/action.entity'
        ),
        ['./modules/subject/entities/subject.entity']: await import(
            './modules/subject/entities/subject.entity'
        ),
        ['./modules/menu/entities/menu.entity']: await import(
            './modules/menu/entities/menu.entity'
        ),
        ['./modules/tracking/entities/tracking-datasource.entity']: await import(
            './modules/tracking/entities/tracking-datasource.entity'
        ),
        ['./modules/tracking/entities/tracking.entity']: await import(
            './modules/tracking/entities/tracking.entity'
        ),
        ['./modules/auth/vo/login-user.vo']: await import('./modules/auth/vo/login-user.vo'),
        ['./modules/tracking/dto/create-tracking.dto']: await import(
            './modules/tracking/dto/create-tracking.dto'
        ),
        ['./modules/tracking/dto/get-log-list.dto']: await import(
            './modules/tracking/dto/get-log-list.dto'
        ),
        ['./modules/tracking/dto/update-tracking.dto']: await import(
            './modules/tracking/dto/update-tracking.dto'
        ),
    }
    return {
        '@nestjs/swagger': {
            models: [
                [
                    import('./modules/user/entities/user.entity'),
                    {
                        User: {
                            id: { required: true, type: () => Number },
                            username: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                            email: { required: true, type: () => String },
                            status: {
                                required: true,
                                enum: t['./constants/global.constant'].UserStatusEnum,
                            },
                            createTime: { required: true, type: () => Date },
                            updateTime: { required: true, type: () => Date },
                            roles: {
                                required: true,
                                type: () => [t['./modules/role/entities/role.entity'].Role],
                            },
                        },
                    },
                ],
                [
                    import('./modules/role/entities/role.entity'),
                    {
                        Role: {
                            id: { required: true, type: () => Number },
                            roleName: { required: true, type: () => String },
                            roleDesc: { required: true, type: () => String },
                            roleCode: { required: true, type: () => String },
                            status: {
                                required: true,
                                enum: t['./constants/global.constant'].RoleStatusEnum,
                            },
                            createTime: { required: true, type: () => Date },
                            updateTime: { required: true, type: () => Date },
                            permissions: {
                                required: true,
                                type: () => [
                                    t['./modules/permission/entities/permission.entity'].Permission,
                                ],
                            },
                            users: {
                                required: true,
                                type: () => [t['./modules/user/entities/user.entity'].User],
                            },
                        },
                    },
                ],
                [
                    import('./modules/action/entities/action.entity'),
                    {
                        Action: {
                            id: { required: true, type: () => Number },
                            actionName: { required: true, type: () => String },
                            actionDesc: { required: true, type: () => String },
                            subjectId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./modules/subject/entities/subject.entity'),
                    {
                        Subject: {
                            id: { required: true, type: () => Number },
                            subjectName: { required: true, type: () => String },
                            subjectCode: { required: true, type: () => String },
                            subjectDesc: { required: true, type: () => String },
                            action: {
                                required: true,
                                type: () => t['./modules/action/entities/action.entity'].Action,
                            },
                            permission: {
                                required: true,
                                type: () =>
                                    t['./modules/permission/entities/permission.entity'].Permission,
                            },
                        },
                    },
                ],
                [
                    import('./modules/permission/entities/permission.entity'),
                    {
                        Permission: {
                            id: { required: true, type: () => Number },
                            permissionCode: { required: true, type: () => String },
                            permissionType: {
                                required: true,
                                enum: t['./constants/global.constant'].PermissionTypeEnum,
                            },
                            permissionRelationId: { required: true, type: () => Number },
                            status: {
                                required: true,
                                enum: t['./constants/global.constant'].PermissionStatusEnum,
                            },
                            subject: {
                                required: true,
                                type: () => t['./modules/subject/entities/subject.entity'].Subject,
                            },
                            menu: {
                                required: true,
                                type: () => t['./modules/menu/entities/menu.entity'].Menu,
                            },
                            roles: {
                                required: true,
                                type: () => [t['./modules/role/entities/role.entity'].Role],
                            },
                        },
                    },
                ],
                [
                    import('./modules/menu/entities/menu.entity'),
                    {
                        Menu: {
                            id: { required: true, type: () => Number },
                            name: { required: true, type: () => String },
                            parentId: { required: true, type: () => Number },
                            componentName: { required: true, type: () => String },
                            path: { required: true, type: () => String },
                            icon: { required: true, type: () => String },
                            layout: {
                                required: true,
                                enum: t['./constants/global.constant'].LayoutEnum,
                            },
                            order: { required: true, type: () => Number },
                            visibleStatus: {
                                required: true,
                                enum: t['./constants/global.constant'].VisibleStatusEnum,
                            },
                            children: {
                                required: true,
                                type: () => [t['./modules/menu/entities/menu.entity'].Menu],
                            },
                            permission: {
                                required: true,
                                type: () =>
                                    t['./modules/permission/entities/permission.entity'].Permission,
                            },
                        },
                    },
                ],
                [
                    import('./modules/role/dto/create-role-permissions.dto'),
                    {
                        CreateRolePermissionsDto: {
                            roleId: { required: true, type: () => Number },
                            permissionIds: { required: true, type: () => [Number] },
                            type: {
                                required: true,
                                enum: t['./constants/global.constant'].PermissionTypeEnum,
                            },
                        },
                    },
                ],
                [
                    import('./modules/action/dto/create-action.dto'),
                    {
                        CreateActionDto: {
                            actionName: { required: true, type: () => String },
                            actionDesc: { required: true, type: () => String },
                        },
                    },
                ],
                [import('./modules/action/dto/update-action.dto'), { UpdateActionDto: {} }],
                [
                    import('./modules/menu/dto/create-menu.dto'),
                    {
                        CreateMenuDto: {
                            name: { required: true, type: () => String, maxLength: 20 },
                            parentId: { required: true, type: () => Number },
                            componentName: { required: true, type: () => String, maxLength: 100 },
                            path: { required: true, type: () => String, maxLength: 100 },
                            icon: { required: true, type: () => String, maxLength: 100 },
                            layout: {
                                required: true,
                                enum: t['./constants/global.constant'].LayoutEnum,
                            },
                            order: { required: true, type: () => Number },
                            visibleStatus: {
                                required: true,
                                enum: t['./constants/global.constant'].VisibleStatusEnum,
                            },
                        },
                    },
                ],
                [import('./modules/menu/dto/update-menu.dto'), { UpdateMenuDto: {} }],
                [
                    import('./modules/permission/dto/create-permission.dto'),
                    {
                        CreatePermissionDto: {
                            permissionCode: { required: true, type: () => String },
                            permissionType: { required: true, type: () => String },
                            permissionRelationId: { required: true, type: () => Number },
                            status: {
                                required: true,
                                enum: t['./constants/global.constant'].PermissionStatusEnum,
                            },
                        },
                    },
                ],
                [
                    import('./modules/permission/dto/update-permission.dto'),
                    { UpdatePermissionDto: {} },
                ],
                [
                    import('./modules/tracking/entities/tracking-datasource.entity'),
                    {
                        TrackingDatasource: {
                            id: { required: true, type: () => Number },
                            fieldName: { required: true, type: () => String },
                            fieldXpath: { required: true, type: () => String },
                            fieldSnapshot: { required: true, type: () => String },
                            reg: { required: true, type: () => String },
                            isRequired: {
                                required: true,
                                enum: t['./constants/global.constant'].RuleRequiredEnum,
                            },
                            createTime: { required: true, type: () => Date },
                            updateTime: { required: true, type: () => Date },
                            trackingId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./modules/tracking/entities/tracking.entity'),
                    {
                        Tracking: {
                            id: { required: true, type: () => Number },
                            eventName: { required: true, type: () => String },
                            url: { required: true, type: () => String },
                            xpath: { required: true, type: () => String },
                            validationMarker: { required: true, type: () => String },
                            eventType: {
                                required: true,
                                enum: t['./constants/global.constant'].EventTypeEnum,
                                isArray: true,
                            },
                            isSiblingEffective: {
                                required: true,
                                enum: t['./constants/global.constant'].SiblingEffectiveEnum,
                            },
                            snapshot: { required: true, type: () => String },
                            createTime: { required: true, type: () => Date },
                            updateTime: { required: true, type: () => Date },
                            datasource: {
                                required: true,
                                type: () =>
                                    t['./modules/tracking/entities/tracking-datasource.entity']
                                        .TrackingDatasource,
                            },
                            projectId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./modules/project/entities/project.entity'),
                    {
                        Project: {
                            id: { required: true, type: () => Number },
                            projectName: { required: true, type: () => String },
                            projectDesc: { required: true, type: () => String },
                            projectUrl: { required: true, type: () => String },
                            trackingList: {
                                required: true,
                                type: () => [
                                    t['./modules/tracking/entities/tracking.entity'].Tracking,
                                ],
                            },
                        },
                    },
                ],
                [
                    import('./modules/project/dto/create-project.dto'),
                    {
                        CreateProjectDto: {
                            projectName: { required: true, type: () => String },
                            projectDesc: { required: true, type: () => String },
                            projectUrl: { required: true, type: () => String },
                        },
                    },
                ],
                [import('./modules/project/dto/update-project.dto'), { UpdateProjectDto: {} }],
                [
                    import('./modules/role/dto/create-role.dto'),
                    {
                        CreateRoleDto: {
                            roleName: { required: true, type: () => String, maxLength: 20 },
                            roleDesc: { required: true, type: () => String, maxLength: 200 },
                            roleCode: { required: true, type: () => String, maxLength: 50 },
                            status: {
                                required: true,
                                enum: t['./constants/global.constant'].RoleStatusEnum,
                            },
                        },
                    },
                ],
                [import('./modules/role/dto/update-role.dto'), { UpdateRoleDto: {} }],
                [
                    import('./modules/subject/dto/create-subject.dto'),
                    {
                        CreateSubjectDto: {
                            subjectName: { required: true, type: () => String },
                            subjectCode: { required: true, type: () => String },
                            subjectDesc: { required: true, type: () => String },
                            actionId: { required: true, type: () => Number },
                        },
                    },
                ],
                [import('./modules/subject/dto/update-subject.dto'), { UpdateSubjectDto: {} }],
                [
                    import('./modules/subject/dto/create-subject-actions.dto'),
                    {
                        CreateSubjectActionsDto: {
                            subjectId: { required: true, type: () => Number },
                            actionId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./modules/user/dto/create-user.dto'),
                    {
                        CreateUserDto: {
                            username: { required: true, type: () => String, maxLength: 10 },
                            password: {
                                required: true,
                                type: () => String,
                                minLength: 6,
                                maxLength: 50,
                            },
                            email: { required: true, type: () => String },
                            status: {
                                required: true,
                                enum: t['./constants/global.constant'].UserStatusEnum,
                            },
                            roles: { required: true, type: () => [Number] },
                        },
                    },
                ],
                [import('./modules/user/dto/update-user.dto'), { UpdateUserDto: {} }],
                [
                    import('./modules/auth/dto/register-user.dto'),
                    {
                        RegisterUserDto: {
                            username: {
                                required: true,
                                type: () => String,
                                description: '\u7528\u6237\u540D',
                            },
                            password: {
                                required: true,
                                type: () => String,
                                description: '\u5BC6\u7801',
                                minLength: 6,
                                maxLength: 50,
                            },
                            email: {
                                required: true,
                                type: () => String,
                                description: '\u90AE\u7BB1',
                            },
                            captcha: {
                                required: true,
                                type: () => String,
                                description: '\u9A8C\u8BC1\u7801',
                            },
                        },
                    },
                ],
                [
                    import('./modules/user/dto/create-user-role.dto'),
                    {
                        CreateUserRoleDto: {
                            userId: { required: true, type: () => Number },
                            roleIds: { required: true, type: () => [Number] },
                        },
                    },
                ],
                [
                    import('./modules/auth/dto/login-user.dto'),
                    {
                        LoginUserDto: {
                            username: {
                                required: true,
                                type: () => String,
                                description: '\u7528\u6237\u540D',
                            },
                            password: {
                                required: true,
                                type: () => String,
                                description: '\u5BC6\u7801',
                            },
                        },
                    },
                ],
                [
                    import('./modules/auth/vo/login-user.vo'),
                    {
                        UserInfo: {
                            id: { required: true, type: () => Number },
                            username: { required: true, type: () => String },
                        },
                        LoginUserVo: {
                            user: {
                                required: true,
                                type: () => t['./modules/auth/vo/login-user.vo'].UserInfo,
                            },
                            accessToken: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/auth/vo/send-email.dto'),
                    {
                        SendEmailDto: {
                            to: {
                                required: true,
                                type: () => String,
                                description: '\u6536\u4EF6\u4EBA\u90AE\u7BB1\u5730\u5740',
                            },
                        },
                    },
                ],
                [
                    import('./modules/tracking/dto/create-tracking.dto'),
                    {
                        DatasourceDto: {
                            fieldName: { required: true, type: () => String },
                            fieldXpath: { required: true, type: () => String },
                            fieldSnapshot: { required: true, type: () => String },
                            reg: { required: true, type: () => String },
                            isRequired: {
                                required: true,
                                enum: t['./constants/global.constant'].RuleRequiredEnum,
                            },
                        },
                        CreateTrackingDto: {
                            eventName: { required: true, type: () => String },
                            url: { required: true, type: () => String },
                            xpath: { required: true, type: () => String },
                            validationMarker: { required: true, type: () => String },
                            eventType: {
                                required: true,
                                enum: t['./constants/global.constant'].EventTypeEnum,
                                isArray: true,
                            },
                            isSiblingEffective: {
                                required: true,
                                enum: t['./constants/global.constant'].SiblingEffectiveEnum,
                            },
                            snapshot: { required: true, type: () => String },
                            datasource: {
                                required: true,
                                type: () => [
                                    t['./modules/tracking/dto/create-tracking.dto'].DatasourceDto,
                                ],
                            },
                            projectId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./modules/tracking/dto/get-log-list.dto'),
                    {
                        LogListFilter: {
                            eventName: { required: true, type: () => String },
                            eventType: { required: true, type: () => Number },
                            eventTime: { required: true, type: () => [String] },
                            url: { required: true, type: () => String },
                            projectId: { required: true, type: () => Number },
                        },
                        GetLogListDto: {
                            page: { required: true, type: () => Number },
                            limit: { required: true, type: () => Number },
                            filter: {
                                required: true,
                                type: () =>
                                    t['./modules/tracking/dto/get-log-list.dto'].LogListFilter,
                            },
                            sort: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./modules/tracking/dto/report-tracking.dto'),
                    {
                        ReportTrackingDto: {
                            eventId: { required: true, type: () => String },
                            eventType: { required: true, type: () => String },
                            xpath: { required: true, type: () => String },
                            data: { required: true, type: () => Object },
                        },
                    },
                ],
                [
                    import('./modules/tracking/dto/update-tracking.dto'),
                    {
                        UpdateDatasourceDto: {
                            id: { required: true, type: () => Number },
                            fieldName: { required: true, type: () => String },
                            fieldXpath: { required: true, type: () => String },
                            fieldSnapshot: { required: true, type: () => String },
                            reg: { required: true, type: () => String },
                            isRequired: {
                                required: true,
                                enum: t['./constants/global.constant'].RuleRequiredEnum,
                            },
                        },
                        UpdateTrackingDto: {
                            datasource: {
                                required: true,
                                type: () => [
                                    t['./modules/tracking/dto/update-tracking.dto']
                                        .UpdateDatasourceDto,
                                ],
                            },
                        },
                    },
                ],
                [
                    import('./modules/remote-devtool/dto/create-remote-devtool.dto'),
                    { CreateRemoteDevtoolDto: {} },
                ],
                [
                    import('./modules/remote-devtool/dto/update-remote-devtool.dto'),
                    { UpdateRemoteDevtoolDto: { id: { required: true, type: () => Number } } },
                ],
            ],
            controllers: [
                [
                    import('./modules/action/action.controller'),
                    { ActionController: { initActions: {}, getMany: {}, deleteAction: {} } },
                ],
                [
                    import('./modules/menu/menu.controller'),
                    { MenuController: { initActions: {}, getMany: {}, deleteMenu: {} } },
                ],
                [
                    import('./modules/permission/permission.controller'),
                    {
                        PermissionController: {
                            initActions: {},
                            getMany: {},
                            create: {},
                            getMenuPermissions: { type: [Object] },
                            getApiPermissions: { type: [Object] },
                        },
                    },
                ],
                [
                    import('./modules/project/project.controller'),
                    { ProjectController: { initActions: {}, getMany: {}, deleteProject: {} } },
                ],
                [
                    import('./modules/role/role.controller'),
                    {
                        RoleController: {
                            saveRoleMenus: {},
                            getRoleMenus: {
                                type: [
                                    t['./modules/permission/entities/permission.entity'].Permission,
                                ],
                            },
                            getRoleSubjects: {
                                type: [
                                    t['./modules/permission/entities/permission.entity'].Permission,
                                ],
                            },
                            getMany: {},
                            initActions: {},
                        },
                    },
                ],
                [
                    import('./modules/subject/subject.controller'),
                    {
                        SubjectController: {
                            create: {},
                            getMany: {},
                            getSubjectNames: { type: [String] },
                            initSubjects: {},
                            deleteSubject: {},
                        },
                    },
                ],
                [
                    import('./modules/user/user.controller'),
                    {
                        UserController: {
                            initUsers: {},
                            create: {},
                            update: {},
                            getUserMenu: { type: [t['./modules/menu/entities/menu.entity'].Menu] },
                        },
                    },
                ],
                [
                    import('./modules/auth/auth.controller'),
                    {
                        AuthController: {
                            register: {},
                            login: { type: t['./modules/auth/vo/login-user.vo'].LoginUserVo },
                            sendCaptcha: {},
                        },
                    },
                ],
                [
                    import('./modules/tracking/tracking.controller'),
                    {
                        TrackingController: {
                            getMany: {},
                            deleteDatasource: {},
                            track: {},
                            report: {},
                            getLogList: { type: Object },
                        },
                    },
                ],
                [
                    import('./modules/upload/upload.controller'),
                    {
                        UploadController: {
                            uploadFiles: {},
                            uploadChunks: {},
                            merge: { type: String },
                        },
                    },
                ],
            ],
        },
    }
}
