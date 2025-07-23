
'use client';

import { AnimatedHero } from '@/components/shared/AnimatedHero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "Analisis Berbasis AI",
      description: "Manfaatkan model AI canggih untuk mendapatkan skor sentimen pasar dan wawasan prediktif yang tidak akan Anda temukan di tempat lain."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Data Real-time & Komprehensif",
      description: "Akses data pasar terbaru dari berbagai sumber, termasuk CoinGecko, Binance, dan DeFiLlama, semuanya di satu tempat."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Alat Canggih untuk Trader",
      description: "Dari analisis Degen hingga data yield farming, Fud Court menyediakan alat yang Anda butuhkan untuk tetap menjadi yang terdepan di pasar."
    }
  ];

  return (
    <>
      <AnimatedHero />
      <div className="container mx-auto max-w-5xl py-12 px-4 md:px-6">
        <div className="prose dark:prose-invert max-w-none text-lg text-center mb-12">
          <p>
            Fud Court adalah dasbor canggih yang didorong oleh data, dirancang untuk memberikan kejelasan di tengah dunia cryptocurrency yang penuh gejolak. Kami menyediakan alat canggih untuk analisis pasar, agregasi berita, dan wawasan, semuanya dalam satu antarmuka yang dirancang dengan indah.
          </p>
          <p>
            Dibangun dengan Next.js dan memanfaatkan tumpukan teknologi modern, Fud Court berfungsi sebagai pusat komando lengkap untuk para penggemar dan trader kripto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit">
                  {feature.icon}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="text-center bg-primary text-primary-foreground p-8">
            <CardHeader>
                <Users className="h-10 w-10 mx-auto mb-4" />
                <CardTitle className="text-3xl">Bergabunglah dengan Komunitas Kami</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="max-w-2xl mx-auto mb-6 text-lg">
                Terhubung dengan trader dan penggemar lain, diskusikan strategi, dan jadilah yang pertama mengetahui tentang fitur-fitur baru.
                </p>
                <Link
                    href="https://discord.gg/Dh6CUWJ6bT"
                    target="_blank"
                    className="inline-block px-8 py-3 text-lg font-semibold rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition"
                >
                    Gabung Discord
                </Link>
            </CardContent>
        </Card>

      </div>
    </>
  );
}
