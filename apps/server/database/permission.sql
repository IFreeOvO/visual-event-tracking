create table permission
(
    id                     serial
        constraint "PK_3b8b97af9d9d8807e41e6f48362"
            primary key,
    "permissionCode"       varchar                                  not null
        constraint "UQ_58049f4babfa3fdbfb6e0b093a0"
            unique,
    "permissionType"       varchar default 'api'::character varying not null,
    "permissionRelationId" integer                                  not null,
    status                 varchar default '1'::character varying   not null,
    "subjectId"            integer
        constraint "REL_2d3915b1fae36131906c0c5b94"
            unique
        constraint "FK_2d3915b1fae36131906c0c5b944"
            references subject
            on delete cascade,
    "menuId"               integer
        constraint "REL_56074a66260a02394824173d92"
            unique
        constraint "FK_56074a66260a02394824173d926"
            references menu
            on delete cascade
);

comment on column permission."permissionCode" is '权限编码';

comment on column permission."permissionType" is '权限类型';

comment on column permission."permissionRelationId" is '权限关联id';

comment on column permission.status is '状态';

alter table permission
    owner to root;

INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:1', 'menu', 1, '1', null, 1);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:2', 'menu', 2, '1', null, 2);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:3', 'menu', 3, '1', null, 3);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:4', 'menu', 4, '1', null, 4);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:5', 'menu', 5, '1', null, 5);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:6', 'menu', 6, '1', null, 6);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:7', 'menu', 7, '1', null, 7);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:8', 'menu', 8, '1', null, 8);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:9', 'menu', 9, '1', null, 9);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:10', 'menu', 10, '1', null, 10);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:11', 'menu', 11, '1', null, 11);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:12', 'menu', 12, '1', null, 12);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('menu:13', 'menu', 13, '1', null, 13);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:1', 'api', 1, '1', 1, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:2', 'api', 2, '1', 2, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:3', 'api', 3, '1', 3, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:4', 'api', 4, '1', 4, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:5', 'api', 5, '1', 5, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:6', 'api', 6, '1', 6, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:7', 'api', 7, '1', 7, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:8', 'api', 8, '1', 8, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:9', 'api', 9, '1', 9, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:10', 'api', 10, '1', 10, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:11', 'api', 11, '1', 11, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:12', 'api', 12, '1', 12, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:13', 'api', 13, '1', 13, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:14', 'api', 14, '1', 14, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:15', 'api', 15, '1', 15, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:16', 'api', 16, '1', 16, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:17', 'api', 17, '1', 17, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:18', 'api', 18, '1', 18, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:19', 'api', 19, '1', 19, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:20', 'api', 20, '1', 20, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:21', 'api', 21, '1', 21, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:22', 'api', 22, '1', 22, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:23', 'api', 23, '1', 23, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:24', 'api', 24, '1', 24, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:25', 'api', 25, '1', 25, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:26', 'api', 26, '1', 26, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:27', 'api', 27, '1', 27, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:28', 'api', 28, '1', 28, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:29', 'api', 29, '1', 29, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:30', 'api', 30, '1', 30, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:31', 'api', 31, '1', 31, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:32', 'api', 32, '1', 32, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:33', 'api', 33, '1', 33, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:34', 'api', 34, '1', 34, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:35', 'api', 35, '1', 35, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:36', 'api', 36, '1', 36, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:37', 'api', 37, '1', 37, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:38', 'api', 38, '1', 38, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:39', 'api', 39, '1', 39, null);
INSERT INTO public.permission ("permissionCode", "permissionType", "permissionRelationId", status, "subjectId", "menuId") VALUES ('api:40', 'api', 40, '1', 40, null);

