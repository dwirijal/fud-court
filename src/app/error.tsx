
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center p-6">
      <AlertCircle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold font-headline mb-2">Terjadi Kesalahan</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Maaf, terjadi kesalahan yang tidak terduga. Anda dapat mencoba lagi atau kembali ke halaman utama.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Coba Lagi
        </Button>
        <Button asChild>
            <Link href="/">Kembali ke Halaman Utama</Link>
        </Button>
      </div>
    </div>
  );
}
