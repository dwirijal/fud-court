
import { getAllPosts } from "@/lib/ghost-admin";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { PostQueueTable } from "./queue-table";

export const dynamic = 'force-dynamic';

export default async function PostQueuePage() {
    const isGhostAdminConfigured = !!process.env.GHOST_API_URL && !!process.env.GHOST_ADMIN_API_KEY;
    const posts = isGhostAdminConfigured ? await getAllPosts() : [];
    
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Admin</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                         <BreadcrumbLink asChild>
                            <Link href="/admin/content">Berita & Konten</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Antrean Pos & Thread</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Antrean Pos & Thread
                </h1>
                <p className="text-xl text-muted-foreground">
                    Lihat, kelola, dan prioritaskan semua konten yang dijadwalkan, dalam draf, dan sudah terbit.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Semua Konten</CardTitle>
                    <CardDescription>
                        Daftar lengkap semua konten dari semua status di CMS Ghost Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isGhostAdminConfigured ? (
                         <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Konfigurasi Hilang</AlertTitle>
                            <AlertDescription>
                                Kunci API Admin Ghost tidak dikonfigurasi. Harap atur `GHOST_API_URL` dan `GHOST_ADMIN_API_KEY` di variabel lingkungan Anda untuk melihat antrean pos.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <PostQueueTable posts={posts} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
