INSERT INTO users (name, email, password) VALUES
('Ali Johnson', 'alijohnson@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bob Smith', 'bsmith@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Car Lee', 'carlee@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES
(1, 'Downtown Loft', 'Modern loft in the city center', 'thumb1.jpg', 'cover1.jpg', 12000, 1, 1, 1, 'Canada', '123 King St', 'Toronto', 'ON', 'M5V1E3', TRUE),
(2, 'Cozy Cottage', 'Quiet retreat near the lake', 'thumb2.jpg', 'cover2.jpg', 8000, 2, 1, 2, 'Canada', '456 Maple Rd', 'Ottawa', 'ON', 'K1A0B1', TRUE),
(3, 'Mountain Cabin', 'Rustic cabin with scenic views', 'thumb3.jpg', 'cover3.jpg', 10000, 1, 2, 3, 'Canada', '789 Pine Ave', 'Banff', 'AB', 'T1L1K2', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES
('2025-07-10', '2025-07-15', 1, 2),
('2025-08-01', '2025-08-05', 2, 3),
('2025-09-20', '2025-09-25', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES
(2, 1, 1, 5, 'Great location and very clean!'),
(3, 2, 2, 4, 'Cozy and quiet, but a bit far from the city.'),
(1, 3, 3, 5, 'Absolutely loved the mountain views!');
