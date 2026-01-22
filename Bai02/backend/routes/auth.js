const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

/* REGISTER */
router.post('/register', async (req, res) => {
  console.log('BODY:', req.body); // 👈 THÊM DÒNG NÀY
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  User.create(
    { username, email, password: hash },
    (err) => {
      if (err)
        return res.status(500).json({ message: 'Register failed' });

      res.json({ message: 'Register success' });
    }
  );
});

/* LOGIN */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log('LOGIN BODY:', req.body);

  User.findByEmail(email, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    return res.json({
      message: 'Login success',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });
});

module.exports = router; // 👈 BẮT BUỘC PHẢI CÓ
