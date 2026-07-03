import { useGetAbout } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Compass, Star, History, Music, MapPin, Phone, Mail, Clock } from 'lucide-react';
import heroImg from '../../assets/hero-school.png';

export default function About() {
  const { data: about, isLoading } = useGetAbout();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About BNHS</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">Discover our history, our mission, and the values that drive our institution forward.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        
        {/* Vision, Mission, Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-t-4 border-t-primary text-center hover-elevate transition-all">
            <CardContent className="pt-8 pb-8 px-6">
              <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-primary">
                <Compass className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground italic leading-relaxed">
                {about?.vision || "We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation."}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-secondary text-center hover-elevate transition-all">
            <CardContent className="pt-8 pb-8 px-6">
              <div className="mx-auto bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-secondary-foreground">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground italic leading-relaxed">
                {about?.mission || "To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where students learn in a child-friendly, gender-sensitive, safe, and motivating environment."}
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-chart-3 text-center hover-elevate transition-all">
            <CardContent className="pt-8 pb-8 px-6">
              <div className="mx-auto bg-chart-3/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-chart-3">
                <Star className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4">Core Values</h2>
              <ul className="text-muted-foreground font-medium text-lg space-y-2">
                {about?.coreValues ? (
                  about.coreValues.split(',').map((value, i) => (
                    <li key={i}>{value.trim()}</li>
                  ))
                ) : (
                  <>
                    <li>Maka-Diyos</li>
                    <li>Maka-tao</li>
                    <li>Makakalikasan</li>
                    <li>Makabansa</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            {/* History */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-serif font-bold">School History</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                {about?.history ? (
                  <div dangerouslySetInnerHTML={{ __html: about.history.replace(/\n/g, '<br/>') }} />
                ) : (
                  <>
                    <p>Burgos National High School was established to provide accessible and quality secondary education to the youth of Burgos and its neighboring communities.</p>
                    <p>From its humble beginnings with a few classrooms and a handful of dedicated teachers, BNHS has grown into a premier educational institution known for academic excellence and vibrant student life.</p>
                  </>
                )}
              </div>
            </section>

            {/* Hymn */}
            <section className="bg-muted/50 rounded-2xl p-8 md:p-10 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Music className="h-8 w-8 text-secondary" />
                <h2 className="text-3xl font-serif font-bold">BNHS Hymn</h2>
              </div>
              <div className="font-serif text-lg text-center mx-auto max-w-xl italic leading-loose text-foreground/80">
                {about?.hymn ? (
                  <div dangerouslySetInnerHTML={{ __html: about.hymn.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>
                    Hail to thee our Alma Mater dear<br/>
                    Burgos National High School, we revere<br/>
                    We sing to thee our song of praise and love<br/>
                    With loyal hearts guided from above.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Contact Info Sidebar */}
          <div>
            <div className="bg-primary text-primary-foreground rounded-xl p-8 sticky top-28 shadow-xl border-b-4 border-secondary">
              <h3 className="text-xl font-serif font-bold mb-6">Contact Information</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm opacity-80 mb-1">Address</h4>
                    <p className="leading-snug">{about?.address || "Burgos Street, Barangay Poblacion, Burgos, Philippines"}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm opacity-80 mb-1">Phone</h4>
                    <p>{about?.phone || "(02) 8123-4567"}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm opacity-80 mb-1">Email</h4>
                    <p>{about?.email || "info@burgosnhs.edu.ph"}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm opacity-80 mb-1">Office Hours</h4>
                    <p>{about?.officeHours || "Monday to Friday\n8:00 AM - 5:00 PM"}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}