const { db } = require('./db');

db.serialize(() => {
  db.run("UPDATE pets SET image_url = '/rocky.jpg' WHERE name = 'Rocky'", (err) => {
    if (err) {
      console.error('Error updating Rocky image:', err);
    } else {
      console.log('Rocky image updated successfully to /rocky.jpg!');
    }
    process.exit(0);
  });
});
