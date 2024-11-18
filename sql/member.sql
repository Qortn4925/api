use prj2024;

create table member
(
    id          VARCHAR(20) primary key,
    password    varchar(30) not null,
    description varchar(1000),
    inserted    datetime default now()
);

alter table member
    add column email VARCHAR(30) unique after id;

select *
from member;


drop table member;