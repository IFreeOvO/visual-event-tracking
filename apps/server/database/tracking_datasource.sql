create table tracking_datasource
(
    id              serial
        constraint "PK_492b24a77b3bf2cb69b53b6c56f"
            primary key,
    "fieldName"     varchar                 not null,
    "fieldXpath"    varchar                 not null,
    "fieldSnapshot" varchar                 not null,
    "createTime"    timestamp default now() not null,
    "updateTime"    timestamp default now() not null,
    "trackingId"    integer                 not null
        constraint "FK_f50c40482bd60273749fb1b55fd"
            references tracking
            on delete cascade,
    reg             varchar,
    "isRequired"    integer default 0
);

comment on column tracking_datasource."fieldName" is '字段名称';

comment on column tracking_datasource."fieldXpath" is '数据来源元素的xpath';

comment on column tracking_datasource."fieldSnapshot" is '数据来源元素的快照';

comment on column tracking_datasource.reg is '验证规则';

comment on column tracking_datasource."isRequired" is '是否必传';

alter table tracking_datasource
    owner to root;

