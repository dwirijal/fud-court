
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { getRecentImages } from "@/lib/ghost-admin";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Copy, Download, Image as ImageIcon, Wand2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

async function ImageAssets() {
    const isGhostConfigured = !!process.env.GHOST_API_URL && !!process.env.GHOST_ADMIN_API_KEY;
    if (!isGhostConfigured) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Configuration Missing</AlertTitle>
                <AlertDescription>
                    Ghost Admin API keys are not configured. Please set `GHOST_API_URL` and `GHOST_ADMIN_API_KEY` in your environment variables to view image assets.
                </AlertDescription>
            </Alert>
        );
    }
    
    const images = await getRecentImages();

    if (images.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <ImageIcon className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold">No Images Found</h3>
                <p>No recent images were found in your published posts.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {images.map((image, index) => (
                <Card key={index} className="group overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative aspect-square w-full">
                            <Image
                                src={image.url}
                                alt={image.alt || `Library image ${index + 1}`}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                        <div className="p-2 text-xs">
                           <p className="truncate text-muted-foreground" title={image.alt || 'No alt text'}>{image.alt || 'No alt text'}</p>
                           <div className="flex gap-1 mt-2">
                                <Button size="icon" variant="ghost" className="h-6 w-6">
                                    <Copy className="h-3 w-3" />
                                    <span className="sr-only">Copy URL</span>
                                </Button>
                                <a href={image.url} download target="_blank" rel="noopener noreferrer">
                                     <Button size="icon" variant="ghost" className="h-6 w-6">
                                        <Download className="h-3 w-3" />
                                        <span className="sr-only">Download</span>
                                    </Button>
                                </a>
                           </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function AiAssets() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Under Construction
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">This section will contain a repository for reusable AI prompts, content templates, and other generated assets to streamline your content creation workflow.</p>
            </CardContent>
        </Card>
    );
}


export default function LibraryPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Content Library
                </h1>
                <p className="text-xl text-muted-foreground">
                    A central repository for your reusable assets.
                </p>
            </header>

             <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="images">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Image Assets
                    </TabsTrigger>
                    <TabsTrigger value="ai_assets">
                        <Wand2 className="mr-2 h-4 w-4" />
                        AI Assets
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="images" className="mt-6">
                    <ImageAssets />
                </TabsContent>
                <TabsContent value="ai_assets" className="mt-6">
                    <AiAssets />
                </TabsContent>
            </Tabs>
        </div>
    );
}
