CREATE TABLE notes (
    id bigint primary key generated always as identity,
    content text,
    updated_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_note_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_note_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_note_updated_at();