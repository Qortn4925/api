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