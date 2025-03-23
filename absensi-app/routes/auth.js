const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { verifyToken, isAdmin } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Registrasi pengguna baru
router.post('/register', verifyToken, isAdmin, (req, res) => {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    User.findUserByUsername(username, (err, user) => {
        if (user) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        User.createUser(name, username, password, role, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to create user', error: err });
            }
            return res.status(201).json({ message: 'User created successfully' });
        });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findUserByUsername(username, (err, user) => {
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const payload = { id: user.id, username: user.username, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.json({ 
                token, 
                role: user.role // Pastikan role dikembalikan di sini
            });
        });
    });
});

router.post('/change-password', verifyToken, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Ambil ID user dari token JWT
    const userRole = req.user.role; // Ambil role dari token JWT

    if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
    }

    // Cari user berdasarkan ID
    User.findUserById(userId, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Jika role adalah guru, wajib masukkan oldPassword
        if (userRole === 'guru') {
            if (!oldPassword) {
                return res.status(400).json({ message: 'Old password is required for teachers' });
            }

            // Bandingkan oldPassword
            bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    return res.status(400).json({ message: 'Old password is incorrect' });
                }

                // Hash dan update password
                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) throw err;
                    User.updatePassword(userId, hashedPassword, (err, result) => {
                        if (err) return res.status(500).json({ message: 'Failed to update password', error: err });
                        return res.json({ message: 'Password changed successfully' });
                    });
                });
            });
        } else {
            // Jika role adalah admin, langsung update password tanpa oldPassword
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) throw err;
                User.updatePassword(userId, hashedPassword, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Failed to update password', error: err });
                    return res.json({ message: 'Password changed successfully' });
                });
            });
        }
    });
});

module.exports = router;
