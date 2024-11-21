use prj2024;

#  같은 게시글에 , 같은 파일명이 있어서는  x라는 조건으로
#  두개를 묶어서
create table board_file
(
    board_id int          not null,
    name     VARCHAR(300) NOT NULL,
    primary key (board_id, name)
);
#   board 에서 참조 받아서 외래키로   board_id 받으면 안되나 ?

desc board_file;


select *
from board_file;