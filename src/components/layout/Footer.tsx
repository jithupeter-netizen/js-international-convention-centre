"use client";


export default function Footer() {
  return (
    <footer className="bg-luxury-light text-luxury-dark pt-20 pb-10 border-t border-luxury-taupe relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <h3 className="text-2xl font-semibold mb-6 tracking-wide">
              <span className="text-luxury-gold">J’s</span> International Convention Centre
            </h3>
            <p className="text-luxury-mauve leading-relaxed mb-6 max-w-sm">
              Habitat of Excellence. Offering elegant event spaces for weddings, receptions, conferences, and social celebrations in Kollam.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/j.s_international_kollam" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-luxury-gold/5 border border-luxury-taupe flex items-center justify-center text-luxury-mauve hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=61588595926850&_rdr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-luxury-gold/5 border border-luxury-taupe flex items-center justify-center text-luxury-mauve hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>

              {/* Gmail / Email */}
              <a 
                href="mailto:js.international.kollam@gmail.com" 
                aria-label="Email"
                className="w-10 h-10 rounded-full bg-luxury-gold/5 border border-luxury-taupe flex items-center justify-center text-luxury-mauve hover:text-[#EA4335] hover:border-[#EA4335]/40 hover:bg-[#EA4335]/10 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-medium mb-6 text-luxury-dark">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-luxury-mauve hover:text-luxury-gold transition-colors">Home</a></li>
              <li><a href="/about" className="text-luxury-mauve hover:text-luxury-gold transition-colors">About</a></li>
              <li><a href="/spaces" className="text-luxury-mauve hover:text-luxury-gold transition-colors">Our Spaces</a></li>
              <li><a href="/tour" className="text-luxury-mauve hover:text-luxury-gold transition-colors">360 Tour</a></li>
              <li><a href="/gallery" className="text-luxury-mauve hover:text-luxury-gold transition-colors">Gallery</a></li>
              <li><a href="/contact" className="text-luxury-mauve hover:text-luxury-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-medium mb-6 text-luxury-dark">Contact Us</h4>
            <ul className="space-y-4 text-luxury-mauve">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-1 text-luxury-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>J’s International Convention Centre, Kalluvathukkal, Kollam.</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-luxury-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <a href="tel:9567765059" className="hover:text-luxury-gold transition-colors">+91 95677 65059</a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-luxury-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <a href="mailto:js.international.kollam@gmail.com" className="hover:text-luxury-gold transition-colors">js.international.kollam@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-luxury-taupe flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} J’s International Convention Centre. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/" className="hover:text-luxury-dark transition-colors">Privacy Policy</a>
            <a href="/" className="hover:text-luxury-dark transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
