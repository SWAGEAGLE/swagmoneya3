drop table appuser;
drop table scores;
drop table challenges;
create table appuser(fname varchar(20), lname varchar(20), username varchar(20), passwd varchar(20), email varchar(20), numgamesplayed int, lastlogin date);
create table scores(username varchar(20), score int, scoretime date);
create table challenges(challenger varchar(20), opponent varchar(20), result varchar(20));
