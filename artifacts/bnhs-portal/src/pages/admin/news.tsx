import { useListNews, useCreateNews, useUpdateNews, useDeleteNews, getListNewsQueryKey, News } from '@workspace/api-client-react';
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, MoreHorizontal, Loader2, Pin, PinOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  coverImage: z.string().optional().or(z.literal('')),
  isPinned: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

type NewsFormValues = z.infer<typeof newsSchema>;

export default function AdminNews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<News | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<News | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => { setDebouncedSearch(val); setPage(1); }, 500);
  };

  const { data: newsData, isLoading } = useListNews({
    search: debouncedSearch || undefined,
    page,
    limit: 10
  }, { query: { queryKey: getListNewsQueryKey({ search: debouncedSearch || undefined, page, limit: 10 }) } });

  const createMutation = useCreateNews();
  const updateMutation = useUpdateNews();
  const deleteMutation = useDeleteNews();

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: { title: '', content: '', excerpt: '', category: 'General', coverImage: '', isPinned: false, isArchived: false }
  });

  const openAddForm = () => {
    setEditingItem(null);
    form.reset({ title: '', content: '', excerpt: '', category: 'General', coverImage: '', isPinned: false, isArchived: false });
    setIsFormOpen(true);
  };

  const openEditForm = (item: News) => {
    setEditingItem(item);
    form.reset({
      title: item.title, content: item.content, excerpt: item.excerpt || '', category: item.category, coverImage: item.coverImage || '', isPinned: item.isPinned, isArchived: item.isArchived
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: NewsFormValues) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data });
        toast({ title: 'News updated successfully' });
      } else {
        await createMutation.mutateAsync({ data });
        toast({ title: 'News published successfully' });
      }
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving news' });
    }
  };

  const togglePin = async (item: News) => {
    try {
      await updateMutation.mutateAsync({ id: item.id, data: { isPinned: !item.isPinned } });
      toast({ title: item.isPinned ? 'News unpinned' : 'News pinned' });
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    } catch (e) {}
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: itemToDelete.id });
      toast({ title: 'News deleted successfully' });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting news' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">News & Updates</h1>
          <p className="text-muted-foreground">Manage school news articles and updates</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Publish News
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search news..." className="pl-9" value={searchQuery} onChange={handleSearch} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : newsData?.data && newsData.data.length > 0 ? (
                newsData.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium text-sm line-clamp-1">{item.title}</div>
                      {item.isPinned && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-secondary mt-1"><Pin className="h-3 w-3" /> Pinned</span>}
                    </TableCell>
                    <TableCell><span className="bg-muted px-2 py-1 rounded text-xs">{item.category}</span></TableCell>
                    <TableCell>
                      {item.isArchived ? <span className="text-xs text-muted-foreground">Archived</span> : <span className="text-xs text-green-600 font-medium">Published</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(item.publishedAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => togglePin(item)}>
                            {item.isPinned ? <><PinOff className="h-4 w-4 mr-2" /> Unpin</> : <><Pin className="h-4 w-4 mr-2" /> Pin to top</>}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditForm(item)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { setItemToDelete(item); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No news articles found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          
          {newsData && newsData.total > newsData.limit && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">Showing {(page - 1) * newsData.limit + 1} to {Math.min(page * newsData.limit, newsData.total)} of {newsData.total}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page * newsData.limit >= newsData.total} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit News' : 'Publish News'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="coverImage" render={({ field }) => (
                  <FormItem><FormLabel>Cover Image URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Excerpt / Summary</FormLabel><FormControl><Textarea {...field} className="h-16" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Full Content (Markdown/HTML supported in view)</FormLabel><FormControl><Textarea {...field} className="h-48" /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="flex gap-6 border rounded-md p-4 bg-muted/30">
                <FormField control={form.control} name="isPinned" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none"><FormLabel>Pin to top</FormLabel></div>
                  </FormItem>
                )} />
                <FormField control={form.control} name="isArchived" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none"><FormLabel>Archive (Hide from public)</FormLabel></div>
                  </FormItem>
                )} />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <div className="py-4"><p>Are you sure you want to delete <strong>{itemToDelete?.title}</strong>?</p></div>
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