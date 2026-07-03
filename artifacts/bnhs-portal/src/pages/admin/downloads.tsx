import { useListDownloads, useCreateDownload, useUpdateDownload, useDeleteDownload, getListDownloadsQueryKey, Download } from '@workspace/api-client-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MoreHorizontal, Loader2, FileText, Download as DownloadIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const downloadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Must be a valid URL'),
});

type DownloadFormValues = z.infer<typeof downloadSchema>;

export default function AdminDownloads() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Download | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Download | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: downloadsData, isLoading } = useListDownloads(
    activeCategory !== 'all' ? { category: activeCategory } : {}, 
    { query: { queryKey: getListDownloadsQueryKey(activeCategory !== 'all' ? { category: activeCategory } : {}) } }
  );

  const createMutation = useCreateDownload();
  const updateMutation = useUpdateDownload();
  const deleteMutation = useDeleteDownload();

  const categories = ['School Forms', 'Enrollment Forms', 'School Calendar', 'Memoranda', 'PTA Documents', 'SSLG Documents', 'Others'];

  const form = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadSchema),
    defaultValues: { title: '', description: '', category: 'School Forms', fileName: '', fileUrl: '' }
  });

  const openAddForm = () => {
    setEditingItem(null);
    form.reset({ title: '', description: '', category: activeCategory !== 'all' ? activeCategory : 'School Forms', fileName: '', fileUrl: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (item: Download) => {
    setEditingItem(item);
    form.reset({
      title: item.title, description: item.description || '', category: item.category, fileName: item.fileName, fileUrl: item.fileUrl
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: DownloadFormValues) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data });
        toast({ title: 'Document updated' });
      } else {
        await createMutation.mutateAsync({ data });
        toast({ title: 'Document added' });
      }
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: getListDownloadsQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving document' });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: itemToDelete.id });
      toast({ title: 'Document deleted' });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: getListDownloadsQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting document' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Downloadable Resources</h1>
          <p className="text-muted-foreground">Manage forms, documents, and files for public download</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Document Info</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : downloadsData && downloadsData.length > 0 ? (
                downloadsData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="bg-primary/10 p-2 rounded-lg text-primary flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.fileName}</div>
                      {item.description && <div className="text-sm mt-1">{item.description}</div>}
                    </TableCell>
                    <TableCell>
                      <span className="bg-muted px-2 py-1 rounded text-xs">{item.category}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(item.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                              <DownloadIcon className="h-4 w-4 mr-2" /> Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditForm(item)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { setItemToDelete(item); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No documents found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Document' : 'Add Document'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Document Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="fileName" render={({ field }) => (
                  <FormItem><FormLabel>File Name</FormLabel><FormControl><Input {...field} placeholder="e.g. form-137.pdf" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="fileUrl" render={({ field }) => (
                  <FormItem><FormLabel>File URL</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />

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