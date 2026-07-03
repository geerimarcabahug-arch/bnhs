import { useGetSSLG, useListSSLGOfficers } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Flag, Target, Users, Calendar, Award, BookOpen } from 'lucide-react';

export default function SSLG() {
  const { data: sslg, isLoading: sslgLoading } = useGetSSLG();
  const { data: officers, isLoading: officersLoading } = useListSSLGOfficers();

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
          <Flag className="w-96 h-96" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex bg-secondary/90 text-secondary-foreground text-sm font-bold tracking-widest px-4 py-1.5 rounded-full mb-6 uppercase shadow-sm">
            Student Government
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-4xl mx-auto leading-tight">
            Supreme Secondary Learner Government
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 font-medium">
            The highest student governing body of Burgos National High School.
          </p>
          {sslg?.schoolYear && (
            <div className="mt-8 text-primary-foreground/80 font-semibold tracking-wide border-t border-primary-foreground/20 pt-6 max-w-md mx-auto">
              School Year {sslg.schoolYear}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Mandate & Adviser */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Card className="h-full border shadow-sm">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-serif font-bold">About SSLG</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
                  {sslg?.description ? (
                    <div dangerouslySetInnerHTML={{ __html: sslg.description.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p>The Supreme Secondary Learner Government (SSLG) is the foremost co-curricular student organization authorized to operate and implement pertinent programs, projects, and activities in schools nationwide. It lays the groundwork for unity and cooperation among the students.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="h-full border-t-4 border-t-secondary bg-primary text-primary-foreground shadow-lg">
              <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <Award className="h-12 w-12 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">SSLG Adviser</h3>
                {sslgLoading ? (
                  <div className="h-6 w-32 bg-primary-foreground/20 rounded animate-pulse mt-2"></div>
                ) : (
                  <>
                    <p className="text-2xl font-serif font-bold text-white mb-2">{sslg?.adviserName || "Not assigned"}</p>
                    <p className="text-primary-foreground/80 text-sm">Guiding the student leaders towards effective governance.</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Officers Directory */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">SSLG Officers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The dedicated student leaders serving the student body for SY {sslg?.schoolYear}.</p>
          </div>

          {officersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-muted w-3/4 mx-auto rounded mb-2"></div>
                    <div className="h-3 bg-muted w-1/2 mx-auto rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : officers && officers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {officers.map(officer => (
                <Card key={officer.id} className="text-center hover-elevate transition-all border-b-4 border-b-transparent hover:border-b-primary">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-5 rounded-full overflow-hidden border-4 border-muted bg-muted flex items-center justify-center">
                      {officer.photoUrl ? (
                        <img src={officer.photoUrl} alt={officer.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="h-10 w-10 text-muted-foreground/40" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{officer.name}</h3>
                    <p className="text-primary font-bold text-sm uppercase tracking-wide mb-3">{officer.position}</p>
                    {officer.committee && (
                      <span className="inline-block bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                        {officer.committee}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border rounded-2xl">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground font-medium text-lg">No officers have been listed yet.</p>
            </div>
          )}
        </section>

        {/* Projects & Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <BookOpen className="h-6 w-6 text-chart-3" />
                <h3 className="text-2xl font-serif font-bold">Key Projects</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                {sslg?.projects ? (
                  <div dangerouslySetInnerHTML={{ __html: sslg.projects.replace(/\n/g, '<br/>') }} />
                ) : (
                  <ul className="space-y-2">
                    <li>Student Welfare Desk</li>
                    <li>Campus Cleanliness Drive</li>
                    <li>Peer Tutoring Program</li>
                    <li>Leadership Training Seminars</li>
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Calendar className="h-6 w-6 text-chart-4" />
                <h3 className="text-2xl font-serif font-bold">Activities</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                {sslg?.activities ? (
                  <div dangerouslySetInnerHTML={{ __html: sslg.activities.replace(/\n/g, '<br/>') }} />
                ) : (
                  <ul className="space-y-2">
                    <li>Teachers' Day Celebration</li>
                    <li>Intramurals Coordination</li>
                    <li>Student Assemblies</li>
                    <li>Culminating Events</li>
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