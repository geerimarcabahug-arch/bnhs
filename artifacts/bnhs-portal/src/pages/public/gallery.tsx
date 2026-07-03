import { useListGallery } from '@workspace/api-client-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Image as ImageIcon, Video, PlayCircle, X, Maximize2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const { data: galleryData, isLoading } = useListGallery(
    activeCategory !== 'all' ? { category: activeCategory } : {}
  );

  const categories = ['Activities', 'Recognition', 'Sports', 'Graduation', 'Brigada Eskwela', 'Facilities', 'Events'];

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-muted/10">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">School Gallery</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">Capturing the vibrant moments, achievements, and spirit of Burgos National High School.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Category Filters */}
        <div className="flex flex-col items-center mb-10">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full flex justify-center">
            <div className="overflow-x-auto pb-2 w-full max-w-full flex justify-center">
              <TabsList className="inline-flex h-auto p-1 bg-card border shadow-sm">
                <TabsTrigger value="all" className="px-4 py-2">All Media</TabsTrigger>
                {categories.map(c => (
                  <TabsTrigger key={c} value={c} className="px-4 py-2">{c}</TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : galleryData && galleryData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryData.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-square bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border"
                onClick={() => setSelectedMedia(item)}
              >
                {item.mediaType === 'video' ? (
                  <>
                    <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <PlayCircle className="h-14 w-14 text-white/90 drop-shadow-md group-hover:scale-110 transition-transform" />
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                
                {/* Overlay Details */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <span className="bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded mb-2 inline-block shadow-sm">
                    {item.category}
                  </span>
                  <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1">{item.title}</h3>
                </div>
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-1.5 rounded-md backdrop-blur-sm">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">No media found</h3>
            <p className="text-muted-foreground">No photos or videos are available in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-[90vw] md:max-w-5xl p-0 overflow-hidden bg-black border-border/50 text-white">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          {selectedMedia && (
            <div className="flex flex-col">
              <div className="relative w-full h-[60vh] md:h-[75vh] bg-black flex items-center justify-center">
                {selectedMedia.mediaType === 'video' ? (
                  // Simple iframe for videos (assuming YouTube or similar supported format)
                  // In a real app, you'd need more robust video handling
                  selectedMedia.url.includes('youtube') || selectedMedia.url.includes('youtu.be') ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${selectedMedia.url.split(/v=|youtu\.be\//)[1]?.split('&')[0]}?autoplay=1`}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-full object-contain"></video>
                  )
                ) : (
                  <img src={selectedMedia.url} alt={selectedMedia.title} className="max-w-full max-h-full object-contain" />
                )}
              </div>
              
              <div className="p-4 md:p-6 bg-zinc-950 border-t border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary/20 text-primary-foreground border border-primary/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                    {selectedMedia.category}
                  </span>
                  <span className="text-zinc-400 text-xs flex items-center gap-1">
                    {selectedMedia.mediaType === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {selectedMedia.mediaType === 'photo' ? 'Photo' : 'Video'}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-2">{selectedMedia.title}</h2>
                {selectedMedia.description && (
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{selectedMedia.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}