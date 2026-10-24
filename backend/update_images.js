const { db } = require('./db');

db.serialize(() => {
  db.run("UPDATE pets SET image_url = 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80' WHERE name = 'Rocky'");
  db.run("UPDATE pets SET image_url = 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80' WHERE name = 'Luna'");
  db.run("UPDATE pets SET image_url = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' WHERE name = 'Bella'");
  db.run("UPDATE pets SET image_url = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80' WHERE name = 'Milo'");
  db.run("UPDATE pets SET image_url = 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80' WHERE name = 'Pip'");
  db.run("UPDATE pets SET image_url = 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80' WHERE name = 'Barnaby'", (err) => {
    if (err) {
      console.error('Error updating images:', err);
    } else {
      console.log('All pet images updated successfully!');
    }
    process.exit(0);
  });
});
