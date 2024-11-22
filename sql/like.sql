use prj2024;

create table board_like
(
    board_id  int REFERENCES board (id),
    member_id varchar(20) references member (id),
    primary key (board_id, member_id)
);

desc board_like;
desc member;

select *
from board_like;


