create table role
(
    id           serial
        constraint "PK_b36bcfe02fc8de3c57a8b2391c2"
            primary key,
    "roleName"   varchar(20)                              not null,
    "roleDesc"   varchar(200),
    "roleCode"   varchar(50)                              not null
        constraint "UQ_4867c971774176d1a2f110c0a04"
            unique,
    status       varchar   default '1'::character varying not null,
    "createTime" timestamp default now()                  not null,
    "updateTime" timestamp default now()                  not null
);

comment on column role."roleName" is '角色名';

comment on column role."roleDesc" is '角色描述';

comment on column role."roleCode" is '角色编码';

comment on column role.status is '角色状态:1-启用,2-禁用';

alter table role
    owner to root;

INSERT INTO public.role ("roleName", "roleDesc", "roleCode", status, "createTime", "updateTime") VALUES ('管理员', '拥有所有权限', 'admin', '1', '2025-03-30 07:33:06.170700', '2025-03-30 07:33:06.170700');
INSERT INTO public.role ("roleName", "roleDesc", "roleCode", status, "createTime", "updateTime") VALUES ('测试', '用于埋点权限', 'test', '1', '2025-03-30 07:34:27.329530', '2025-03-30 07:34:27.329530');
