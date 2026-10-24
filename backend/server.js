const express = require('express');
const cors = require('cors');
const { db, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize SQL database tables & data
initDatabase();

// 1. Health / Root Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pet Adoption API is operational' });
});

// 2. Categories
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories ORDER BY name ASC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 3. Pets Listing (with optional search & category filter)
app.get('/api/pets', (req, res) => {
  const { category, search, size } = req.query;
  let sql = `
    SELECT p.*, c.name AS category_name 
    FROM pets p
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'All') {
    sql += ' AND c.name = ?';
    params.push(category);
  }

  if (size && size !== 'All') {
    sql += ' AND p.size = ?';
    params.push(size);
  }

  if (search) {
    sql += ' AND (p.name LIKE ? OR p.breed LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY p.id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 4. Pet Details by ID
app.get('/api/pets/:id', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name 
    FROM pets p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    res.json(row);
  });
});

// 5. Submit Adoption Application
app.post('/api/adoptions', (req, res) => {
  const {
    pet_id,
    applicant_name,
    applicant_email,
    applicant_phone,
    housing_type,
    has_yard,
    has_other_pets,
    reason_for_adoption
  } = req.body;

  if (!pet_id || !applicant_name || !applicant_email || !applicant_phone || !reason_for_adoption) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const sql = `
    INSERT INTO adoption_applications 
    (pet_id, applicant_name, applicant_email, applicant_phone, housing_type, has_yard, has_other_pets, reason_for_adoption)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    pet_id,
    applicant_name,
    applicant_email,
    applicant_phone,
    housing_type || 'Apartment',
    has_yard ? 1 : 0,
    has_other_pets ? 1 : 0,
    reason_for_adoption
  ];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Optionally update pet status to Pending
    db.run("UPDATE pets SET status = 'Pending' WHERE id = ?", [pet_id]);

    res.status(201).json({
      message: 'Adoption application submitted successfully!',
      applicationId: this.lastID
    });
  });
});

// 6. View All Applications
app.get('/api/adoptions', (req, res) => {
  const sql = `
    SELECT a.*, p.name AS pet_name, p.breed AS pet_breed, p.image_url AS pet_image
    FROM adoption_applications a
    JOIN pets p ON a.pet_id = p.id
    ORDER BY a.applied_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 7. Review Application (Approve / Reject with Notes and Pickup Date)
app.patch('/api/adoptions/:id/review', (req, res) => {
  const { id } = req.params;
  const { status, review_notes, pickup_date } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: "Status must be 'Approved' or 'Rejected'." });
  }

  // Get application to find associated pet_id
  db.get('SELECT * FROM adoption_applications WHERE id = ?', [id], (err, application) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    const updateAppSql = `
      UPDATE adoption_applications 
      SET status = ?, review_notes = ?, pickup_date = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateAppSql, [status, review_notes || null, pickup_date || null, id], function (updateErr) {
      if (updateErr) {
        return res.status(500).json({ error: updateErr.message });
      }

      // Update pet status accordingly:
      // If approved -> 'Adopted'
      // If rejected -> check if any other pending applications exist; if not -> 'Available'
      if (status === 'Approved') {
        db.run("UPDATE pets SET status = 'Adopted' WHERE id = ?", [application.pet_id]);
      } else if (status === 'Rejected') {
        db.get(
          "SELECT COUNT(*) as count FROM adoption_applications WHERE pet_id = ? AND status = 'Pending' AND id != ?",
          [application.pet_id, id],
          (countErr, row) => {
            if (!countErr && row && row.count === 0) {
              db.run("UPDATE pets SET status = 'Available' WHERE id = ?", [application.pet_id]);
            }
          }
        );
      }

      res.json({
        message: `Application has been marked as ${status}.`,
        status,
        review_notes,
        pickup_date
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
