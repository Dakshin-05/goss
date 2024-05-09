-- Table: public.blocked_users

-- DROP TABLE IF EXISTS public.blocked_users;

CREATE TABLE IF NOT EXISTS public.blocked_users
(
    user_id uuid NOT NULL,
    blocked_id uuid NOT NULL,
    blocked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT blocked_users_pk PRIMARY KEY (user_id, blocked_id),
    CONSTRAINT blocked_user_unique_constraint UNIQUE (user_id, blocked_id),
    CONSTRAINT blocked_users_blocked_id_fkey FOREIGN KEY (blocked_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT blocked_users_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.blocked_users
    OWNER to postgres;

-- Trigger: move_from_friends_to_blocked_users_trigger

-- DROP TRIGGER IF EXISTS move_from_friends_to_blocked_users_trigger ON public.blocked_users;

CREATE OR REPLACE TRIGGER move_from_friends_to_blocked_users_trigger
    AFTER INSERT
    ON public.blocked_users
    FOR EACH ROW
    EXECUTE FUNCTION public.move_from_friends_to_blocked_users();

---------------------------------


-- Table: public.chat

-- DROP TABLE IF EXISTS public.chat;

CREATE TABLE IF NOT EXISTS public.chat
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    member_one_id uuid NOT NULL,
    member_two_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    CONSTRAINT conversation_pk PRIMARY KEY (id),
    CONSTRAINT chat_unique_constraint UNIQUE (member_one_id, member_two_id),
    CONSTRAINT conversation_member_one_id_fkey FOREIGN KEY (member_one_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT conversation_member_two_id_fkey FOREIGN KEY (member_two_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat
    OWNER to postgres;



--------------------------------


-- Table: public.friend_request

-- DROP TABLE IF EXISTS public.friend_request;

CREATE TABLE IF NOT EXISTS public.friend_request
(
    from_id uuid NOT NULL,
    to_id uuid NOT NULL,
    status friendstatus NOT NULL DEFAULT 'pending'::friendstatus,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT friend_request_pk PRIMARY KEY (from_id, to_id),
    CONSTRAINT friend_request_from_id_fkey FOREIGN KEY (from_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT friend_request_to_id_fkey FOREIGN KEY (to_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.friend_request
    OWNER to postgres;

-- Trigger: accept_friend_request

-- DROP TRIGGER IF EXISTS accept_friend_request ON public.friend_request;

CREATE OR REPLACE TRIGGER accept_friend_request
    BEFORE UPDATE 
    ON public.friend_request
    FOR EACH ROW
    WHEN (new.status = 'accepted'::friendstatus)
    EXECUTE FUNCTION public.move_from_friend_request_to_friends();

-- Trigger: block_friend_request

-- DROP TRIGGER IF EXISTS block_friend_request ON public.friend_request;

CREATE OR REPLACE TRIGGER block_friend_request
    BEFORE UPDATE 
    ON public.friend_request
    FOR EACH ROW
    WHEN (new.status = 'blocked'::friendstatus)
    EXECUTE FUNCTION public.move_from_friend_request_to_blocked_users();

-- Trigger: move_from_blocked_users_to_friends

-- DROP TRIGGER IF EXISTS move_from_blocked_users_to_friends ON public.friend_request;

CREATE OR REPLACE TRIGGER move_from_blocked_users_to_friends
    BEFORE INSERT
    ON public.friend_request
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.move_from_blocked_users_to_friends();

-- Trigger: remove_from_blocked_users

-- DROP TRIGGER IF EXISTS remove_from_blocked_users ON public.friend_request;

CREATE OR REPLACE TRIGGER remove_from_blocked_users
    AFTER INSERT
    ON public.friend_request
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.remove_from_blocked_users();


------------------------------------


-- Table: public.message

-- DROP TABLE IF EXISTS public.message;

CREATE TABLE IF NOT EXISTS public.message
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    CONSTRAINT message_pk PRIMARY KEY (id),
    CONSTRAINT message_conversation_id_fkey FOREIGN KEY (conversation_id)
        REFERENCES public.chat (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT message_sender_id_fkey FOREIGN KEY (sender_id)
        REFERENCES public.profile (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.message
    OWNER to postgres;

---------------------------------------


-- Table: public.profile

-- DROP TABLE IF EXISTS public.profile;

CREATE TABLE IF NOT EXISTS public.profile
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    username character varying(30) COLLATE pg_catalog."default" NOT NULL,
    name character varying(30) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    refresh_token character varying(100) COLLATE pg_catalog."default",
    validate_before_save boolean,
    CONSTRAINT profile_pkey PRIMARY KEY (id),
    CONSTRAINT profile_email_key UNIQUE (email),
    CONSTRAINT profile_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profile
    OWNER to postgres;


------------------------------------------



-- FUNCTION: public.move_from_blocked_users_to_friends()

-- DROP FUNCTION IF EXISTS public.move_from_blocked_users_to_friends();

CREATE OR REPLACE FUNCTION public.move_from_blocked_users_to_friends()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Check if the pair exists in blocked_users
    IF EXISTS (
        SELECT 1 
        FROM blocked_users 
        WHERE user_id = NEW.from_id AND blocked_id = NEW.to_id
    )  THEN
        -- If the pair exists in blocked_users, delete them from there
        DELETE FROM blocked_users 
        WHERE (user_id = NEW.from_id AND blocked_id = NEW.to_id);
    END IF;

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.move_from_blocked_users_to_friends()
    OWNER TO postgres;


------------------------------------------


-- FUNCTION: public.move_from_friend_request_to_blocked_users()

-- DROP FUNCTION IF EXISTS public.move_from_friend_request_to_blocked_users();

CREATE OR REPLACE FUNCTION public.move_from_friend_request_to_blocked_users()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
		 INSERT INTO blocked_users(user_id, blocked_id) values (NEW.to_id,NEW.from_id);
	  DELETE FROM friend_request
    WHERE from_id = NEW.from_id AND to_id = NEW.to_id;
    

	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.move_from_friend_request_to_blocked_users()
    OWNER TO postgres;

---------------------------------------


-- FUNCTION: public.move_from_friend_request_to_friends()

-- DROP FUNCTION IF EXISTS public.move_from_friend_request_to_friends();

CREATE OR REPLACE FUNCTION public.move_from_friend_request_to_friends()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Check if the chat already exists
    IF EXISTS (
        SELECT 1 
        FROM chat 
        WHERE (member_one_id = NEW.from_id AND member_two_id = NEW.to_id) OR (member_one_id = NEW.to_id AND member_two_id = NEW.from_id)
    ) THEN
        -- If the chat exists, update deleted_at as null
        UPDATE chat
        SET deleted_at = NULL
        WHERE (member_one_id = NEW.from_id AND member_two_id = NEW.to_id) OR (member_one_id = NEW.to_id AND member_two_id = NEW.from_id);
    ELSE
        -- Insert the accepted friend request into the friends table
        INSERT INTO chat(member_one_id, member_two_id) VALUES (NEW.from_id, NEW.to_id);
    END IF;
	delete from friend_request where from_id=new.from_id and to_id=new.to_id;

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.move_from_friend_request_to_friends()
    OWNER TO postgres;


--------------------------------------


-- FUNCTION: public.move_from_friends_to_blocked_users()

-- DROP FUNCTION IF EXISTS public.move_from_friends_to_blocked_users();

CREATE OR REPLACE FUNCTION public.move_from_friends_to_blocked_users()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Update chat to mark the conversation as deleted
    UPDATE chat 
    SET deleted_at = current_timestamp
    WHERE (member_one_id = NEW.user_id AND member_two_id = NEW.blocked_id) OR (member_two_id = NEW.user_id AND member_one_id = NEW.blocked_id);

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.move_from_friends_to_blocked_users()
    OWNER TO postgres;


---------------------------------------


-- FUNCTION: public.remove_from_blocked_users()

-- DROP FUNCTION IF EXISTS public.remove_from_blocked_users();

CREATE OR REPLACE FUNCTION public.remove_from_blocked_users()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    -- Check if the pair exists in blocked_users
    IF EXISTS (
        SELECT 1 
        FROM blocked_users 
        WHERE user_id = NEW.from_id AND blocked_id = NEW.to_id
    )  THEN
        -- If the pair exists in blocked_users, delete them from there
        DELETE FROM blocked_users 
        WHERE (user_id = NEW.from_id AND blocked_id = NEW.to_id);
    END IF;

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.remove_from_blocked_users()
    OWNER TO postgres;

-------------------------------------



-- View: public.friends

-- DROP VIEW public.friends;

CREATE OR REPLACE VIEW public.friends
 AS
 SELECT member_one_id AS user_id,
    member_two_id AS friend_id,
    created_at AS friends_from
   FROM chat
  WHERE deleted_at IS NULL;

ALTER TABLE public.friends
    OWNER TO postgres;



-------------------------------------


-- Type: friendstatus

-- DROP TYPE IF EXISTS public.friendstatus;

CREATE TYPE public.friendstatus AS ENUM
    ('accepted', 'pending', 'blocked');

ALTER TYPE public.friendstatus
    OWNER TO postgres;
    
