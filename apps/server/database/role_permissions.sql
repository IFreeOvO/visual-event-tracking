create table role_permissions
(
    "roleId"       integer not null
        constraint "FK_b4599f8b8f548d35850afa2d12c"
            references role
            on update cascade on delete cascade,
    "permissionId" integer not null
        constraint "FK_06792d0c62ce6b0203c03643cdd"
            references permission,
    constraint "PK_d430a02aad006d8a70f3acd7d03"
        primary key ("roleId", "permissionId")
);

alter table role_permissions
    owner to root;

create index "IDX_b4599f8b8f548d35850afa2d12"
    on role_permissions ("roleId");

create index "IDX_06792d0c62ce6b0203c03643cd"
    on role_permissions ("permissionId");

INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 1);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 2);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 3);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 4);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 5);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 6);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 7);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 8);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 9);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 10);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 11);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 12);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 13);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 14);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 15);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 16);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 17);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 18);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 19);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 20);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 21);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 22);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 23);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 24);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 25);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 26);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 27);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 28);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 29);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 30);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 31);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 32);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 33);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 34);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 35);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 36);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 37);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 38);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 39);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 40);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 41);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 42);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 43);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 44);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 45);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 46);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 47);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 48);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 49);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 50);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 51);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 52);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (1, 53);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (2, 3);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (2, 4);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (2, 5);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (2, 12);
INSERT INTO public.role_permissions ("roleId", "permissionId") VALUES (2, 13);
