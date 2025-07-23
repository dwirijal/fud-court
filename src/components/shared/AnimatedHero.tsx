
'use client';

import React, { useEffect } from 'react';
import anime from 'animejs';
import { cn } from '@/lib/utils/utils';
import Image from 'next/image';

const cryptoLogos = [
  'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
  'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  'https://cryptologos.cc/logos/tether-usdt-logo.svg',
  'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
  'https://cryptologos.cc/logos/solana-sol-logo.svg',
  'https://cryptologos.cc/logos/lido-dao-ldo-logo.svg',
  'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
  'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
  'https://cryptologos.cc/logos/dogecoin-doge-logo.svg',
  'https://cryptologos.cc/logos/toncoin-ton-logo.svg',
  'https://cryptologos.cc/logos/cardano-ada-logo.svg',
  'https://cryptologos.cc/logos/shiba-inu-shib-logo.svg',
  'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
  'https://cryptologos.cc/logos/chainlink-link-logo.svg',
  'https://cryptologos.cc/logos/tron-trx-logo.svg',
  'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg',
  'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg',
  'https://cryptologos.cc/logos/near-protocol-near-logo.svg',
  'https://cryptologos.cc/logos/uniswap-uni-logo.svg',
  'https://cryptologos.cc/logos/litecoin-ltc-logo.svg',
];

const AnimatedHero = () => {
  useEffect(() => {
    const titleEl = document.querySelector('.animated-title');
    if (titleEl) {
      const text = titleEl.textContent ?? '';
      titleEl.innerHTML = text.replace(/\S/g, "<span class='letter'>$&</span>");

      anime.timeline({ loop: false })
        .add({
          targets: '.animated-title .letter',
          translateY: ["1.1em", 0],
          translateX: ["0.55em", 0],
          translateZ: 0,
          rotateZ: [180, 0],
          duration: 750,
          easing: "easeOutExpo",
          delay: (el, i) => 50 * i
        });
    }

    anime({
        targets: '.crypto-logo',
        translateY: [20, -20],
        direction: 'alternate',
        loop: true,
        duration: (el, i) => 2000 + (i * 100),
        delay: (el, i) => i * 50,
        easing: 'easeInOutSine'
    });
  }, []);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-8 p-4 opacity-10 dark:opacity-5">
        {cryptoLogos.map((logo, i) => (
          <Image
            key={i}
            src={logo}
            alt={`Crypto logo ${i+1}`}
            width={80}
            height={80}
            className="crypto-logo w-12 h-12 md:w-20 md:h-20 object-contain"
          />
        ))}
      </div>
      <div className="relative z-10 text-center">
        <h1 className="animated-title text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Fud Court
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
          Klaritas dalam Kekacauan Cryptocurrency.
        </p>
      </div>
    </section>
  );
};

export { AnimatedHero };
