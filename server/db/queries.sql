create table friends (userid uuid not null, friendid uuid not null, 
	constraint friends_pk primary key(userid, friendid),
	foreign key (userid) references profile(id) on delete cascade,
	foreign key (friendid) references profile(id) on delete cascade);


create table friend_request (from_id uuid not null, to_id uuid not null, 
	status friendstatus not null default 'pending',
	
	requested_at timestamp default CURRENT_TIMESTAMP,
	
	constraint friend_request_pk primary key(from_id, to_id),
	foreign key (from_id) references profile(id) on delete cascade,
	foreign key (to_id) references profile(id) on delete cascade);

CREATE OR REPLACE FUNCTION move_from_friend_request_to_friends()
  RETURNS TRIGGER 
  AS
$$
BEGIN
		 INSERT INTO friends(user_id, friend_id) values (NEW.from_id,NEW.to_id);
	  DELETE FROM friend_request
    WHERE from_id = NEW.fromid AND toid = NEW_.toid;
    

	RETURN NEW;
END;
$$
  LANGUAGE PLPGSQL;
	
create trigger accept_friend_request 
after update on friend_request
for each row
WHEN (OLD.status <> NEW.status AND NEW.status = 'accepted')
execute procedure move_from_friend_request_to_friends();


CREATE OR REPLACE FUNCTION move_from_friend_request_to_blocked_users()
  RETURNS TRIGGER 
  AS
$$
BEGIN
		 INSERT INTO blocked_users(user_id, blocked_id) values (NEW.from_id,NEW.to_id);
	  DELETE FROM friend_request
    WHERE from_id = NEW.from_id AND to_id = NEW.to_id;
    

	RETURN NEW;
END;
$$
  LANGUAGE PLPGSQL;
	
create or replace trigger block_friend_request 
after update on friend_request
for each row
WHEN (OLD.status <> NEW.status AND NEW.status = 'blocked')
execute procedure move_from_friend_request_to_blocked_users();


create table direct_message (id uuid not null default uuid_generate_v4(), 
	sender_id uuid not null,
	receiver_id uuid not null,
	content text not null,
	is_deleted boolean not null default false,
	is_edited boolean not null default false,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp,
	constraint direct_message_pk primary key(id),
	foreign key (sender_id) references profile(id),
	foreign key (receiver_id) references profile(id)
	)


	create table conversation (id uuid not null default uuid_generate_v4(),
	member_one_id uuid not null,
	member_two_id uuid not null,
	created_at timestamp not null default current_timestamp,
	deleted_at timestamp default null,
	constraint conversation_pk primary key(id),
	foreign key (member_one_id) references profile(id),
	foreign key (member_two_id) references profile(id)
		
	);