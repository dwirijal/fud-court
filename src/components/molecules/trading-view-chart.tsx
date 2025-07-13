'use client';

import React, { useEffect, useRef, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BINANCE:${symbol}USDT",
        "interval": "60",
        "timezone": "Asia/Jakarta",
        "theme": "dark",
        "style": "1",
        "locale": "id",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "save_image": true,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com",
        "backgroundColor": "var(--background)",
        "gridColor": "var(--border)",
        "details": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "hotlist": false,
        "watchlist": [],
        "withdateranges": true,
        "compareSymbols": [
          {
            "symbol": "BINANCE:BTCUSDT",
            "position": "SameScale"
          }
        ],
        "studies": []
      }`;
    container.current.appendChild(script);

    // Clean up script on component unmount
    const currentContainer = container.current;
    return () => {
      if (currentContainer && script.parentNode === currentContainer) {
        currentContainer.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>Grafik Harga ({symbol?.toUpperCase()}/USDT)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResizablePanelGroup direction="horizontal" className="min-h-[400px] items-stretch rounded-lg border">
          <ResizablePanel defaultSize={100}>
            <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
              <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
              <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/cryptocurrencies/prices-all/" rel="noopener nofollow" target="_blank"><span className="blue-text">Crypto Markets</span></a> by TradingView</div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}

export default memo(TradingViewWidget);
