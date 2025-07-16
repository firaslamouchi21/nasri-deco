import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-r from-primary to-blue-400 text-white py-16 shadow-lg">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Bienvenue chez Nasri Déco
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Spécialistes du staff artistique et de la décoration en plâtre (gypsum). Sublimez vos espaces avec notre savoir-faire artisanal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link to="/order" className="px-8 py-4 text-lg bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-gray-100 transition border-2 border-primary">
            Demander un devis
          </Link>
          <Link to="/contact" className="px-8 py-4 text-lg bg-primary border-2 border-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
} 