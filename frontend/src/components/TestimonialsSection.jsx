export default function TestimonialsSection() {
  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">Témoignages de nos clients</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">A</div>
            <p className="text-gray-700 italic mb-2">"Un travail exceptionnel, très professionnel et créatif. Je recommande vivement Nasri Déco !"</p>
            <div className="text-primary font-semibold">STE PRO IMMOBILIERE         LA CIBLE</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">S</div>
            <p className="text-gray-700 italic mb-2">"Le staff de mon salon est magnifique, merci pour votre sérieux et votre écoute."</p>
            <div className="text-primary font-semibold"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mb-4">M</div>
            <p className="text-gray-700 italic mb-2">"Résultat au-delà de mes attentes, équipe très sympathique et talentueuse."</p>
            <div className="text-primary font-semibold">Mehdi K.</div>
          </div>
        </div>
      </div>
    </section>
  );
} 