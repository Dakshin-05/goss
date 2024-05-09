-- Trigger: accept_friend_request

-- DROP TRIGGER IF EXISTS accept_friend_request ON public.friend_request;

CREATE OR REPLACE TRIGGER accept_friend_request
    BEFORE UPDATE 
    ON public.friend_request
    FOR EACH ROW
    WHEN (new.status = 'accepted'::friendstatus)
    EXECUTE FUNCTION public.move_from_friend_request_to_friends();

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




----------

-- Trigger: block_friend_request

-- DROP TRIGGER IF EXISTS block_friend_request ON public.friend_request;

CREATE OR REPLACE TRIGGER block_friend_request
    before UPDATE 
    ON public.friend_request
    FOR EACH ROW
    WHEN (new.status = 'blocked'::friendstatus)
    EXECUTE FUNCTION public.move_from_friend_request_to_blocked_users();




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


----------------------


-- Trigger: move_from_blocked_users_to_friends

-- DROP TRIGGER IF EXISTS move_from_blocked_users_to_friends ON public.friend_request;

CREATE OR REPLACE TRIGGER move_from_blocked_users_to_friends
    before INSERT
    ON public.friend_request
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.move_from_blocked_users_to_friends();



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


-----------------------


-- Trigger: remove_from_blocked_users

-- DROP TRIGGER IF EXISTS remove_from_blocked_users ON public.friend_request;

CREATE OR REPLACE TRIGGER remove_from_blocked_users
    AFTER INSERT
    ON public.friend_request
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.remove_from_blocked_users();


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


-- Trigger: move_from_friends_to_blocked_users_trigger

-- DROP TRIGGER IF EXISTS move_from_friends_to_blocked_users_trigger ON public.blocked_users;

CREATE OR REPLACE TRIGGER move_from_friends_to_blocked_users_trigger
    AFTER INSERT
    ON public.blocked_users
    FOR EACH ROW
    EXECUTE FUNCTION public.move_from_friends_to_blocked_users();

    -- Trigger: move_from_friends_to_blocked_users_trigger

-- DROP TRIGGER IF EXISTS move_from_friends_to_blocked_users_trigger ON public.blocked_users;

CREATE OR REPLACE TRIGGER move_from_friends_to_blocked_users_trigger
    AFTER INSERT
    ON public.blocked_users
    FOR EACH ROW
    EXECUTE FUNCTION public.move_from_friends_to_blocked_users();