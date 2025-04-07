export const isDev = process.env.NODE_ENV === 'development'
export const CURRENT_ENV = process.env.NODE_ENV

export const IS_PUBLIC_METADATA = 'isPublic'
export const PERMISSION_METADATA = 'permission'

export enum RoleEnum {
    User = 'user',
    Admin = 'admin',
}

export enum UserStatusEnum {
    Disabled = '0',
    Enabled = '1',
}

export enum VisibleStatusEnum {
    Invisible = '0',
    Visible = '1',
}

export enum RoleStatusEnum {
    Disabled = '0',
    Enabled = '1',
}

export enum PermissionStatusEnum {
    Disabled = '0',
    Enabled = '1',
}

export enum PermissionTypeEnum {
    Api = 'api',
    Menu = 'menu',
}

export enum OrderEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum TableEnum {
    User = 'user',
    Role = 'role',
    Menu = 'menu',
    Subject = 'subject',
    Permission = 'permission',
    Action = 'action',
    Project = 'project',
    Tracking = 'tracking',
    TrackingDatasource = 'tracking_datasource',
}

export enum ActionTypeEnum {
    Create = 'create',
    Update = 'update',
    Delete = 'delete',
    Read = 'read',
}

export enum LayoutEnum {
    Default = '0',
    Blank = '1',
}

export enum EventTypeEnum {
    Click,
    Expose,
}

export enum SiblingEffectiveEnum {
    No,
    Yes,
}

export enum MicroserviceEnum {
    LOG = 'LOG_SERVICE',
}

export enum RuleRequiredEnum {
    NO,
    YES,
}
