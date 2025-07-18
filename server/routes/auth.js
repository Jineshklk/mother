const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Auto-create upload directory if it doesn't exist
const uploadDir = 'uploads/profile_photos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}${ext}`);
  },
});
const upload = multer({ storage });

// ✅ Upload profile photo
router.post('/upload-photo', authenticate, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const photoPath = `/uploads/profile_photos/${req.file.filename}`;

  db.query('UPDATE users SET photo = ? WHERE id = ?', [photoPath, req.user.id], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: 'Failed to save photo' });
    }

    res.json({ message: 'Photo uploaded successfully', photo: photoPath });
  });
});

// ✅ Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hash],
    (err) => {
      if (err) return res.status(500).json({ message: 'User already exists or DB error' });
      res.json({ message: 'User registered' });
    }
  );
});

// ✅ Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, results[0].password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: results[0].id }, 'secretkey');
    res.json({ token });
  });
});

// ✅ Get current user info
router.get('/me', authenticate, (req, res) => {
  db.query('SELECT id, name, email,photo FROM users WHERE id = ?', [req.user.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// ✅ Update profile
router.put('/profile', authenticate, (req, res) => {
  const { age, gender, religion, profession, location, interests } = req.body;

  const sql = `
    UPDATE users 
    SET age = ?, gender = ?, religion = ?, profession = ?, location = ?, interests = ?
    WHERE id = ?
  `;

  db.query(sql, [age, gender, religion, profession, location, interests, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Update failed' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found or no changes made' });

    res.json({ message: 'Profile updated' });
  });
});

// ✅ Search matches
router.post('/search', authenticate, (req, res) => {
  const { age, gender, religion, profession, location } = req.body;

  let sql = 'SELECT id, name, age, gender, religion, profession, location, interests FROM users WHERE 1=1';
  const values = [];

  if (age) { sql += ' AND age = ?'; values.push(age); }
  if (gender) { sql += ' AND gender = ?'; values.push(gender); }
  if (religion) { sql += ' AND religion LIKE ?'; values.push(`%${religion}%`); }
  if (profession) { sql += ' AND profession LIKE ?'; values.push(`%${profession}%`); }
  if (location) { sql += ' AND location LIKE ?'; values.push(`%${location}%`); }

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ message: 'Search failed' });
    res.json(results);
  });
});

// ✅ Send interest
router.post('/interest', authenticate, (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;

  const sql = 'INSERT INTO interests (sender_id, receiver_id) VALUES (?, ?)';
  db.query(sql, [senderId, receiverId], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Interest already sent' });
      }
      return res.status(500).json({ message: 'Failed to send interest' });
    }
    res.json({ message: 'Interest sent successfully' });
  });
});

// ✅ Accept/Reject interest
router.put('/interest/:id/status', authenticate, (req, res) => {
  const interestId = req.params.id;
  const { status } = req.body; // "accepted" or "rejected"

  const sql = 'UPDATE interests SET status = ? WHERE id = ?';
  db.query(sql, [status, interestId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update interest status' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.json({ message: `Interest ${status}` });
  });
});

// ✅ Get interests (sent and received)
router.get('/interests', authenticate, (req, res) => {
  const userId = req.user.id;

  const sentQuery = `
    SELECT i.id, i.status, u.id AS receiver_id, u.name, u.age, u.gender, u.location
    FROM interests i
    JOIN users u ON i.receiver_id = u.id
    WHERE i.sender_id = ?
  `;

  const receivedQuery = `
    SELECT i.id, i.status, u.id AS sender_id, u.name, u.age, u.gender, u.location
    FROM interests i
    JOIN users u ON i.sender_id = u.id
    WHERE i.receiver_id = ?
  `;

  db.query(sentQuery, [userId], (err, sent) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch sent interests' });

    db.query(receivedQuery, [userId], (err, received) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch received interests' });

      const sentFormatted = sent.map(row => ({
        id: row.id,
        status: row.status,
        receiver: {
          id: row.receiver_id,
          name: row.name,
          age: row.age,
          gender: row.gender,
          location: row.location,
        },
      }));

      const receivedFormatted = received.map(row => ({
        id: row.id,
        status: row.status,
        sender: {
          id: row.sender_id,
          name: row.name,
          age: row.age,
          gender: row.gender,
          location: row.location,
        },
      }));

      res.json({ sent: sentFormatted, received: receivedFormatted });
    });
  });
});

module.exports = router;


//MESSAGE
// ✅ Send a message
router.post('/message', authenticate, (req, res) => {
  const senderId = req.user.id;
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).json({ message: 'Receiver and message required' });
  }

  const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
  db.query(sql, [senderId, receiverId, message], (err) => {
    if (err) {
      console.error("Message send error:", err);
      return res.status(500).json({ message: 'Failed to send message' });
    }
    res.json({ message: 'Message sent' });
  });
});

// ✅ Get chat history with another user
router.get('/messages/:userId', authenticate, (req, res) => {
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  const sql = `
    SELECT 
      m.id, m.sender_id, m.receiver_id, m.message, m.timestamp,
      s.name AS sender_name, r.name AS receiver_name
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.timestamp ASC
  `;

  db.query(sql, [userId, otherUserId, otherUserId, userId], (err, results) => {
    if (err) {
      console.error("Fetch messages error:", err);
      return res.status(500).json({ message: 'Failed to fetch messages' });
    }
    res.json(results);
  });
});
