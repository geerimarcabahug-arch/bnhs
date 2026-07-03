import { useListPersonnel, useCreatePersonnel, useUpdatePersonnel, useDeletePersonnel, getListPersonnelQueryKey, Personnel, PersonnelInput, ListPersonnelType, PersonnelInputType } from '@workspace/api-client-react';
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, MoreHorizontal, Loader2, UserCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const personnelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  type: z.enum(['teaching', 'non_teaching', 'admin']),
  department: z.string().optional(),
  advisoryClass: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  office: z.string().optional(),
  photoUrl: z.string().url('Invalid URL').optional().or(z.literal(''))
});

type PersonnelFormValues = z.infer<typeof personnelSchema>;

export default function AdminPersonnel() {
  const [activeTab, setActiveTab] = useState<ListPersonnelType>('teaching');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Personnel | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Personnel | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearch(val), 500);
  };

  const { data: personnelData, isLoading } = useListPersonnel({
    type: activeTab,
    search: debouncedSearch || undefined
  }, { query: { queryKey: getListPersonnelQueryKey({ type: activeTab, search: debouncedSearch || undefined }) } });

  const createMutation = useCreatePersonnel();
  const updateMutation = useUpdatePersonnel();
  const deleteMutation = useDeletePersonnel();

  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelSchema),
    defaultValues: {
      name: '', position: '', type: activeTab || 'teaching', department: '', advisoryClass: '', email: '', office: '', photoUrl: ''
    }
  });

  const openAddForm = () => {
    setEditingItem(null);
    form.reset({ name: '', position: '', type: activeTab || 'teaching', department: '', advisoryClass: '', email: '', office: '', photoUrl: '' });
    setIsFormOpen(true);
  };

  const openEditForm = (item: Personnel) => {
    setEditingItem(item);
    form.reset({
      name: item.name, position: item.position, type: item.type as PersonnelInputType, department: item.department || '', advisoryClass: item.advisoryClass || '', email: item.email || '', office: item.office || '', photoUrl: item.photoUrl || ''
    });
    setIsFormOpen(true);
  };

  const onSubmit = async (data: PersonnelFormValues) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: data as PersonnelInput });
        toast({ title: 'Personnel updated successfully' });
      } else {
        await createMutation.mutateAsync({ data: data as PersonnelInput });
        toast({ title: 'Personnel added successfully' });
      }
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: getListPersonnelQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error saving personnel' });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: itemToDelete.id });
      toast({ title: 'Personnel deleted successfully' });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: getListPersonnelQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting personnel' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Personnel Directory</h1>
          <p className="text-muted-foreground">Manage teaching and non-teaching staff</p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Personnel
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Tabs value={activeTab || ''} onValueChange={(val) => setActiveTab(val as ListPersonnelType)} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="teaching">Teaching</TabsTrigger>
                <TabsTrigger value="non_teaching">Non-Teaching</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search name or position..." className="pl-9" value={searchQuery} onChange={handleSearch} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personnel</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department / Office</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : personnelData && personnelData.length > 0 ? (
                personnelData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border bg-muted">
                          <AvatarImage src={item.photoUrl || ''} />
                          <AvatarFallback><UserCircle className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{item.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{item.position}</div>
                      {item.advisoryClass && <div className="text-xs text-muted-foreground">Adviser: {item.advisoryClass}</div>}
                    </TableCell>
                    <TableCell>{item.department || item.office || '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.email || '-'}</TableCell>
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
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No personnel found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Personnel' : 'Add New Personnel'}</DialogTitle></DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem><FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="teaching">Teaching</SelectItem>
                        <SelectItem value="non_teaching">Non-Teaching</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="position" render={({ field }) => (
                  <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem><FormLabel>Department (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="advisoryClass" render={({ field }) => (
                  <FormItem><FormLabel>Advisory Class (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="office" render={({ field }) => (
                  <FormItem><FormLabel>Office (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email (optional)</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="photoUrl" render={({ field }) => (
                  <FormItem><FormLabel>Photo URL (optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
          <div className="py-4"><p>Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?</p></div>
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