import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="space-y-8">
          {/* 404 Icon */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">404</span>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-accent-foreground">!</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Page non trouvée
            </h1>
            <p className="text-muted-foreground text-lg">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour en arrière
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à{' '}
              <Link to="/contact" className="text-primary hover:underline">
                nous contacter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 