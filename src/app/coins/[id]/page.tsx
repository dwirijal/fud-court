
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDetailedCoinData } from "@/lib/coingecko";
import { getDefiLlamaCoinData } from "@/lib/defillama";
import { getPosts } from "@/lib/ghost";
import { calculateSupportResistanceLevels } from "@/lib/calculations";

import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Scale, Zap, Link as LinkIcon, Newspaper, Info } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TradingViewWidget from "@/components/molecules/trading-view-chart";
import { SanitizedHtml } from "@/components/atoms/sanitized-html";

interface CoinPageProps {
  params: {
    id: string;
  };
}

const formatCurrency = (value: number | null | undefined, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  } else if (value < 1) {
    options.maximumFractionDigits = 6;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

const StatCard = ({ icon: Icon, title, value, description }: { icon: React.ElementType, title: string, value: React.ReactNode, description?: React.ReactNode }) => (
    <div className="card-primary">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="body-regular font-semibold">{title}</h3>
          <Icon className="h-5 w-5 text-text-tertiary" />
      </div>
      <div>
          <div className="number-large">{value}</div>
          {description && <p className="caption-regular text-text-secondary">{description}</p>}
      </div>
    </div>
);

const PriceStatsTable = ({ data, support, resistance }: { data: any, support: number | null, resistance: number | null }) => (
    <div className="card-primary">
        <h3 className="headline-6 mb-4">Statistik Harga</h3>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>Harga Tertinggi 24j</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.high_24h)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Harga Terendah 24j</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.low_24h)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>All-Time High (ATH)</TableCell>
                    <TableCell className="text-right">
                        {formatCurrency(data.ath)} ({data.ath_date ? format(new Date(data.ath_date), 'dd MMM yyyy') : 'N/A'})
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>All-Time Low (ATL)</TableCell>
                    <TableCell className="text-right">
                        {formatCurrency(data.atl)} ({data.atl_date ? format(new Date(data.atl_date), 'dd MMM yyyy') : 'N/A'})
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Level Support</TableCell>
                    <TableCell className="text-right text-market-up font-semibold">{formatCurrency(support)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Level Resistance</TableCell>
                    <TableCell className="text-right text-market-down font-semibold">{formatCurrency(resistance)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
);

const CoinLinks = ({ links }: { links: any }) => (
    <div className="card-primary">
        <h3 className="headline-6 mb-4">Tautan Resmi</h3>
        <div className="grid grid-cols-2 gap-4">
            {links.homepage?.[0] && (
                <Link href={links.homepage[0]} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm justify-start">
                  <LinkIcon className="h-4 w-4" /> Situs Web Resmi
                </Link>
            )}
            {links.blockchain_site?.[0] && (
                 <Link href={links.blockchain_site[0]} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm justify-start">
                  <LinkIcon className="h-4 w-4" /> Penjelajah Blok
                </Link>
            )}
            {links.subreddit_url && (
                <Link href={links.subreddit_url} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm justify-start">
                  <LinkIcon className="h-4 w-4" /> Subreddit
                </Link>
            )}
            {links.repos_url?.github?.[0] && (
                <Link href={links.repos_url.github[0]} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm justify-start">
                  <LinkIcon className="h-4 w-4" /> GitHub
                </Link>
            )}
        </div>
    </div>
)


export default async function CoinPage({ params }: CoinPageProps) {
  const coinData = await getDetailedCoinData(params.id);
  if (!coinData) {
    notFound();
  }

  const defiLlamaData = await getDefiLlamaCoinData(coinData.symbol);
  const { supportLevel, resistanceLevel } = calculateSupportResistanceLevels(coinData.current_price, coinData.ath, coinData.atl);
  const relatedArticles = await getPosts({ tag: coinData.symbol?.toLowerCase(), limit: 3 });

  const { name, symbol, image, current_price, market_cap, total_volume, description, links, price_change_percentage_24h } = coinData;

  return (
    <div className="container-full section-spacing">
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
            <BreadcrumbPage>{name ?? 'N/A'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-7 flex flex-col md:flex-row items-center gap-6">
        {image?.large && (
          <Image
            src={image.large}
            alt={name ?? ''}
            width={80}
            height={80}
            className="rounded-full shadow-lg h-20 w-20"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="headline-2 mb-2">
            {name ?? 'N/A'} <span className="text-text-secondary">({symbol?.toUpperCase() ?? 'N/A'})</span>
          </h1>
          <p className="body-large text-text-secondary max-w-3xl">
            Data harga, kapitalisasi pasar, dan informasi detail untuk {name ?? 'koin ini'}.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard 
            icon={DollarSign} 
            title="Harga Saat Ini"
            value={formatCurrency(current_price)}
            description={`Perubahan 24j: ${price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%`}
        />
        <StatCard 
            icon={Scale} 
            title="Kapitalisasi Pasar"
            value={formatCurrency(market_cap, 'usd', true)}
            description={`Volume 24j: ${formatCurrency(total_volume, 'usd', true)}`}
        />
         <Suspense fallback={<Skeleton className="card-primary h-[124px]" />}>
            <StatCard 
                icon={Zap} 
                title="Total Value Locked (TVL)"
                value={defiLlamaData?.tvl ? formatCurrency(defiLlamaData.tvl, 'usd', true) : 'N/A'}
                description={defiLlamaData?.chains && defiLlamaData.chains.length > 0 ? `Jaringan: ${defiLlamaData.chains.join(', ')}` : 'Tidak ada data jaringan'}
            />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PriceStatsTable data={coinData} support={supportLevel} resistance={resistanceLevel} />
        {links && <CoinLinks links={links} />}
      </div>

      <TradingViewWidget symbol={symbol || ''} />
      
      {description?.en && (
        <div className="card-primary my-6">
          <h3 className="headline-6 mb-4">Tentang {name ?? 'koin ini'}</h3>
          <SanitizedHtml
            className="prose prose-invert max-w-none prose-p:body-regular prose-headings:text-text-primary prose-a:text-accent-primary"
            html={description.en}
          />
        </div>
      )}

      {relatedArticles.length > 0 && (
        <section className="mt-7">
          <h2 className="headline-4 mb-5 flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-text-secondary" /> Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <div key={article.id} className="card-news flex flex-col overflow-hidden">
                {article.feature_image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={article.feature_image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex-grow p-4">
                  {article.primary_tag && (
                    <Badge variant="secondary" className="mb-2 w-fit">
                      {article.primary_tag.name}
                    </Badge>
                  )}
                  <h3 className="headline-6 leading-tight">
                    <Link href={`/news/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="body-small text-text-secondary line-clamp-3 mt-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="caption-regular text-text-tertiary p-4 pt-0">
                  Diterbitkan pada {format(new Date(article.published_at), "d MMMM yyyy")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
