use prj2024;

create table comment
(
    id        int PRIMARY KEY AUTO_INCREMENT,
    board_id  int          not null references board (id),
    member_id varchar(20)  not null references member (id),
    comment   varchar(500) not null,
    inserted  DATETIME default now()
);


select *
from comment;


select count(*)
from comment
group by board_id;

select id,
       title,
       writer,
       inserted,
       (select count(*)
        from comment c
        where board_id = b.id)
from board b
order by id desc;


select b.id, b.title, b.writer, b.inserted, count(c.id)
from comment c
         right join board b on b.id = c.board_id
group by b.id
order by b.id desc;