
CREATE TABLE IF NOT EXISTS public.defillama_chains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gecko_id TEXT,
    tvl NUMERIC,
    token_symbol TEXT,
    cmc_id TEXT,
    chain_id BIGINT,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.defillama_chains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.defillama_chains
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.defillama_chains
AS PERMISSIVE FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.defillama_chains
AS PERMISSIVE FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "Enable delete for authenticated users" ON public.defillama_chains
AS PERMISSIVE FOR DELETE
TO service_role
USING (true);
