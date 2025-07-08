import Link from "next/link";
import { Logo } from "@/components/atoms/logo";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Logo and Description */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Logo />
              <span className="text-xl font-semibold font-headline tracking-tight text-foreground">
                Fud Court
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Clarity in Chaos. Fud Court cuts through the market noise with
              data-driven analysis and unbiased news.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 text-foreground">Explore</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/markets" className="text-sm text-muted-foreground hover:text-primary transition-colors">Markets</Link>
            </nav>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 text-foreground">Content</h3>
            <nav className="flex flex-col space-y-2">
                <Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">News</Link>
                <Link href="/articles" className="text-sm text-muted-foreground hover:text-primary transition-colors">Articles</Link>
                <Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">Learn</Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="md:col-span-4 text-left md:text-right">
            <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
            <div className="flex md:justify-end space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fud Court. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
