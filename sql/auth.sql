use prj2024;


create table auth
(
    member_id varchar(20) references member (id),
    auth      varchar(20) not null,
    primary key (member_id, auth)
);

desc auth;

desc member;

insert into auth (member_id, auth)
values ('admin', 'admin');
select *
from auth;

drop table auth;

insert into auth (member_id, auth)
values ('admin', 'manager');