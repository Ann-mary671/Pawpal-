const { db } = require('./db');

const newPets = [
  {
    name: 'Charlie',
    category_id: 1, // Dogs
    breed: 'Beagle',
    age: 2,
    gender: 'Male',
    size: 'Medium',
    description: 'Energetic, curious hound who loves sniffing adventures in the park and is super friendly with children.',
    image_url: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80',
    health_status: 'Vaccinated & Microchipped',
    adoption_fee: 55.00,
    status: 'Available'
  },
  {
    name: 'Oliver',
    category_id: 2, // Cats
    breed: 'Ginger Tabby',
    age: 1,
    gender: 'Male',
    size: 'Small',
    description: 'Affectionate purr machine who adores lap cuddles, chasing laser pointers, and watching birds.',
    image_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80',
    health_status: 'Vaccinated & Neutered',
    adoption_fee: 40.00,
    status: 'Available'
  },
  {
    name: 'Daisy',
    category_id: 1, // Dogs
    breed: 'Labrador Puppy',
    age: 1,
    gender: 'Female',
    size: 'Medium',
    description: 'Sweet, eager-to-please pup with lots of playful energy. Quickly learns new tricks and loves toys.',
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
    health_status: 'First Shots & Dewormed',
    adoption_fee: 70.00,
    status: 'Available'
  }
];

db.serialize(() => {
  const insertSql = `
    INSERT INTO pets (name, category_id, breed, age, gender, size, description, image_url, health_status, adoption_fee, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let completed = 0;
  newPets.forEach((pet) => {
    // Check if pet already exists to prevent duplicate runs
    db.get('SELECT id FROM pets WHERE name = ?', [pet.name], (err, row) => {
      if (err) {
        console.error('Error querying:', err);
      } else if (!row) {
        db.run(
          insertSql,
          [
            pet.name,
            pet.category_id,
            pet.breed,
            pet.age,
            pet.gender,
            pet.size,
            pet.description,
            pet.image_url,
            pet.health_status,
            pet.adoption_fee,
            pet.status
          ],
          (insertErr) => {
            if (insertErr) console.error('Insert error:', insertErr);
            else console.log(`Added new pet: ${pet.name} (${pet.breed})`);
          }
        );
      } else {
        console.log(`Pet ${pet.name} already exists.`);
      }
      completed++;
      if (completed === newPets.length) {
        setTimeout(() => {
          console.log('Finished inserting new pets.');
          process.exit(0);
        }, 500);
      }
    });
  });
});
