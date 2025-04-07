create table action
(
    id           serial
        constraint "PK_2d9db9cf5edfbbae74eb56e3a39"
            primary key,
    "actionName" varchar not null
        constraint "UQ_6af2283f143c1b9e746f1cff70a"
            unique,
    "actionDesc" varchar not null
);

comment on column action."actionName" is '行为名称';

comment on column action."actionDesc" is '行为描述';

alter table action
    owner to root;

INSERT INTO public.action ("actionName", "actionDesc") VALUES ('create', '新增');
INSERT INTO public.action ("actionName", "actionDesc") VALUES ('delete', '删除');
INSERT INTO public.action ("actionName", "actionDesc") VALUES ('update', '编辑');
INSERT INTO public.action ("actionName", "actionDesc") VALUES ('read', '查看');

SELECT setval('action_id_seq', (SELECT MAX(id) FROM action));
