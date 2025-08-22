
INSERT INTO messages (full_name, email, message) VALUES 
('Ahmed Ben Ali', 'ahmed@example.com', 'Bonjour, je souhaite un devis pour la décoration de mon salon.'),
('Fatima Mansouri', 'fatima@example.com', 'Pouvez-vous me donner des informations sur vos services de rénovation?'),
('Mohamed Karray', 'mohamed@example.com', 'Je voudrais prendre rendez-vous pour discuter d\'un projet.'),
('Sara Trabelsi', 'sara@example.com', 'Avez-vous des références pour des projets de décoration moderne?'),
('Youssef Hammami', 'youssef@example.com', 'Je recherche un devis pour la rénovation de ma cuisine.');

-- Add sample expenses
INSERT INTO expenses (description, amount, type) VALUES 
('Achat peinture blanche', 150.00, 'material'),
('Transport de matériaux', 75.50, 'service'),
('Outils de décoration', 45.25, 'misc'),
('Peinture spéciale', 200.00, 'material'),
('Services de nettoyage', 120.00, 'service');

-- Add sample revenues
INSERT INTO revenues (description, amount) VALUES 
('Projet décoration salon', 500.00),
('Rénovation cuisine', 750.00),
('Installation plafond', 300.00),
('Décoration chambre', 400.00),
('Consultation design', 150.00); 