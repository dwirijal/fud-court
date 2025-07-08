
import type { TokenProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Twitter, MessageCircle, Link as LinkIcon } from "lucide-react";
import Image from 'next/image';

const socialIconMap: { [key: string]: React.ReactNode } = {
  twitter: <Twitter className="h-4 w-4" />,
  x: <Twitter className="h-4 w-4" />,
  telegram: <MessageCircle className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
};

export function TokenProfileCard({ profile }: { profile: TokenProfile }) {
    const { url, tokenAddress, description, links, icon } = profile;
    
    // Use description as title, fallback to a truncated token address.
    const title = description || `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`;

    const validLinks = (links || []).filter(link => link && link.label && link.url);

    return (
        <Card className="bg-card/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3 overflow-hidden">
                    {icon && (
                        <Image src={icon} alt={title} width={24} height={24} className="rounded-full shrink-0" />
                    )}
                    <CardTitle className="text-lg font-bold truncate" title={title}>
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mt-4">
                    {validLinks.length > 0 ? validLinks.map((link) => (
                        <Button key={link.url} asChild size="sm" variant="outline">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {socialIconMap[link.label.toLowerCase()] || <LinkIcon className="h-4 w-4" />}
                                <span>{link.label}</span>
                            </a>
                        </Button>
                    )) : (
                        <p className="text-sm text-muted-foreground">No links provided.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
