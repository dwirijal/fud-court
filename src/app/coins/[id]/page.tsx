import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDetailedCoinData } from "@/lib/coingecko";
import { getDefiLlamaCoinData } from "@/lib/defillama";
import { getPosts } from "@/lib/ghost"; // Import getPosts
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Scale, Zap, Link as LinkIcon, Newspaper, Info } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TradingViewWidget from "@/components/molecules/trading-view-chart";
import { SanitizedHtml } from "@/components/atoms/sanitized-html";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

const formatNumber = (value: number | null | undefined, compact: boolean = false) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  if (compact) {
    options.notation = 'compact';
    options.maximumFractionDigits = 2;
  }
  return new Intl.NumberFormat('en-US', options).format(value);
};

export default async function CoinPage({ params }: CoinPageProps) {
  const awaitedParams = await Promise.resolve(params);
  const { id: coinId } = awaitedParams;
  const coinData = await getDetailedCoinData(coinId);
  if (!coinData) {
    notFound();
  }

  const defiLlamaData = await getDefiLlamaCoinData(coinData.symbol);

  const {
    name,
    symbol,
    image,
    current_price,
    market_cap,
    total_volume,
    high_24h,
    low_24h,
    ath,
    ath_date,
    atl,
    atl_date,
    circulating_supply,
    total_supply,
    max_supply,
    price_change_percentage_24h,
    price_change_percentage_7d,
    price_change_percentage_30d,
    price_change_percentage_1y,
    sentiment_votes_up_percentage,
    sentiment_votes_down_percentage,
    genesis_date,
    description,
    links,
  } = coinData;

  const { supportLevel, resistanceLevel } = calculateSupportResistanceLevels(current_price, ath, atl);

  const tvl = defiLlamaData?.tvl;
  const chains = defiLlamaData?.chains;
  const protocols = defiLlamaData?.protocols;
  
  // Fetch related articles based on coin symbol
  const relatedArticles = await getPosts({ tag: symbol?.toLowerCase(), limit: 3 });

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
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
            <BreadcrumbPage>{name ?? 'N/A'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12 flex flex-col md:flex-row items-center gap-6">
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
          <h1 className="text-4xl md:text-5xl font-semibold font-headline tracking-tight mb-2">
            {name ?? 'N/A'} <span className="text-muted-foreground text-2xl md:text-3xl">({symbol?.toUpperCase() ?? 'N/A'})</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Data harga, kapitalisasi pasar, dan informasi detail untuk {name ?? 'koin ini'}.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Harga Saat Ini</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(current_price)}</div>
            <p className="text-xs text-muted-foreground">
              Perubahan 24j: {price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Kapitalisasi Pasar</CardTitle>
            <Scale className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(market_cap, 'usd', true)}</div>
            <p className="text-xs text-muted-foreground">
              Volume 24j: {formatCurrency(total_volume, 'usd', true)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Value Locked (TVL)</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-8 w-3/4" />}>
              <div className="text-2xl font-bold">{tvl ? formatCurrency(tvl, 'usd', true) : 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {chains && chains.length > 0 ? `Jaringan: ${chains.join(', ')}` : 'Tidak ada data jaringan'}
              </p>
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Statistik Harga</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Harga Tertinggi 24j</TableCell>
                  <TableCell className="text-right">{formatCurrency(high_24h)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Harga Terendah 24j</TableCell>
                  <TableCell className="text-right">{formatCurrency(low_24h)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>All-Time High (ATH)</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(ath)} ({ath_date ? format(new Date(ath_date), 'dd MMM yyyy') : 'N/A'})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>All-Time Low (ATL)</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(atl)} ({atl_date ? format(new Date(atl_date), 'dd MMM yyyy') : 'N/A'})
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                        Level Support
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">Estimasi level support berdasarkan Fibonacci retracement dari ATH.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-chart-2 font-semibold">{formatCurrency(supportLevel)}</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                     <div className="flex items-center gap-1.5">
                        Level Resistance
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">Estimasi level resistance berdasarkan faktor pemulihan dari ATL.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-destructive font-semibold">{formatCurrency(resistanceLevel)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Statistik Pasokan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Pasokan Beredar</TableCell>
                  <TableCell className="text-right">{formatNumber(circulating_supply)} {symbol?.toUpperCase() ?? ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Pasokan</TableCell>
                  <TableCell className="text-right">{formatNumber(total_supply)} {symbol?.toUpperCase() ?? ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pasokan Maksimum</TableCell>
                  <TableCell className="text-right">{formatNumber(max_supply)} {symbol?.toUpperCase() ?? ''}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tanggal Genesis</TableCell>
                  <TableCell className="text-right">{genesis_date ? format(new Date(genesis_date), 'dd MMM yyyy') : 'N/A'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TradingViewWidget symbol={symbol || ''} />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Perubahan Harga (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>24 Jam</TableCell>
                <TableCell className={`text-right ${price_change_percentage_24h && price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7 Hari</TableCell>
                <TableCell className={`text-right ${price_change_percentage_7d && price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_7d?.toFixed(2) ?? 'N/A'}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>30 Hari</TableCell>
                <TableCell className={`text-right ${price_change_percentage_30d && price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_30d?.toFixed(2) ?? 'N/A'}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1 Tahun</TableCell>
                <TableCell className={`text-right ${price_change_percentage_1y && price_change_percentage_1y >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_1y?.toFixed(2) ?? 'N/A'}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {description?.en && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Tentang {name ?? 'koin ini'}</CardTitle>
          </CardHeader>
          <CardContent>
            <SanitizedHtml
              className="prose prose-invert prose-sm max-w-none"
              html={description.en}
            />
          </CardContent>
        </Card>
      )}

      {links && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Tautan Resmi</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {links.homepage?.[0] && (
                <li>
                  <Link href={links.homepage[0]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Situs Web Resmi
                  </Link>
                </li>
              )}
              {links.blockchain_site?.[0] && (
                <li>
                  <Link href={links.blockchain_site[0]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Blockchain Explorer
                  </Link>
                </li>
              )}
              {links.repos_url?.github?.[0] && (
                <li>
                  <Link href={links.repos_url.github[0]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> GitHub Repo
                  </Link>
                </li>
              )}
              {links.subreddit_url && (
                <li>
                  <Link href={links.subreddit_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Reddit
                  </Link>
                </li>
              )}
              {links.twitter_screen_name && (
                <li>
                  <Link href={`https://twitter.com/${links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Twitter
                  </Link>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {protocols && protocols.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Protokol DeFi Terkait</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {protocols.map((protocol, index) => (
                <Badge key={index} variant="secondary">
                  {protocol.name}
                </Badge>
              ))
            }
            </div>
          </CardContent>
        </Card>
      )}

      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-semibold font-headline tracking-tight mb-6 flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-muted-foreground" /> Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map((article) => (
              <Card key={article.id} className="flex flex-col overflow-hidden">
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
                <CardHeader className="flex-grow">
                  {article.primary_tag && (
                    <Badge variant="secondary" className="mb-2 w-fit">
                      {article.primary_tag.name}
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-headline leading-tight">
                    <Link href={`/news/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="text-sm text-muted-foreground">
                  Diterbitkan pada {format(new Date(article.published_at), "d MMMM yyyy")}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
