const bcrypt = require('bcryptjs');
const db = require('../config/db');

const User = {
    createUser: (name, username, password, role, callback) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) throw err;
            db.query(
                'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
                [name, username, hashedPassword, role],
                (err, results) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, results);
                    }
                }
            );
        });
    },

    findUserByUsername: (username, callback) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results[0]);
            }
        });
    },

    findUserById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results[0]);
            }
        });
    },

    updatePassword: (id, newPassword, callback) => {
        db.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, id], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    }
};

module.exports = User;
