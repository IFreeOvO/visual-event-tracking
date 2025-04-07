create table menu
(
    id              serial
        constraint "PK_35b2a8f47d153ff7a41860cceeb"
            primary key,
    name            varchar(20) not null
        constraint "UQ_51b63874cdce0d6898a0b2150f2"
            unique,
    "parentId"      integer     not null,
    "componentName" varchar(100) default ''::character varying,
    path            varchar(100) default ''::character varying,
    icon            varchar(100) default ''::character varying,
    layout          varchar      default '0'::character varying,
    "order"         integer     not null,
    "visibleStatus" varchar      default '1'::character varying
);

comment on column menu.name is '菜单名称';

comment on column menu."parentId" is '父级菜单id';

comment on column menu."componentName" is '组件名称';

comment on column menu.path is '路径';

comment on column menu.icon is '图标';

comment on column menu.layout is '布局';

comment on column menu."order" is '排序';

comment on column menu."visibleStatus" is '显示状态';

alter table menu
    owner to root;

INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('首页', 0, 'home', '/home', 'HomeOutlined', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('系统管理', 0, '', 'system', 'AppstoreOutlined', '0', 2, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('项目埋点', 0, '', 'tracking', 'DotChartOutlined', '0', 3, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('埋点编辑器', 0, 'editor-page', 'tracking/editor/:id', '', '1', 1, '0');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('埋点验证', 0, 'validation', 'tracking/validation/:id', '', '1', 1, '0');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('用户管理', 2, 'user-manage', 'user-manage', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('角色管理', 2, 'role-manage', 'role-manage', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('权限管理', 2, 'permission-manage', 'permission-manage', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('菜单管理', 2, 'menu-manage', 'menu-manage', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('功能管理', 2, 'feature-manage', 'feature-manage', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('行为管理', 2, 'action-manage', 'action-manage', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('项目配置', 3, 'project-config', 'project-config', '', '0', 1, '1');
INSERT INTO public.menu (name, "parentId", "componentName", path, icon, layout, "order", "visibleStatus") VALUES ('日志查询', 3, 'log-query', 'log-query', '', '0', 1, '1');

