
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/ghost-admin";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { EditForm } from "./edit-form";

export default async function EditPostPage({ params }: { params: { id: string } }) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-2xl">
            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                    <Link href="/admin">Admin</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                    <Link href="/admin/content">News & Content</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                    <Link href="/admin/content/queue">Post & Thread Queue</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Edit Post</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Edit Post</CardTitle>
                    <CardDescription>
                        Make changes to your post and save them to Ghost CMS.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EditForm post={post} />
                </CardContent>
            </Card>
        </div>
    );
}
