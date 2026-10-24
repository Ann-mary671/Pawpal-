-- Pet Adoption System Database Schema
-- Compatible with SQLite, PostgreSQL, and MySQL ANSI SQL standards

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'adopter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) CHECK(gender IN ('Male', 'Female')),
    size VARCHAR(20) CHECK(size IN ('Small', 'Medium', 'Large')),
    description TEXT,
    image_url TEXT,
    health_status VARCHAR(100) DEFAULT 'Healthy & Vaccinated',
    adoption_fee DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Available' CHECK(status IN ('Available', 'Pending', 'Adopted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS adoption_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(150) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    housing_type VARCHAR(50),
    has_yard BOOLEAN DEFAULT 0,
    has_other_pets BOOLEAN DEFAULT 0,
    reason_for_adoption TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    review_notes TEXT,
    pickup_date TEXT,
    reviewed_at TIMESTAMP,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Initial Mock Data
INSERT INTO categories (name, description) VALUES
('Dogs', 'Loyal, affectionate, and playful companions'),
('Cats', 'Independent, loving, and curious felines'),
('Birds', 'Cheerful, chirpy, and colorful feathered friends'),
('Small Animals', 'Rabbits, guinea pigs, hamsters, and small pets');

INSERT INTO pets (name, category_id, breed, age, gender, size, description, image_url, health_status, adoption_fee, status) VALUES
('Bella', 1, 'Golden Retriever', 2, 'Female', 'Large', 'Friendly, gentle, loves playing fetch and great with kids.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80', 'Vaccinated & Spayed', 75.00, 'Available'),
('Milo', 2, 'Tabby Cat', 1, 'Male', 'Small', 'Playful and cuddly kitten who loves sunbathing on windowsills.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', 'Vaccinated & Neutered', 45.00, 'Available'),
('Rocky', 1, 'German Shepherd', 3, 'Male', 'Large', 'Active, loyal guard dog and loving companion. Needs daily exercise.', '/rocky.jpg', 'Fully Vaccinated', 90.00, 'Available'),
('Luna', 2, 'Siamese', 2, 'Female', 'Medium', 'Quiet, intelligent cat with beautiful sapphire eyes and charming personality.', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80', 'Spayed & Dewormed', 60.00, 'Available'),
('Pip', 3, 'Parakeet', 1, 'Male', 'Small', 'Chirpy, social and loves whistling familiar tunes.', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80', 'Healthy', 25.00, 'Available'),
('Barnaby', 4, 'Holland Lop Rabbit', 1, 'Male', 'Small', 'Soft, friendly rabbit fond of fresh greens and gentle head scratches.', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80', 'Neutered', 35.00, 'Available'),
('Charlie', 1, 'Beagle', 2, 'Male', 'Medium', 'Energetic, curious hound who loves sniffing adventures in the park and is super friendly with kids.', 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80', 'Vaccinated & Microchipped', 55.00, 'Available'),
('Oliver', 2, 'Ginger Tabby', 1, 'Male', 'Small', 'Affectionate purr machine who adores lap cuddles, chasing laser pointers, and watching birds.', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80', 'Vaccinated & Neutered', 40.00, 'Available'),
('Daisy', 1, 'Labrador Puppy', 1, 'Female', 'Medium', 'Sweet, eager-to-please pup with lots of playful energy. Quickly learns new tricks and loves toys.', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80', 'First Shots & Dewormed', 70.00, 'Available');
