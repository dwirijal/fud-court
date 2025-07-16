export default function CoinDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
        Detail untuk {params.id}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl">
        Halaman ini akan menampilkan informasi detail untuk koin yang dipilih.
      </p>
    </div>
  );
}