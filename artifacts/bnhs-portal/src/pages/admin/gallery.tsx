import { useListGallery, useCreateGalleryItem, useDeleteGalleryItem, getListGalleryQueryKey, GalleryItem, GalleryInputMediaType } from '@workspace/api-client-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, Image as ImageIcon, Video, PlayCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  mediaType: z.enum(['photo', 'video']),
  url: z.string().url('Must be a valid URL'),
  thumbnailUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

export default function AdminGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: galleryData, isLoading } = useListGallery(
    activeCategory !== 'all' ? { category: activeCategory } : {}, 
    { query: { queryKey: getListGalleryQueryKey(activeCategory !== 'all' ? { category: activeCategory } : {}) } }
  );

  const createMutation = useCreateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const categories = ['Activities', 'Recognition', 'Sports', 'Graduation', 'Brigada Eskwela', 'Facilities', 'Events'];

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { title: '', description: '', mediaType: 'photo', url: '', thumbnailUrl: '', category: 'Activities' }
  });

  const mediaType = form.watch('mediaType');

  const openAddForm = () => {
    form.reset({ title: '', description: '', mediaType: 'photo', url: '', thumbnailUrl: '', category: activeCategory !== 'all' ? activeCategory : 'Activities' });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: GalleryFormValues) => {
    try {
      await createMutation.mutateAsync({ data });
      toast({ title: 'Media added to gallery' });
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error adding media' });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: itemToDelete.id });
      toast({ title: 'Media deleted' });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: getListGalleryQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting media' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Media Gallery</h1>
          <p className="text-muted-foreground">Manage school photos and videos</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Media
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="overflow-x-auto pb-2 -mb-2">
            <TabsList className="inline-flex w-max min-w-full">
              <TabsTrigger value="all">All Media</TabsTrigger>
              {categories.map(c => <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : galleryData && galleryData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryData.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-video bg-muted border-b">
                {item.mediaType === 'video' ? (
                  <>
                    <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircle className="h-12 w-12 text-white/90" />
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                    {item.mediaType === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="destructive" size="sm" onClick={() => { setItemToDelete(item); setIsDeleteDialogOpen(true); }}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                {item.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-card rounded-xl border border-dashed">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p>No media found in this category.</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add Media to Gallery</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="mediaType" render={({ field }) => (
                  <FormItem><FormLabel>Media Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="url" render={({ field }) => (
                <FormItem><FormLabel>{mediaType === 'video' ? 'Video URL (YouTube/Direct)' : 'Image URL'}</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
              )} />

              {mediaType === 'video' && (
                <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (
                  <FormItem><FormLabel>Thumbnail URL (optional)</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
                )} />
              )}

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Upload
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <div className="py-4"><p>Are you sure you want to delete this media item?</p></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}