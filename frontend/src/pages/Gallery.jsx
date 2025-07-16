export default function Gallery() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-4">Galerie Avant / Après</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TODO: Fetch and display before/after images from API */}
        <div className="bg-gray-100 rounded shadow p-4 flex flex-col items-center justify-center h-64">Aucune image pour le moment.</div>
      </div>
    </div>
  );
} 