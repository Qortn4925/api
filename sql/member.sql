use prj2024;

create table member
(
    id          VARCHAR(20) primary key,
    password    varchar(30) not null,
    description varchar(1000),
    inserted    datetime default now()
);

select *
from member;