
CREATE TABLE IF NOT EXISTS public.defillama_chains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    gecko_id TEXT,
    tvl DOUBLE PRECISION,
    token_symbol TEXT,
    cmc_id TEXT,
    chain_id INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.defillama_chains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.defillama_chains;
CREATE POLICY "Enable read access for all users"
ON public.defillama_chains
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Enable write access for service_role" ON public.defillama_chains;
CREATE POLICY "Enable write access for service_role"
ON public.defillama_chains
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
