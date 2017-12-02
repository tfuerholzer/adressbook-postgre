drop table persons;

CREATE TABLE persons (
    personid int not null,
    firstName varchar(255),
    lastName varchar(255),
    email varchar(255)
    primary key (personid)
);