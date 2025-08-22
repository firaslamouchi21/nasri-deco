import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Devis', path: '/order' },
    { name: 'Admin', path: '/admin/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm shadow-soft sticky top-0 z-50 border-b border-border">
      {/* Top contact bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <a href="tel:27211847" className="hover:text-accent transition-colors">
                27 211 847
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:firas.lamou@gmail.com" className="hover:text-accent transition-colors">
                firas.lamou@gmail.com
              </a>
            </div>
          </div>
          <div className="text-sm">
            Spécialistes du staff artistique et de la décoration en plâtre
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center overflow-hidden">
  <img 
    src="/WhatsApp Image 2025-08-22 at 12.25.14.jpeg" 
    alt="Logo" 
    className="w-full h-full object-contain"
  />
</div>


            <div>
              <h1 className="text-xl font-bold text-primary">Nasri Déco plus</h1>
              <p className="text-xs text-muted-foreground">Staff & Décoration</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/order"
              className="btn-primary"
            >
              Demander un Devis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10 rounded-lg'
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile contact info */}
              <div className="px-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a href="tel:27211847" className="hover:text-primary transition-colors">
                    27 211 847
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:firas.lamou@gmail.com" className="hover:text-primary transition-colors">
                   nasri.decoplus@gmail.com
                  </a>
                </div>
              </div>
              
              {/* Mobile CTA */}
              <div className="px-4 pt-2">
                <Link
                  to="/order"
                  className="block w-full text-center btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Demander un Devis
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 