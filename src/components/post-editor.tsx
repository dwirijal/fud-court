
'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Post } from "@/types/post"
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from './tiptap-editor'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type Props = {
  initial?: Partial<Post>
  onSubmit: (data: Post) => Promise<void>
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export function PostEditor({ initial = {}, onSubmit, isSubmitting, setIsSubmitting }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  
  const [post, setPost] = useState<Omit<Post, 'tags' | 'authors'>>({
    id: initial.id,
    title: initial.title || '',
    slug: initial.slug || '',
    html: initial.html || '',
    excerpt: initial.excerpt || '',
    featureImage: initial.featureImage || '',
    status: initial.status || 'draft',
    updated_at: initial.updated_at,
    feature_image_alt: initial.feature_image_alt || '',
    feature_image_caption: initial.feature_image_caption || '',
    published_at: initial.published_at || '',
    visibility: initial.visibility || 'public',
    meta_title: initial.meta_title || '',
    meta_description: initial.meta_description || '',
    og_title: initial.og_title || '',
    og_description: initial.og_description || '',
    og_image: initial.og_image || '',
    twitter_title: initial.twitter_title || '',
    twitter_description: initial.twitter_description || '',
    twitter_image: initial.twitter_image || '',
    canonical_url: initial.canonical_url || '',
    email_subject: initial.email_subject || '',
    send_email_when_published: initial.send_email_when_published || false,
    codeinjection_head: initial.codeinjection_head || '',
    codeinjection_foot: initial.codeinjection_foot || '',
  });

  // Handle tags and authors separately as comma-separated strings in the UI
  const [tagsInput, setTagsInput] = useState(initial.tags?.join(', ') || '');
  const [authorsInput, setAuthorsInput] = useState(initial.authors?.join(', ') || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPost(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (newContent: string) => {
    setPost(prev => ({ ...prev, html: newContent }));
  };
  
  const handleFormSubmit = async (newStatus: Post['status']) => {
    setIsSubmitting(true);
    const dataToSubmit: Post = { 
      ...post, 
      status: newStatus,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      authors: authorsInput.split(',').map(a => a.trim()).filter(Boolean),
    };

    try {
        await onSubmit(dataToSubmit);
        toast({
            title: 'Sukses!',
            description: `Pos telah ${newStatus === 'published' ? 'diterbitkan' : 'disimpan'}.`
        });
        // Redirect is handled by the server action
    } catch (error) {
        console.error(error);
        toast({
            title: `Error saat ${newStatus === 'published' ? 'menerbitkan' : 'menyimpan'} pos`,
            description: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.",
            variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
      <div>
        <Label htmlFor="title">Judul</Label>
        <Input id="title" name="title" value={post.title} onChange={handleChange} placeholder="Judul pos Anda" disabled={isSubmitting} />
      </div>

      <div>
        <Label htmlFor="html-editor">Konten</Label>
        <TiptapEditor
          content={post.html}
          onChange={handleContentChange}
          disabled={isSubmitting}
        />
      </div>

      <Accordion type="multiple" className="w-full space-y-2">
        <AccordionItem value="general-settings" className="border rounded-md px-4">
          <AccordionTrigger>Pengaturan Umum</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="slug">Slug (Opsional)</Label>
                <Input id="slug" name="slug" value={post.slug} onChange={handleChange} placeholder="slug-pos-anda" disabled={isSubmitting} />
              </div>
               <div>
                  <Label htmlFor="published_at">Tanggal Terbit (Opsional)</Label>
                  <Input id="published_at" name="published_at" type="datetime-local" value={post.published_at} onChange={handleChange} disabled={isSubmitting} />
                  <p className="text-sm text-muted-foreground">Atur tanggal di masa depan untuk menjadwalkan pos ini.</p>
              </div>
              <div>
                <Label htmlFor="excerpt">Kutipan (Opsional)</Label>
                <Textarea id="excerpt" name="excerpt" value={post.excerpt} onChange={handleChange} placeholder="Ringkasan singkat dari pos Anda." disabled={isSubmitting} />
              </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="feature-image" className="border rounded-md px-4">
          <AccordionTrigger>Gambar Unggulan</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="featureImage">URL Gambar Unggulan</Label>
                <Input id="featureImage" name="featureImage" value={post.featureImage} onChange={handleChange} placeholder="https://example.com/image.png" disabled={isSubmitting} />
              </div>
              <div>
                <Label htmlFor="feature_image_alt">Teks Alt Gambar</Label>
                <Input id="feature_image_alt" name="feature_image_alt" value={post.feature_image_alt} onChange={handleChange} placeholder="Teks alt deskriptif untuk gambar" disabled={isSubmitting} />
              </div>
              <div>
                <Label htmlFor="feature_image_caption">Keterangan Gambar</Label>
                <Textarea id="feature_image_caption" name="feature_image_caption" value={post.feature_image_caption} onChange={handleChange} placeholder="Teks keterangan untuk gambar" disabled={isSubmitting} rows={2} />
              </div>
          </AccordionContent>
        </AccordionItem>

         <AccordionItem value="tags-authors" className="border rounded-md px-4">
          <AccordionTrigger>Tag & Penulis</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
              <div>
                  <Label htmlFor="tags">Tag</Label>
                  <Input id="tags" name="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="kripto, berita, analisis" disabled={isSubmitting} />
                  <p className="text-sm text-muted-foreground">Pisahkan tag dengan koma.</p>
              </div>
              <div>
                  <Label htmlFor="authors">Penulis</Label>
                  <Input id="authors" name="authors" value={authorsInput} onChange={(e) => setAuthorsInput(e.target.value)} placeholder="penulis@example.com, lain@example.com" disabled={isSubmitting} />
                  <p className="text-sm text-muted-foreground">Pisahkan email penulis dengan koma.</p>
              </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seo-social" className="border rounded-md px-4">
          <AccordionTrigger>SEO & Media Sosial</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
                <Label htmlFor="canonical_url">URL Kanonikal</Label>
                <Input id="canonical_url" name="canonical_url" value={post.canonical_url} onChange={handleChange} placeholder="URL sumber asli jika memposting ulang" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="meta_title">Judul Meta</Label>
              <Input id="meta_title" name="meta_title" value={post.meta_title} onChange={handleChange} placeholder="Judul ramah SEO" disabled={isSubmitting} />
            </div>
             <div>
              <Label htmlFor="meta_description">Deskripsi Meta</Label>
              <Input id="meta_description" name="meta_description" value={post.meta_description} onChange={handleChange} placeholder="Deskripsi ramah SEO" disabled={isSubmitting} />
            </div>
             <div>
              <Label htmlFor="og_title">Judul Open Graph</Label>
              <Input id="og_title" name="og_title" value={post.og_title} onChange={handleChange} placeholder="Judul untuk berbagi di media sosial" disabled={isSubmitting} />
            </div>
             <div>
              <Label htmlFor="og_description">Deskripsi Open Graph</Label>
              <Input id="og_description" name="og_description" value={post.og_description} onChange={handleChange} placeholder="Deskripsi untuk berbagi di media sosial" disabled={isSubmitting} />
            </div>
             <div>
              <Label htmlFor="twitter_title">Judul Twitter</Label>
              <Input id="twitter_title" name="twitter_title" value={post.twitter_title} onChange={handleChange} placeholder="Judul untuk kartu Twitter" disabled={isSubmitting} />
            </div>
             <div>
              <Label htmlFor="twitter_description">Deskripsi Twitter</Label>
              <Input id="twitter_description" name="twitter_description" value={post.twitter_description} onChange={handleChange} placeholder="Deskripsi untuk kartu Twitter" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="og_image">URL Gambar Open Graph</Label>
              <Input id="og_image" name="og_image" value={post.og_image} onChange={handleChange} placeholder="URL gambar untuk berbagi di media sosial" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="twitter_image">URL Gambar Twitter</Label>
              <Input id="twitter_image" name="twitter_image" value={post.twitter_image} onChange={handleChange} placeholder="URL gambar untuk kartu Twitter" disabled={isSubmitting} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="advanced" className="border rounded-md px-4">
          <AccordionTrigger>Akses, Email &amp; Lanjutan</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="visibility">Visibilitas</Label>
                    <Select value={post.visibility} onValueChange={(value) => setPost(p => ({...p, visibility: value as any}))} disabled={isSubmitting}>
                        <SelectTrigger id="visibility">
                            <SelectValue placeholder="Pilih visibilitas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">Publik</SelectItem>
                            <SelectItem value="members">Hanya anggota</SelectItem>
                            <SelectItem value="paid">Hanya anggota berbayar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label htmlFor="email_subject">Subjek Email</Label>
                    <Input id="email_subject" name="email_subject" value={post.email_subject} onChange={handleChange} placeholder="Subjek email kustom" disabled={isSubmitting} />
                </div>
            </div>
             <div className="flex items-center space-x-2">
                <Switch 
                  id="send_email_when_published" 
                  checked={post.send_email_when_published} 
                  onCheckedChange={(checked) => setPost(p => ({...p, send_email_when_published: checked}))}
                  disabled={isSubmitting}
                />
                <Label htmlFor="send_email_when_published">Kirim email ke pelanggan saat diterbitkan</Label>
            </div>
            <div>
              <Label htmlFor="codeinjection_head">Injeksi Kode (Head)</Label>
              <Textarea id="codeinjection_head" name="codeinjection_head" value={post.codeinjection_head} onChange={handleChange} placeholder="Tag <style> atau <script> untuk <head>" disabled={isSubmitting} rows={3} />
            </div>
            <div>
              <Label htmlFor="codeinjection_foot">Injeksi Kode (Footer)</Label>
              <Textarea id="codeinjection_foot" name="codeinjection_foot" value={post.codeinjection_foot} onChange={handleChange} placeholder="Tag <script> di akhir <body>" disabled={isSubmitting} rows={3} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-4">
            <Button type="button" variant="default" onClick={() => handleFormSubmit('published')} disabled={isSubmitting}>
                {isSubmitting ? 'Menerbitkan...' : 'Simpan & Terbitkan'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleFormSubmit('draft')} disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan sebagai Draf'}
            </Button>
        </div>
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            Batal
        </Button>
      </div>
    </form>
  )
}
