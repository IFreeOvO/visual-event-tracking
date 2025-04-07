create table "user"
(
    id           serial
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    username     varchar(10)                                 not null
        constraint "UQ_78a916df40e02a9deb1c4b75edb"
            unique,
    password     varchar(100) default ''::character varying  not null,
    email        varchar      default ''::character varying  not null
        constraint "UQ_e12875dfb3b1d92d7d7c5377e22"
            unique,
    status       varchar      default '1'::character varying not null,
    "createTime" timestamp    default now()                  not null,
    "updateTime" timestamp    default now()                  not null
);

comment on column "user".username is '用户名';

comment on column "user".password is '密码';

comment on column "user".email is '邮箱';

comment on column "user".status is '用户状态:1-启用,2-禁用';

alter table "user"
    owner to root;

INSERT INTO public."user" (username, password, email, status, "createTime", "updateTime") VALUES ('admin', '$argon2id$v=19$m=65536,t=3,p=4$Z2NFk4dvtKenHcQCN/w0Qg$jJaThnPhSbgSr0nRezWIr5jjBSqhqXEimzDnxOxa1u4', 'admin@qq.com', '1', '2025-03-30 07:33:06.283380', '2025-03-30 07:33:06.283380');
INSERT INTO public."user" (username, password, email, status, "createTime", "updateTime") VALUES ('test', '$argon2id$v=19$m=65536,t=3,p=4$DgscW5QeVGrIoAtVB29VlA$/dE/5KL2Y/HeMgnGf9FFYJIhRRH1QMuMIVveJQvqM98', 'test@qq.com', '1', '2025-03-30 07:33:06.283380', '2025-03-30 07:33:06.283380');
