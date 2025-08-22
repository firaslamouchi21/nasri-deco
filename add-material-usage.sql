
INSERT INTO material_logs (material_id, action, quantity_change, reason, created_at) VALUES 
(1, 'used', -5, 'Projet salon', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 'used', -3, 'Projet cuisine', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(2, 'used', -2, 'Rénovation', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 'used', -50, 'Installation', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(4, 'used', -10, 'Décoration', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 'used', -15, 'Projet client', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 'used', -8, 'Maintenance', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(7, 'used', -25, 'Installation plafond', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(8, 'used', -12, 'Rénovation chambre', DATE_SUB(NOW(), INTERVAL 8 DAY));


INSERT INTO material_logs (material_id, action, quantity_change, reason, created_at) VALUES 
(1, 'used', -10, 'Projet ancien', DATE_SUB(NOW(), INTERVAL 40 DAY)),
(2, 'used', -5, 'Projet ancien', DATE_SUB(NOW(), INTERVAL 35 DAY)); 