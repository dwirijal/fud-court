'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  { label: 'Active Traders', value: '50K+', icon: Users },
  { label: 'Markets Tracked', value: '1000+', icon: TrendingUp },
  { label: 'Real-time Data', value: '24/7', icon: Zap },
  { label: 'Security First', value: '100%', icon: Shield },
];

const floatingElements = [
  { id: 1, x: '10%', y: '20%', delay: 0 },
  { id: 2, x: '85%', y: '15%', delay: 0.5 },
  { id: 3, x: '15%', y: '80%', delay: 1 },
  { id: 4, x: '90%', y: '75%', delay: 1.5 },
];

export function ModernHero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute w-20 h-20 bg-gradient-to-r from-accent-primary/20 to-status-info/20 rounded-full blur-xl"
            style={{ left: element.x, top: element.y }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="outline" className="bg-bg-secondary/50 border-accent-primary/30 text-accent-primary px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Crypto Intelligence
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-text-primary via-accent-primary to-status-info bg-clip-text text-transparent">
              FUD Court
            </span>
            <br />
            <span className="text-text-secondary text-3xl md:text-4xl lg:text-5xl">
              Trading Intelligence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Advanced market analysis, real-time sentiment tracking, and algorithmic insights for serious crypto traders. Join our community of data-driven investors.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-accent-primary to-status-info hover:from-accent-primary/90 hover:to-status-info/90 text-black font-semibold px-8 py-3 rounded-2 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/25"
              asChild
            >
              <a href="/markets/dashboard" className="inline-flex items-center">
                Start Trading
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black px-8 py-3 rounded-2 transition-all duration-300"
              asChild
            >
              <a href="https://discord.gg/KC7dwruXYg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                <Users className="mr-2 w-5 h-5" />
                Join Discord Community
              </a>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="group relative p-6 bg-bg-secondary/50 backdrop-blur-sm border border-bg-quaternary rounded-2 hover:border-accent-primary/50 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 bg-accent-primary/10 rounded-full">
                    <stat.icon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {stat.label}
                  </div>
                </div>
                
                {/* Hover effect glow */}
                <div className="absolute inset-0 rounded-2 bg-gradient-to-r from-accent-primary/5 to-status-info/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-tertiary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-accent-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
