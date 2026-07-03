import { useGetSSLG, useUpdateSSLG, useListSSLGOfficers, useCreateSSLGOfficer, useDeleteSSLGOfficer, getGetSSLGQueryKey, getListSSLGOfficersQueryKey, SSLGOfficer } from '@workspace/api-client-react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, Save } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const sslgSchema = z.object({
  adviserName: z.string().min(1, 'Adviser name is required'),
  schoolYear: z.string().min(1, 'School year is required'),
  description: z.string().optional(),
  projects: z.string().optional(),
  activities: z.string().optional(),
});

type SSLGFormValues = z.infer<typeof sslgSchema>;

const officerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  committee: z.string().optional(),
  photoUrl: z.string().url('Must be valid URL').optional().or(z.literal('')),
  schoolYear: z.string().min(1, 'School year is required'),
});

type OfficerFormValues = z.infer<typeof officerSchema>;

export default function AdminSSLG() {
  const [isOfficerFormOpen, setIsOfficerFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState<SSLGOfficer | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sslgData, isLoading: sslgLoading } = useGetSSLG();
  const { data: officersData, isLoading: officersLoading } = useListSSLGOfficers();

  const updateSSLGMutation = useUpdateSSLG();
  const createOfficerMutation = useCreateSSLGOfficer();
  const deleteOfficerMutation = useDeleteSSLGOfficer();

  const sslgForm = useForm<SSLGFormValues>({
    resolver: zodResolver(sslgSchema),
    defaultValues: { adviserName: '', schoolYear: '', description: '', projects: '', activities: '' }
  });

  const officerForm = useForm<OfficerFormValues>({
    resolver: zodResolver(officerSchema),
    defaultValues: { name: '', position: '', committee: '', photoUrl: '', schoolYear: '' }
  });

  useEffect(() => {
    if (sslgData) {
      sslgForm.reset({
        adviserName: sslgData.adviserName,
        schoolYear: sslgData.schoolYear,
        description: sslgData.description || '',
        projects: sslgData.projects || '',
        activities: sslgData.activities || ''
      });
      officerForm.setValue('schoolYear', sslgData.schoolYear);
    }
  }, [sslgData, sslgForm, officerForm]);

  const onSSLGSubmit = async (data: SSLGFormValues) => {
    try {
      await updateSSLGMutation.mutateAsync({ data });
      toast({ title: 'SSLG Details updated' });
      queryClient.invalidateQueries({ queryKey: getGetSSLGQueryKey() });
      officerForm.setValue('schoolYear', data.schoolYear);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error updating SSLG details' });
    }
  };

  const onOfficerSubmit = async (data: OfficerFormValues) => {
    try {
      await createOfficerMutation.mutateAsync({ data });
      toast({ title: 'Officer added' });
      setIsOfficerFormOpen(false);
      queryClient.invalidateQueries({ queryKey: getListSSLGOfficersQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error adding officer' });
    }
  };

  const confirmDeleteOfficer = async () => {
    if (!officerToDelete) return;
    try {
      await deleteOfficerMutation.mutateAsync({ id: officerToDelete.id });
      toast({ title: 'Officer deleted' });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: getListSSLGOfficersQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error deleting officer' });
    }
  };

  if (sslgLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold">Supreme Secondary Learner Government</h1>
        <p className="text-muted-foreground">Manage SSLG details and officers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SSLG General Information</CardTitle>
          <CardDescription>Update the current school year details and programs</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...sslgForm}>
            <form onSubmit={sslgForm.handleSubmit(onSSLGSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={sslgForm.control} name="adviserName" render={({ field }) => (
                  <FormItem><FormLabel>Adviser Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={sslgForm.control} name="schoolYear" render={({ field }) => (
                  <FormItem><FormLabel>School Year</FormLabel><FormControl><Input {...field} placeholder="e.g. 2024-2025" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={sslgForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>About SSLG / Mandate</FormLabel><FormControl><Textarea {...field} className="h-20" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={sslgForm.control} name="projects" render={({ field }) => (
                  <FormItem><FormLabel>Key Projects (Markdown supported)</FormLabel><FormControl><Textarea {...field} className="h-32" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={sslgForm.control} name="activities" render={({ field }) => (
                  <FormItem><FormLabel>Activities (Markdown supported)</FormLabel><FormControl><Textarea {...field} className="h-32" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={updateSSLGMutation.isPending}>
                  {updateSSLGMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>SSLG Officers</CardTitle>
            <CardDescription>Current officers for SY {sslgData?.schoolYear}</CardDescription>
          </div>
          <Button onClick={() => { officerForm.reset({ name: '', position: '', committee: '', photoUrl: '', schoolYear: sslgData?.schoolYear || '' }); setIsOfficerFormOpen(true); }} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Officer
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Officer</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Committee</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {officersLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
              ) : officersData && officersData.length > 0 ? (
                officersData.map((officer) => (
                  <TableRow key={officer.id}>
                    <TableCell className="font-medium">{officer.name}</TableCell>
                    <TableCell>{officer.position}</TableCell>
                    <TableCell>{officer.committee || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { setOfficerToDelete(officer); setIsDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No officers found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOfficerFormOpen} onOpenChange={setIsOfficerFormOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Add SSLG Officer</DialogTitle></DialogHeader>
          <Form {...officerForm}>
            <form onSubmit={officerForm.handleSubmit(onOfficerSubmit)} className="space-y-4 pt-4">
              <FormField control={officerForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={officerForm.control} name="position" render={({ field }) => (
                <FormItem><FormLabel>Position</FormLabel><FormControl><Input {...field} placeholder="e.g. President" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={officerForm.control} name="committee" render={({ field }) => (
                <FormItem><FormLabel>Committee (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={officerForm.control} name="photoUrl" render={({ field }) => (
                <FormItem><FormLabel>Photo URL (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOfficerFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createOfficerMutation.isPending}>
                  {createOfficerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Add Officer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <div className="py-4"><p>Are you sure you want to delete officer <strong>{officerToDelete?.name}</strong>?</p></div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteOfficer} disabled={deleteOfficerMutation.isPending}>
              {deleteOfficerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}