
import { getTrendingTokens } from "@/lib/moralis";
import type { MoralisTrendingToken } from "@/types";
import { TrendingTokenCard } from "@/components/molecules/trending-token-card";
import { AlertTriangle } from "lucide-react";

export default async function DegenPage() {
  let tokens: MoralisTrendingToken[] = [];
  let errorMessage: string | null = null;

  try {
    tokens = await getTrendingTokens('solana');
  } catch (err) {
    console.error("Gagal mengambil data Moralis:", err);
    errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan tak terduga saat mengambil data.";
  }

  const validTokens = tokens.filter(token => token && token.address);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            Token Populer di Solana
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Token yang sedang tren dari ekosistem Solana, didukung oleh Moralis. Data mungkin sedikit tertunda.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          {errorMessage ? (
            <div className="text-center text-destructive p-6 border border-destructive/50 rounded-lg bg-destructive/10 flex flex-col items-center">
                <AlertTriangle className="h-10 w-10 mb-4" />
                <p className="text-lg font-semibold">Gagal Memuat Token</p>
                <p className="text-sm text-destructive/80">{errorMessage}</p>
            </div>
          ) : (
            validTokens.length > 0 ? validTokens.map((token) => (
              <TrendingTokenCard key={`${token.rank}-${token.address}`} token={token} />
            )) : <p className="text-center text-muted-foreground">Tidak ada token yang sedang tren saat ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}
