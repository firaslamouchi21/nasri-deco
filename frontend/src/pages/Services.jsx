import { 
  Paintbrush, 
  Hammer, 
  Ruler, 
  Palette, 
  Sparkles, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Services() {
  const services = [
    {
      icon: Paintbrush,
      title: "Plafonds et Corniches en Staff",
      description: "Création de plafonds artistiques et corniches décoratives en staff pour un intérieur élégant et sophistiqué.",
      features: [
        "Plafonds à caissons",
        "Corniches classiques et modernes",
        "Rosaces et motifs décoratifs",
        "Installation professionnelle"
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Hammer,
      title: "Décoration Murale et Faux Plafonds",
      description: "Transformation de vos murs et plafonds avec des techniques de décoration innovantes et durables.",
      features: [
        "Faux plafonds acoustiques",
        "Murs en relief",
        "Panneaux décoratifs",
        "Finitions sur mesure"
      ],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Ruler,
      title: "Colonnes, Arcs et Éléments Artistiques",
      description: "Création d'éléments architecturaux uniques qui transforment votre espace en œuvre d'art.",
      features: [
        "Colonnes classiques et modernes",
        "Arcs et portiques",
        "Pilastres décoratifs",
        "Sculptures sur mesure"
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Palette,
      title: "Rénovation et Modernisation",
      description: "Rénovation complète de vos espaces avec des techniques modernes et des matériaux de qualité.",
      features: [
        "Rénovation complète",
        "Modernisation d'intérieurs",
        "Optimisation d'espace",
        "Conseils en décoration"
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Qualité Garantie",
      description: "Tous nos travaux bénéficient d'une garantie de 2 ans sur la main d'œuvre."
    },
    {
      icon: Clock,
      title: "Respect des Délais",
      description: "Nous nous engageons à respecter les délais convenus pour votre projet."
    },
    {
      icon: Star,
      title: "Expertise Reconnue",
      description: "Plus de 15 ans d'expérience dans la décoration intérieure et le staff artistique."
    },
    {
      icon: CheckCircle,
      title: "Service Personnalisé",
      description: "Chaque projet est unique et bénéficie d'un suivi personnalisé."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nos Services de Décoration
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Spécialistes en décoration intérieure et staff artistique (جبس), 
            nous transformons vos espaces en véritables œuvres d'art.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Demander un devis
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Voir nos réalisations
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Services Principaux
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre gamme complète de services de décoration intérieure 
              et de staff artistique pour tous types de projets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${service.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-8 h-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre expertise et notre engagement qualité font de nous 
              votre partenaire de confiance pour tous vos projets de décoration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre Processus de Travail
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un processus simple et efficace pour réaliser vos projets 
              de décoration dans les meilleures conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "Première rencontre pour comprendre vos besoins et votre vision."
              },
              {
                step: "02",
                title: "Devis & Planning",
                description: "Élaboration d'un devis détaillé et d'un planning de réalisation."
              },
              {
                step: "03",
                title: "Réalisation",
                description: "Exécution des travaux avec un suivi régulier de l'avancement."
              },
              {
                step: "04",
                title: "Livraison",
                description: "Réception des travaux et validation de la qualité finale."
              }
            ].map((process, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {process.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {process.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-primary/20 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Transformer Votre Espace ?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Contactez-nous dès aujourd'hui pour discuter de votre projet 
            et obtenir un devis personnalisé gratuit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Phone className="w-5 h-5 mr-2" />
              Appelez-nous
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Mail className="w-5 h-5 mr-2" />
              Envoyer un message
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 