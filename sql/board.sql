use prj2024;

create table board
(
    id       int auto_increment primary key,
    title    varchar(300) not null,
    content  varchar(5000),
    writer   varchar(20)  not null references member (id),
    inserted Datetime default now()
);

select count(*)
from board;

# 페이지 연습용 복붙

Insert into board
    (title, content, writer)
select title, content, writer
from board;

desc board;

