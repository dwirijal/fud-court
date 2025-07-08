
import type { TokenProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Twitter, ExternalLink, MessageCircle } from "lucide-react";

// A simple map to get an icon for a social media name
const socialIconMap: { [key: string]: React.ReactNode } = {
  twitter: <Twitter className="h-4 w-4" />,
  telegram: <MessageCircle className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

export function TokenProfileCard({ profile }: { profile: TokenProfile }) {
    const { pair, websites, socials } = profile;

  return (
    <Card className="bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">
                {pair.baseToken.symbol}
            </CardTitle>
             <a href={pair.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                View on DexScreener <ExternalLink className="h-4 w-4" />
            </a>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground -mt-2 mb-4">{pair.baseToken.name}</p>
            <div className="flex flex-wrap gap-2">
                {websites?.map((site) => (
                    <Button key={site.url} asChild size="sm" variant="outline">
                        <a href={site.url} target="_blank" rel="noopener noreferrer">
                            {socialIconMap[site.label.toLowerCase()] || <Globe className="h-4 w-4" />}
                            <span>{site.label}</span>
                        </a>
                    </Button>
                ))}
                {socials?.map((social) => (
                    <Button key={social.url} asChild size="sm" variant="outline">
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                             {socialIconMap[social.name.toLowerCase()] || <ExternalLink className="h-4 w-4" />}
                             <span>{social.name}</span>
                        </a>
                    </Button>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
