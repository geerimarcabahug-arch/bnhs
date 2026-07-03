import { useGetPTA, useListPTAOfficers } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, Calendar, Clock, HandshakeIcon, Target } from 'lucide-react';

export default function PTA() {
  const { data: pta, isLoading: ptaLoading } = useGetPTA();
  const { data: officers, isLoading: officersLoading } = useListPTAOfficers();

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 translate-y-1/4 -translate-x-1/4 opacity-10">
          <HandshakeIcon className="w-96 h-96" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex bg-secondary/90 text-secondary-foreground text-sm font-bold tracking-widest px-4 py-1.5 rounded-full mb-6 uppercase shadow-sm">
            Community Partner
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-4xl mx-auto leading-tight">
            Parents-Teachers Association
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-medium">
            Working together for the welfare and development of our learners.
          </p>
          {pta?.schoolYear && (
            <div className="mt-8 text-primary-foreground/80 font-semibold tracking-wide border-t border-primary-foreground/20 pt-6 max-w-md mx-auto">
              School Year {pta.schoolYear}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <Card className="h-full border shadow-sm">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-serif font-bold">PTA Mandate</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
                  {pta?.constitution ? (
                    <div dangerouslySetInnerHTML={{ __html: pta.constitution.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p>The Parents-Teachers Association serves as a forum for the discussion of issues and their solutions related to the total school program and to ensure the full cooperation of parents in the efficient implementation of such programs. It is an indispensable partner of the school in its goal to provide quality education.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1 space-y-8">
            <Card className="border-t-4 border-t-secondary shadow-md bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Clock className="h-6 w-6" />
                  <h3 className="font-bold text-lg">Meeting Schedule</h3>
                </div>
                <p className="text-muted-foreground font-medium bg-muted/50 p-4 rounded-lg border">
                  {pta?.meetingSchedule || "Every last Friday of the month, 3:00 PM at the School Gymnasium"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Get Involved</h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Active parent participation makes a huge difference in student success. Join our upcoming assemblies.
                </p>
                <div className="bg-white/10 rounded-md p-3 text-center border border-white/20">
                  <span className="font-bold text-secondary">Membership is open to all parents/guardians</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Officers Directory */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">PTA Board of Directors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The elected officials serving the PTA for SY {pta?.schoolYear}.</p>
          </div>

          {officersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-muted w-3/4 mx-auto rounded mb-2"></div>
                    <div className="h-3 bg-muted w-1/2 mx-auto rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : officers && officers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {officers.map(officer => (
                <Card key={officer.id} className="text-center hover-elevate transition-all border-b border-b-transparent hover:border-b-secondary">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="h-8 w-8" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{officer.name}</h3>
                    <p className="text-secondary-foreground bg-secondary/20 font-bold text-xs uppercase tracking-wider py-1 px-3 rounded-full inline-block mt-1">{officer.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border rounded-2xl">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium text-lg">No PTA officers have been listed yet.</p>
            </div>
          )}
        </section>

        {/* Projects & Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border shadow-sm bg-card overflow-hidden">
            <div className="h-2 bg-chart-3 w-full"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Target className="h-6 w-6 text-chart-3" />
                <h3 className="text-2xl font-serif font-bold">PTA Projects</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                {pta?.projects ? (
                  <div dangerouslySetInnerHTML={{ __html: pta.projects.replace(/\n/g, '<br/>') }} />
                ) : (
                  <ul className="space-y-2">
                    <li>School Infrastructure Improvements</li>
                    <li>Security and Safety Enhancements</li>
                    <li>Supplemental Learning Materials</li>
                    <li>Brigada Eskwela Support</li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-card overflow-hidden">
            <div className="h-2 bg-chart-4 w-full"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Calendar className="h-6 w-6 text-chart-4" />
                <h3 className="text-2xl font-serif font-bold">Activities</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                {pta?.activities ? (
                  <div dangerouslySetInnerHTML={{ __html: pta.activities.replace(/\n/g, '<br/>') }} />
                ) : (
                  <ul className="space-y-2">
                    <li>General Parents Assembly</li>
                    <li>Card Day Conduits</li>
                    <li>Fundraising Events</li>
                    <li>Parenting Seminars</li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}