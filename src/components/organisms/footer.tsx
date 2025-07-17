
import Link from "next/link";
import { Logo } from "@/components/atoms/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Logo />
              <span className="text-xl font-semibold tracking-tight text-foreground">
                Fud Court
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Clarity in Chaos. Fud Court cuts through market noise with data-driven analysis and unbiased news.
            </p>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 text-foreground">Jelajahi</h3>
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Beranda</Link>
              <Link href="/markets" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pasar</Link>
            </nav>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 text-foreground">Konten</h3>
            <nav className="flex flex-col space-y-3">
                <Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">Berita</Link>
                <Link href="/articles" className="text-sm text-muted-foreground hover:text-primary transition-colors">Artikel</Link>
                <Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">Belajar</Link>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fud Court. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
