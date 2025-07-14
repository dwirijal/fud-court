import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDetailedCoinData } from "@/lib/coingecko";
import { getDefiLlamaCoinData } from "@/lib/defillama";

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
import { DollarSign, TrendingUp, TrendingDown, Package, Scale, Zap, Link as LinkIcon } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TradingViewWidget from "@/components/molecules/trading-view-chart";
import DOMPurify from 'dompurify';


interface CoinPageProps {
  params: {
    id: string;
  };
}

const formatCurrency = (value: number, currency: string = 'usd', compact: boolean = false) => {
  if (value === null || isNaN(value)) return 'N/A';
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

const formatNumber = (value: number | null, compact: boolean = false) => {
  if (value === null || isNaN(value)) return 'N/A';
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
  const defiLlamaData = await getDefiLlamaCoinData(coinId);

  if (!coinData) {
    notFound();
  }

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

  const tvl = defiLlamaData?.tvl;
  const chains = defiLlamaData?.chains;
  const protocols = defiLlamaData?.protocols;
  
  const sanitizedDescription = description?.en ? DOMPurify.sanitize(description.en) : '';

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
            <BreadcrumbPage>{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mb-12 flex flex-col md:flex-row items-center gap-6">
        {image?.large && (
          <Image
            src={image.large}
            alt={name}
            width={96}
            height={96}
            className="rounded-full shadow-lg"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
            {name} <span className="text-muted-foreground text-3xl">({symbol?.toUpperCase()})</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Data harga, kapitalisasi pasar, dan informasi detail untuk {name}.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Harga Saat Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(current_price || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Perubahan 24j: {price_change_percentage_24h?.toFixed(2) || 'N/A'}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kapitalisasi Pasar</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(market_cap || 0, 'usd', true)}</div>
            <p className="text-xs text-muted-foreground">
              Volume 24j: {formatCurrency(total_volume || 0, 'usd', true)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked (TVL)</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Statistik Harga</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Harga Tertinggi 24j</TableCell>
                  <TableCell className="text-right">{formatCurrency(high_24h || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Harga Terendah 24j</TableCell>
                  <TableCell className="text-right">{formatCurrency(low_24h || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>All-Time High (ATH)</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(ath || 0)} ({ath_date ? format(new Date(ath_date), 'dd MMM yyyy') : 'N/A'})
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>All-Time Low (ATL)</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(atl || 0)} ({atl_date ? format(new Date(atl_date), 'dd MMM yyyy') : 'N/A'})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik Pasokan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Pasokan Beredar</TableCell>
                  <TableCell className="text-right">{formatNumber(circulating_supply)} {symbol?.toUpperCase()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Pasokan</TableCell>
                  <TableCell className="text-right">{formatNumber(total_supply)} {symbol?.toUpperCase()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pasokan Maksimum</TableCell>
                  <TableCell className="text-right">{formatNumber(max_supply)} {symbol?.toUpperCase()}</TableCell>
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
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Perubahan Harga (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>24 Jam</TableCell>
                <TableCell className={`text-right ${price_change_percentage_24h && price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_24h?.toFixed(2) || 'N/A'}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7 Hari</TableCell>
                <TableCell className={`text-right ${price_change_percentage_7d && price_change_percentage_7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_7d?.toFixed(2) || 'N/A'}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>30 Hari</TableCell>
                <TableCell className={`text-right ${price_change_percentage_30d && price_change_percentage_30d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_30d?.toFixed(2) || 'N/A'}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>1 Tahun</TableCell>
                <TableCell className={`text-right ${price_change_percentage_1y && price_change_percentage_1y >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {price_change_percentage_1y?.toFixed(2) || 'N/A'}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {sanitizedDescription && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Tentang {name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </CardContent>
        </Card>
      )}

      {links?.homepage?.[0] && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Tautan Resmi</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {links.homepage[0] && (
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
        <Card>
          <CardHeader>
            <CardTitle>Protokol DeFi Terkait</CardTitle>
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
    </div>
  );
}

