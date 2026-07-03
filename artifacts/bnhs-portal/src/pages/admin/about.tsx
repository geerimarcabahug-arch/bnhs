import { useGetAbout, useUpdateAbout, getGetAboutQueryKey } from '@workspace/api-client-react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const aboutSchema = z.object({
  history: z.string().optional(),
  vision: z.string().optional(),
  mission: z.string().optional(),
  coreValues: z.string().optional(),
  hymn: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  officeHours: z.string().optional(),
  facebookUrl: z.string().optional(),
  principalName: z.string().optional(),
  principalMessage: z.string().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AdminAbout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: aboutData, isLoading } = useGetAbout();
  const updateMutation = useUpdateAbout();

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      history: '', vision: '', mission: '', coreValues: '', hymn: '', 
      address: '', phone: '', email: '', officeHours: '', facebookUrl: '', 
      principalName: '', principalMessage: ''
    }
  });

  useEffect(() => {
    if (aboutData) {
      form.reset({
        history: aboutData.history || '',
        vision: aboutData.vision || '',
        mission: aboutData.mission || '',
        coreValues: aboutData.coreValues || '',
        hymn: aboutData.hymn || '',
        address: aboutData.address || '',
        phone: aboutData.phone || '',
        email: aboutData.email || '',
        officeHours: aboutData.officeHours || '',
        facebookUrl: aboutData.facebookUrl || '',
        principalName: aboutData.principalName || '',
        principalMessage: aboutData.principalMessage || ''
      });
    }
  }, [aboutData, form]);

  const onSubmit = async (data: AboutFormValues) => {
    try {
      await updateMutation.mutateAsync({ data });
      toast({ title: 'About page content updated' });
      queryClient.invalidateQueries({ queryKey: getGetAboutQueryKey() });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error updating content' });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold">About Page Content</h1>
        <p className="text-muted-foreground">Manage the public-facing school information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <div className="bg-card p-2 rounded-lg border shadow-sm mb-4 inline-block w-full sm:w-auto">
              <TabsList className="w-full justify-start overflow-x-auto h-auto p-0 bg-transparent border-0">
                <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">General Info & Contact</TabsTrigger>
                <TabsTrigger value="identity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Vision & Mission</TabsTrigger>
                <TabsTrigger value="principal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Principal's Corner</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">History & Hymn</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>This appears in the footer and contact page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Physical Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="officeHours" render={({ field }) => (
                      <FormItem><FormLabel>Office Hours</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                      <FormItem><FormLabel>Facebook Page URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="identity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>School Identity</CardTitle>
                  <CardDescription>Vision, Mission, and Core Values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="vision" render={({ field }) => (
                    <FormItem><FormLabel>Vision</FormLabel><FormControl><Textarea {...field} className="h-24" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="mission" render={({ field }) => (
                    <FormItem><FormLabel>Mission</FormLabel><FormControl><Textarea {...field} className="h-24" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="coreValues" render={({ field }) => (
                    <FormItem><FormLabel>Core Values</FormLabel><FormControl><Textarea {...field} className="h-24" placeholder="Maka-Diyos, Maka-tao..." /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="principal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Principal's Corner</CardTitle>
                  <CardDescription>Message from the school principal for the homepage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="principalName" render={({ field }) => (
                    <FormItem><FormLabel>Principal's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="principalMessage" render={({ field }) => (
                    <FormItem><FormLabel>Principal's Message</FormLabel><FormControl><Textarea {...field} className="h-48" /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>History & Hymn</CardTitle>
                  <CardDescription>School's legacy and official song</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="history" render={({ field }) => (
                    <FormItem><FormLabel>School History</FormLabel><FormControl><Textarea {...field} className="h-48" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="hymn" render={({ field }) => (
                    <FormItem><FormLabel>School Hymn Lyrics</FormLabel><FormControl><Textarea {...field} className="h-48 font-serif" /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end sticky bottom-6 z-10 bg-background/80 backdrop-blur py-4 border-t px-4 -mx-4 rounded-b-xl">
            <Button type="submit" size="lg" disabled={updateMutation.isPending} className="shadow-lg">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
              Save All Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}