create table weekdays(
    weekday_id serial primary key,
    weekday text not null
);

create table waiters(
    waiters_id serial primary key,
    waiter_name text not null
);

create table shifts(
    weekD_id int,
    foreign key (weekD_id) references weekdays(weekday_id),
    waiter_id int,
    foreign key (waiter_id) references waiters(waiters_id)
);

INSERT INTO weekdays(weekday) VALUES('Sunday');
INSERT INTO weekdays(weekday) VALUES('Monday');
INSERT INTO weekdays(weekday) VALUES('Tuesday');
INSERT INTO weekdays(weekday) VALUES('Wednesday');
INSERT INTO weekdays(weekday) VALUES('Thursday');
INSERT INTO weekdays(weekday) VALUES('Friday');
INSERT INTO weekdays(weekday) VALUES('Saturday');


--  select * from shifts join weekdays on shifts.weekd_id = weekdays.weekday_id join waiters on shifts.waiter_id = waiters.waiters_id;