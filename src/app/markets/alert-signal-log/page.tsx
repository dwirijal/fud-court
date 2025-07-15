import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { BellRing } from "lucide-react";

export const metadata = {
  title: 'Alert / Signal Log',
  description: 'Log sinyal dan peringatan pasar kripto.',
};

export default function AlertSignalLogPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Beranda</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/markets" asChild>
              <Link href="/markets">Pasar</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Alert / Signal Log</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <BellRing className="h-8 w-8" />
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                Alert / Signal Log
            </h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2">
            Halaman ini akan menampilkan log sinyal dan peringatan pasar yang dihasilkan oleh sistem.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Log Sinyal</CardTitle>
          <CardDescription>Log sinyal dan peringatan akan segera hadir.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Log sinyal dan peringatan belum tersedia. Silakan periksa kembali nanti.</p>
        </CardContent>
      </Card>
    </div>
  );
}