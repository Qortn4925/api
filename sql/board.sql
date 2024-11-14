use prj2024;

create table board
(
    id       int auto_increment primary key,
    title    varchar(300) not null,
    content  varchar(5000),
    writer   varchar(100) not null,
    inserted Datetime default now()
);

select *
from board;