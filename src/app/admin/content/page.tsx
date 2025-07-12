
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import {
    BotMessageSquare,
    CalendarDays,
    Flame,
    Image as ImageIcon,
    Languages,
    Link as LinkIcon,
    ListTodo,
    Rss,
} from "lucide-react";

const contentFeatures = [
    {
        title: "Antrean Pos & Thread",
        description: "Lihat, kelola, dan prioritaskan konten yang dijadwalkan dan dalam draf.",
        icon: ListTodo,
        href: "/admin/content/queue",
    },
    {
        title: "Generator Konten",
        description: "Gunakan AI atau alat manual untuk membuat artikel dan thread baru.",
        icon: BotMessageSquare,
        href: "#",
    },
    {
        title: "Sumber & Feed Berita",
        description: "Lihat feed RSS yang dikonfigurasi yang menjadi sumber konten.",
        icon: Rss,
        href: "/admin/content/feeds",
    },
    {
        title: "Monitor Topik Tren",
        description: "Gunakan AI untuk menganalisis feed berita dan mengidentifikasi narasi pasar utama.",
        icon: Flame,
        href: "/admin/content/trending",
    },
    {
        title: "Alat Terjemahan",
        description: "Terjemahkan konten antar bahasa, seperti EN ke ID.",
        icon: Languages,
        href: "#",
    },
    {
        title: "Alat SEO & Tautan",
        description: "Optimalkan konten untuk mesin pencari dan kelola tautan internal.",
        icon: LinkIcon,
        href: "/admin/seo",
    },
    {
        title: "Generator Gambar",
        description: "Buat gambar unik untuk konten Anda menggunakan model AI.",
        icon: ImageIcon,
        href: "#",
    },
    {
        title: "Kalender Jadwal Konten",
        description: "Visualisasikan jadwal konten Anda dalam kalender mingguan atau bulanan.",
        icon: CalendarDays,
        href: "#",
    },
];


export default function ContentPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Manajemen Berita & Konten
                </h1>
                <p className="text-xl text-muted-foreground">
                    Rangkaian alat yang kuat untuk seluruh alur kerja konten Anda.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {contentFeatures.map((feature) => (
                    <Link
                        href={feature.href}
                        key={feature.title}
                        className="group block h-full"
                        aria-disabled={feature.href === '#'}
                        onClick={(e) => { if (feature.href === '#') e.preventDefault(); }}
                    >
                        <Card className="flex flex-col hover:border-primary/50 hover:shadow-lg transition-all h-full group-aria-disabled:pointer-events-none group-aria-disabled:opacity-60">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg font-headline">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
