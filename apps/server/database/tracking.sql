create table tracking
(
    id                   serial
        constraint "PK_c6d380f3abe9852840e5aff1439"
            primary key,
    "eventName"          varchar                 not null,
    url                  varchar                 not null,
    xpath                varchar                 not null,
    "validationMarker"   varchar                 not null,
    "eventType"          text                    not null,
    "isSiblingEffective" integer   default 0     not null,
    snapshot             varchar                 not null,
    "createTime"         timestamp default now() not null,
    "updateTime"         timestamp default now() not null,
    "projectId"          integer                 not null
        constraint "FK_6b44e83762829ed1d3a67c86567"
            references project
);

comment on column tracking."eventName" is '事件名称';

comment on column tracking.url is '埋点页面地址';

comment on column tracking.xpath is '埋点元素的xpath';

comment on column tracking."validationMarker" is '验证xpath是否正确命中的标记';

comment on column tracking."eventType" is '埋点事件类型';

comment on column tracking."isSiblingEffective" is '同级元素是否生效';

comment on column tracking.snapshot is '埋点元素快照';

alter table tracking
    owner to root;

