const { getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../models/galleryModel');

// Get all gallery items
async function getGalleryController(req, res) {
  try {
    const galleryItems = await getGallery();
    res.status(200).json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la galerie' });
  }
}

// Add new gallery item
async function uploadGalleryController(req, res) {
  try {
    const { title, category, description } = req.body;
    const beforeFile = req.files?.before?.[0];
    const afterFile = req.files?.after?.[0];
    const before_img = beforeFile?.filename;
    const after_img = afterFile?.filename;

    if (!title || !category || !before_img || !after_img) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis: title, category, before_img, after_img' 
      });
    }

    // Derive types and URLs
    const getTypeFromMime = (m) => m && m.startsWith('video/') ? 'video' : 'image';
    const before_type = getTypeFromMime(beforeFile?.mimetype);
    const after_type = getTypeFromMime(afterFile?.mimetype);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const before_url = `${baseUrl}/uploads/${before_img}`;
    const after_url = `${baseUrl}/uploads/${after_img}`;

    const galleryId = await addGalleryItem({
      title,
      category,
      description: description || '',
      before_img,
      after_img,
      before_type,
      after_type,
      before_url,
      after_url
    });

    res.status(201).json({ 
      message: 'Élément de galerie ajouté avec succès',
      id: galleryId 
    });
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'élément de galerie' });
  }
}

// Update gallery item
async function updateGalleryItemController(req, res) {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;
    const beforeFile = req.files?.before?.[0];
    const afterFile = req.files?.after?.[0];
    const before_img = beforeFile?.filename;
    const after_img = afterFile?.filename;

    const updateData = { title, category, description };
    if (before_img) updateData.before_img = before_img;
    if (after_img) updateData.after_img = after_img;

    if (beforeFile) {
      updateData.before_type = beforeFile.mimetype.startsWith('video/') ? 'video' : 'image';
      updateData.before_url = `${req.protocol}://${req.get('host')}/uploads/${before_img}`;
    }
    if (afterFile) {
      updateData.after_type = afterFile.mimetype.startsWith('video/') ? 'video' : 'image';
      updateData.after_url = `${req.protocol}://${req.get('host')}/uploads/${after_img}`;
    }

    await updateGalleryItem(id, updateData);

    res.status(200).json({ 
      message: 'Élément de galerie mis à jour avec succès' 
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élément de galerie' });
  }
}

// Delete gallery item
async function deleteGalleryItemController(req, res) {
  try {
    const { id } = req.params;
    await deleteGalleryItem(id);

    res.status(200).json({ 
      message: 'Élément de galerie supprimé avec succès' 
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'élément de galerie' });
  }
}

module.exports = { 
  getGallery: getGalleryController, 
  uploadGallery: uploadGalleryController, 
  updateGalleryItem: updateGalleryItemController, 
  deleteGalleryItem: deleteGalleryItemController 
}; 