const { db } = require('./db');

db.serialize(() => {
  // Alter table to add review columns if they do not exist
  const alterColumns = [
    "ALTER TABLE adoption_applications ADD COLUMN review_notes TEXT",
    "ALTER TABLE adoption_applications ADD COLUMN pickup_date TEXT",
    "ALTER TABLE adoption_applications ADD COLUMN reviewed_at TIMESTAMP"
  ];

  alterColumns.forEach((sql) => {
    db.run(sql, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Migration error:', err.message);
      }
    });
  });

  console.log('Database migration completed: added review_notes, pickup_date, and reviewed_at.');
  setTimeout(() => process.exit(0), 500);
});
