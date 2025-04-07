create table subject
(
    id            serial
        constraint "PK_12eee115462e38d62e5455fc054"
            primary key,
    "subjectName" varchar not null,
    "subjectCode" varchar not null
        constraint "UQ_50a527e97be9f1a968160267557"
            unique,
    "subjectDesc" varchar not null,
    "actionId"    integer
        constraint "FK_f76a4efa12439c6223c291d383f"
            references action
            on delete cascade
);

comment on column subject."subjectName" is '功能模块';

comment on column subject."subjectCode" is '功能编码';

comment on column subject."subjectDesc" is '功能描述';

alter table subject
    owner to root;

INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('action', 'action:create', 'action表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('action', 'action:delete', 'action表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('action', 'action:update', 'action表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('action', 'action:read', 'action表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('menu', 'menu:create', 'menu表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('menu', 'menu:delete', 'menu表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('menu', 'menu:update', 'menu表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('menu', 'menu:read', 'menu表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('permission', 'permission:create', 'permission表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('permission', 'permission:delete', 'permission表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('permission', 'permission:update', 'permission表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('permission', 'permission:read', 'permission表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('project', 'project:create', 'project表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('project', 'project:delete', 'project表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('project', 'project:update', 'project表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('project', 'project:read', 'project表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('remote-devtool', 'remote-devtool:create', 'remote-devtool表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('remote-devtool', 'remote-devtool:delete', 'remote-devtool表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('remote-devtool', 'remote-devtool:update', 'remote-devtool表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('remote-devtool', 'remote-devtool:read', 'remote-devtool表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('role', 'role:create', 'role表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('role', 'role:delete', 'role表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('role', 'role:update', 'role表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('role', 'role:read', 'role表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('subject', 'subject:create', 'subject表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('subject', 'subject:delete', 'subject表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('subject', 'subject:update', 'subject表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('subject', 'subject:read', 'subject表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('tracking', 'tracking:create', 'tracking表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('tracking', 'tracking:delete', 'tracking表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('tracking', 'tracking:update', 'tracking表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('tracking', 'tracking:read', 'tracking表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('upload', 'upload:create', 'upload表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('upload', 'upload:delete', 'upload表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('upload', 'upload:update', 'upload表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('upload', 'upload:read', 'upload表-查看', 4);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('user', 'user:create', 'user表-新增', 1);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('user', 'user:delete', 'user表-删除', 2);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('user', 'user:update', 'user表-编辑', 3);
INSERT INTO public.subject ("subjectName", "subjectCode", "subjectDesc", "actionId") VALUES ('user', 'user:read', 'user表-查看', 4);
