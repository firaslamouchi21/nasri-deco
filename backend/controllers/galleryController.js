
async function getGallery(req, res) {
  res.status(200).json({ message: "Gallery items (placeholder)" });
}


async function uploadGallery(req, res) {
  res.status(200).json({ message: "Gallery image uploaded (placeholder)" });
}

module.exports = { getGallery, uploadGallery }; 