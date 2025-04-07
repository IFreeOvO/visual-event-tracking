create table user_roles
(
    "userId" integer not null
        constraint "FK_472b25323af01488f1f66a06b67"
            references "user"
            on update cascade on delete cascade,
    "roleId" integer not null
        constraint "FK_86033897c009fcca8b6505d6be2"
            references role,
    constraint "PK_88481b0c4ed9ada47e9fdd67475"
        primary key ("userId", "roleId")
);

alter table user_roles
    owner to root;

create index "IDX_472b25323af01488f1f66a06b6"
    on user_roles ("userId");

create index "IDX_86033897c009fcca8b6505d6be"
    on user_roles ("roleId");

INSERT INTO public.user_roles ("userId", "roleId") VALUES (1, 1);
INSERT INTO public.user_roles ("userId", "roleId") VALUES (2, 2);
