export enum Path {
    Home = '/home',
    Login = '/login',
    Register = '/register',
    UserManage = '/system/user-manage',
    MenuManage = '/system/menu-manage',
    RoleManage = '/system/role-manage',
    FeatureManage = '/system/feature-manage',
    ActionManage = '/system/action-manage',
    PermissionManage = '/system/permission-manage',
    ProjectConfigs = '/tracking/project-config',
    Validation = '/tracking/validation',
    Editor = '/tracking/editor',
}

export const PublicRoutes = [Path.Login, Path.Register]
