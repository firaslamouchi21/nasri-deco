export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-6 text-primary">Contact</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Téléphone: </span>
            <a href="tel:27211847" className="text-primary font-bold hover:underline">27211847</a>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email: </span>
            <a href="mailto:firas.lamou@gmail.com" className="text-primary font-bold hover:underline">firas.lamou@gmail.com</a>
          </div>
        </div>
        <div className="flex-1 w-full aspect-video">
          <iframe
            title="Google Maps - Lafayette Tunis"
            className="w-full h-64 md:h-full rounded-xl border"
            src="https://www.google.com/maps?q=36.8635,10.1881&z=15&output=embed"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary">Envoyez-nous un message</h3>
        <form className="space-y-4">
          <input className="w-full border rounded px-3 py-2" placeholder="Nom" />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" />
          <textarea className="w-full border rounded px-3 py-2" placeholder="Message" />
          <button className="px-6 py-2 bg-primary text-white rounded">Envoyer</button>
        </form>
      </div>
    </div>
  );
} 