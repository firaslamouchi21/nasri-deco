import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Clock, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const features = [
    { icon: Star, text: "Qualité Premium" },
    { icon: Users, text: "Équipe Experte" },
    { icon: Clock, text: "Délais Respectés" },
    { icon: CheckCircle, text: "Garantie Qualité" }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 gradient-hero opacity-95"></div>
      <div className="absolute inset-0 bg-pattern opacity-30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                ✨ Experts en Staff Artistique & Décoration
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Bienvenue chez{' '}
                <span className="text-accent">Nasri Déco</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-2xl">
                Spécialistes du staff artistique et de la décoration en plâtre (gypsum).
                <br />
                <span className="text-accent font-semibold">Sublimez vos espaces</span> avec notre savoir-faire artisanal.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/order"
                className="group bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-strong hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Demander un Devis Gratuit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/30 hover:border-white/50"
              >
                Voir Nos Réalisations
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center space-y-2 hover:bg-white/20 transition-all duration-300"
                >
                  <feature.icon className="w-6 h-6 text-accent mx-auto" />
                  <p className="text-white text-sm font-medium">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Stats */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-professional bg-white/95 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Projets Réalisés</div>
              </div>
              <div className="card-professional bg-white/95 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Années d&apos;Expérience</div>
              </div>
              <div className="card-professional bg-white/95 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Clients Satisfaits</div>
              </div>
              <div className="card-professional bg-white/95 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <div className="text-sm text-muted-foreground">Temps de Réponse</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="card-professional bg-white/95 backdrop-blur-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="font-semibold text-foreground">Ahmed Ben Ali</div>
                  <div className="text-sm text-muted-foreground">Client satisfait</div>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic">
                &quot;Travail exceptionnel ! L&apos;équipe de Nasri Déco a transformé notre salon avec un plafond en staff magnifique. Professionnalisme et qualité au rendez-vous.&quot;
              </blockquote>
              <div className="flex text-accent mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg className="w-full h-16 lg:h-24 text-background" viewBox="0 0 1440 120" fill="currentColor">
          <path d="M0,120 C240,0 720,120 1440,0 L1440,120 Z"></path>
        </svg>
      </div>
    </section>
  );
} 