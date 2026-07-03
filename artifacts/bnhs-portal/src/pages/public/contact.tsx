import { useGetAbout } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const { data: about, isLoading } = useGetAbout();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an API request
    // For now, just show success state
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">We'd love to hear from you. Reach out to us for any inquiries, concerns, or feedback.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our administration office is open during regular school days to assist students, parents, and visitors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-secondary hover-elevate transition-all">
                <CardContent className="p-6">
                  <MapPin className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Location</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {about?.address || "Burgos Street, Barangay Poblacion\nBurgos, Philippines"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary hover-elevate transition-all">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Office Hours</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {about?.officeHours || "Monday to Friday\n8:00 AM - 5:00 PM"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-3 hover-elevate transition-all">
                <CardContent className="p-6">
                  <Phone className="h-8 w-8 text-chart-3 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Phone</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {about?.phone || "(02) 8123-4567"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-4 hover-elevate transition-all">
                <CardContent className="p-6">
                  <Mail className="h-8 w-8 text-chart-4 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Email</h3>
                  <a href={`mailto:${about?.email || "info@burgosnhs.edu.ph"}`} className="text-primary hover:underline text-sm font-medium">
                    {about?.email || "info@burgosnhs.edu.ph"}
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Map Placeholder */}
            <div className="bg-card border rounded-2xl overflow-hidden shadow-sm h-64 mt-8 relative">
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="h-10 w-10 mb-2 opacity-30" />
                <span className="font-medium">Interactive Map Embed Placeholder</span>
                <span className="text-xs mt-1">Google Maps iframe goes here</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border shadow-lg rounded-2xl overflow-hidden h-full">
              <div className="bg-primary p-8 text-primary-foreground">
                <h3 className="text-2xl font-serif font-bold mb-2">Send us a message</h3>
                <p className="opacity-90">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 h-full animate-in zoom-in duration-300">
                    <div className="h-20 w-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Thank you for reaching out. We have received your message and will respond to the email address provided.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={() => setIsSubmitted(false)}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">First Name</label>
                        <Input required placeholder="Juan" className="bg-muted/50 focus-visible:bg-background" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Last Name</label>
                        <Input required placeholder="Dela Cruz" className="bg-muted/50 focus-visible:bg-background" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Email Address</label>
                      <Input required type="email" placeholder="juan@example.com" className="bg-muted/50 focus-visible:bg-background" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Subject</label>
                      <Input required placeholder="Inquiry about enrollment" className="bg-muted/50 focus-visible:bg-background" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Message</label>
                      <Textarea required placeholder="How can we help you?" className="min-h-[150px] bg-muted/50 focus-visible:bg-background resize-none" />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-base font-bold shadow-md hover:shadow-lg transition-all group">
                      <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}