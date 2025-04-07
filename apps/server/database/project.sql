create table project
(
    id            serial
        constraint "PK_4d68b1358bb5b766d3e78f32f57"
            primary key,
    "projectName" varchar(20) not null
        constraint "UQ_22eee2edb529c134f0f4ecad3ad"
            unique,
    "projectDesc" varchar(100),
    "projectUrl"  varchar     not null
);

comment on column project."projectName" is '项目名称';

comment on column project."projectDesc" is '项目描述';

comment on column project."projectUrl" is '项目地址';

alter table project
    owner to root;

INSERT INTO public.project ("projectName", "projectDesc", "projectUrl") VALUES ('模拟真实项目埋点', '测试项目为开源vue播放器', 'http://localhost:5600');
