from alembic import op
from sqlalchemy import text


def attach_updated_at_triggers_to_all_tables():
    conn = op.get_bind()

    conn.execute(
        text(
            """
        CREATE OR REPLACE FUNCTION set_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = now();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
    """,
        ),
    )

    # Find all public tables with an 'updated_at' column
    result = conn.execute(
        text(
            """
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updated_at'
          AND table_schema = 'public'
    """,
        ),
    )

    tables = [row.table_name for row in result]

    for table_name in tables:
        # Add trigger using PL/pgSQL safe wrapper to avoid duplicate error
        conn.execute(
            text(
                f""" 
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_trigger
                    WHERE tgname = 'trigger_set_updated_at'
                      AND tgrelid = 'public.{table_name}'::regclass
                ) THEN
                    CREATE TRIGGER trigger_set_updated_at
                    BEFORE UPDATE ON public.{table_name}
                    FOR EACH ROW
                    EXECUTE FUNCTION set_updated_at();
                END IF;
            END;
            $$;
        """,
            ),
        )
