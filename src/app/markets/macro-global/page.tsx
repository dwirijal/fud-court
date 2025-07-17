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
import { Globe } from "lucide-react";

export const metadata = {
  title: 'Macro Global Indicators',
  description: 'Indikator makro ekonomi global yang memengaruhi pasar kripto.',
};

export default function MacroGlobalIndicatorsPage() {
  return (
    <div className="container mx-auto px-4 py-7 md:py-8">
      <Breadcrumb className="mb-6">
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
            <BreadcrumbPage>Macro Global Indicators</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-7">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                <Globe className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-semibold font-headline tracking-tight">
                Macro Global Indicators
            </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
            Halaman ini akan menampilkan indikator makro ekonomi global yang relevan dengan pasar kripto.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Data Makro Global</CardTitle>
          <CardDescription>Data untuk indikator makro global akan segera hadir.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Data indikator makro global belum tersedia. Silakan periksa kembali nanti.</p>
        </CardContent>
      </Card>
    </div>
  );
}
