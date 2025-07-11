
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="h-16 w-16 text-primary mb-6" />
        <h1 className="text-4xl font-bold font-headline mb-2">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
        </p>
        <Button asChild>
            <Link href="/">Kembali ke Halaman Utama</Link>
        </Button>
    </div>
  );
}
