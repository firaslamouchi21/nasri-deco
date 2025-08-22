// src/components/Gallery.jsx
import { useState, useEffect, useRef } from 'react';
import { Image, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { fetchGallery } from '../services/api';

const API_URL = 'http://192.168.1.50:5000'; // your server IP

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchGallery();
        setGalleryItems(data.length ? data : []);
      } catch (error) {
        console.error('Error loading gallery:', error);
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  const categories = [
    { id: 'all', name: 'Tous les projets', count: galleryItems.length },
    { id: 'plafonds', name: 'Plafonds', count: galleryItems.filter(i => i.category === 'plafonds').length },
    { id: 'corniches', name: 'Corniches', count: galleryItems.filter(i => i.category === 'corniches').length },
    { id: 'colonnes', name: 'Colonnes', count: galleryItems.filter(i => i.category === 'colonnes').length },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const renderMedia = (url, type, alt) => {
    const fullUrl = url.startsWith('http') ? url : `${API_URL}/uploads/${url}`;
    if (type === 'video') {
      return (
        <video
          src={fullUrl}
          controls
          className="w-full max-h-[500px] object-contain rounded-lg shadow"
        />
      );
    }
    return (
      <img
        src={fullUrl}
        alt={alt}
        className="w-full rounded-lg shadow"
        style={{ maxHeight: '500px', objectFit: 'contain' }}
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop';
          e.target.alt = 'Media non disponible';
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <h2 className="text-2xl font-bold mb-6">Filtrer par catégorie</h2>
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name} ({cat.count})
            </Button>
          ))}
        </div>

        {/* Gallery Cards */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-500">
              {galleryItems.length === 0
                ? "Aucun projet n'a été ajouté."
                : "Aucun projet ne correspond à cette catégorie."}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className="mb-12 shadow-lg border-0 cursor-pointer" onClick={() => setCurrentItem(item)}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                <div className="flex items-center gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(item.uploaded_at).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Non catégorisé'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {item.description && <p className="text-gray-600">{item.description}</p>}

                {/* Side-by-side Before/After */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-red-600">Avant</h4>
                    {renderMedia(item.before_url || item.before_img, item.before_type || 'image', `${item.title} Avant`)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-green-600">Après</h4>
                    {renderMedia(item.after_url || item.after_img, item.after_type || 'image', `${item.title} Après`)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Modal */}
        {currentItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
              <button className="absolute top-4 right-4 text-gray-700 text-2xl" onClick={() => setCurrentItem(null)}>×</button>
              <h3 className="text-2xl font-bold mb-4">{currentItem.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-red-600">Avant</h4>
                  {renderMedia(currentItem.before_url || currentItem.before_img, currentItem.before_type || 'image', 'Avant')}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-green-600">Après</h4>
                  {renderMedia(currentItem.after_url || currentItem.after_img, currentItem.after_type || 'image', 'Après')}
                </div>
              </div>
              {currentItem.description && <p className="text-gray-600">{currentItem.description}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
