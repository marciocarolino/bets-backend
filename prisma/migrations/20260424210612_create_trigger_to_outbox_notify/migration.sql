-- This is an empty migration.-- Cria a função que avisa o canal
CREATE OR REPLACE FUNCTION notify_new_outbox_message()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('outbox_channel', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that calls the function after an insert on the OutboxMessage table
CREATE TRIGGER outbox_trigger
AFTER INSERT ON "OutboxMessage"
FOR EACH ROW EXECUTE PROCEDURE notify_new_outbox_message();
