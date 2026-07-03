import { Link } from 'wouter';
import bnhsLogo from '../assets/bnhs-logo.png';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-primary text-primary-foreground border-t-4 border-secondary">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-1 h-12 w-12 flex items-center justify-center shrink-0">
                <img src={bnhsLogo} alt="BNHS Logo" className="h-10 w-10 object-contain" />
              </div>
              <span className="font-serif font-bold text-lg leading-tight">
                Burgos National<br />High School
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm mt-4 leading-relaxed">
              Committed to providing quality education and fostering holistic development for every learner in our community.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/about" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
              <li><Link href="/news" className="hover:text-white hover:underline transition-colors">News & Announcements</Link></li>
              <li><Link href="/personnel" className="hover:text-white hover:underline transition-colors">Personnel Directory</Link></li>
              <li><Link href="/downloads" className="hover:text-white hover:underline transition-colors">Downloadable Forms</Link></li>
              <li><Link href="/admin/login" className="hover:text-white hover:underline transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-secondary">Organizations</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/sslg" className="hover:text-white hover:underline transition-colors">Supreme Secondary Learner Govt.</Link></li>
              <li><Link href="/pta" className="hover:text-white hover:underline transition-colors">Parents-Teachers Association</Link></li>
              <li><Link href="/gallery" className="hover:text-white hover:underline transition-colors">School Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-secondary">Contact Us</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-secondary" />
                <span>Burgos Street, Barangay Poblacion<br />Burgos, Province, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-secondary" />
                <span>(02) 8123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-secondary" />
                <span>info@burgosnhs.edu.ph</span>
              </li>
              <li className="flex items-center gap-3 mt-4">
                <a href="#" className="bg-primary-foreground/10 hover:bg-secondary hover:text-primary transition-colors p-2 rounded-full">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-black/20 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Burgos National High School. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for educational excellence.</p>
        </div>
      </div>
    </footer>
  );
}