import { useListAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement, getListAnnouncementsQueryKey, Announcement } from '@workspace/api-client-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MoreHorizontal, Loader2, Megaphone, AlertTriangle, Pin } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const annSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  isPinned: z.boolean().default(false),
  isEmergency: z.boolean().default(false),
  expiresAt: z.string().optional().or(z.literal('')),
});

type AnnFormValues = z.infer<typeof annSchema>;

export default function AdminAnnouncements() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Announcement | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: annData, isLoading } = useListAnnouncements({
    page, limit: 15
  }, { query: { queryKey: getListAnnouncementsQueryKey({ page, limit: 15 }) } });

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const form = useForm<AnnFormValues>({
    resolver: zodResolver(annSchema),
    defaultValues: { title: '', content: '', isPinned: false, isEmergency: false, expiresAt: '' }
  });

  const openAddForm = () => {
    setEditingItem(null);
    form.reset({ title: '', content: '', isPinned: false, isEmergency: false, expiresAt: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (item: Announcement) => {
    setEditingItem(item);
    form.reset({
      title: item.title, content: item.content, isPinned: item.isPinned, isEmergency: item.isEmergency, expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 16) : ''
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: AnnFormValues) => {
    try {
      // Ensure expiresAt is ISO or empty
      const payload = {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined
      };
      
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
        toast({ title: 'Announcement updated' });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: 'Announcement posted' });
      }
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving announcement' });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: itemToDelete.id });
      toast({ title: 'Deleted successfully' });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting announcement' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Announcements</h1>
          <p className="text-muted-foreground">Manage school-wide bulletins and emergency alerts</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : annData?.data && annData.data.length > 0 ? (
                annData.data.map((item) => (
                  <TableRow key={item.id} className={item.isEmergency ? 'bg-destructive/5 dark:bg-destructive/10' : ''}>
                    <TableCell>
                      {item.isEmergency ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <Megaphone className="h-5 w-5 text-primary" />}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{item.content}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        {item.isPinned && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded"><Pin className="h-3 w-3" /> Pinned</span>}
                        {item.isEmergency && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded">Emergency</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditForm(item)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { setItemToDelete(item); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No announcements found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          
          {annData && annData.total > annData.limit && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">Showing {(page - 1) * annData.limit + 1} to {Math.min(page * annData.limit, annData.total)} of {annData.total}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page * annData.limit >= annData.total} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Announcement' : 'New Announcement'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Message Content</FormLabel><FormControl><Textarea {...field} className="h-32" /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid sm:grid-cols-2 gap-4 border rounded-md p-4 bg-muted/30">
                <div className="space-y-4">
                  <FormField control={form.control} name="isPinned" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none"><FormLabel>Pin to dashboard</FormLabel></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="isEmergency" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-destructive font-bold">Emergency Alert</FormLabel>
                        <FormDescription>Shows prominently in a red banner on the public homepage</FormDescription>
                      </div>
                    </FormItem>
                  )} />
                </div>
                <div>
                  <FormField control={form.control} name="expiresAt" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration (Optional)</FormLabel>
                      <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      <FormDescription>Automatically hides after this date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
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
          <div className="py-4"><p>Are you sure you want to delete this announcement?</p></div>
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