const express = require('express');
const db = require('../config/db');
const { verifyToken, isGuru } = require('../middleware/auth');
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const router = express.Router();

// Guru melihat kelas & mata pelajaran yang telah diatur oleh admin
router.get('/assigned-classes', verifyToken, isGuru, (req, res) => {
    const teacherId = req.user.id;

    const query = `
        SELECT c.id as class_id, c.name as class_name, s.id as subject_id, s.name as subject_name
        FROM teachers_classes_subjects tcs
        JOIN classes c ON tcs.class_id = c.id
        JOIN subjects s ON tcs.subject_id = s.id
        WHERE tcs.teacher_id = ?
    `;

    db.query(query, [teacherId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching assigned classes', error: err });
        }
        res.json(results);
    });
});

// Guru melihat daftar siswa di kelas yang dia ajar
router.get('/students/:classId', verifyToken, isGuru, (req, res) => {
    const classId = parseInt(req.params.classId, 10);

    if (isNaN(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
    }

    const query = `SELECT id, name, nis FROM students WHERE class_id = ?`;

    db.query(query, [classId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching students', error: err });
        }
        res.json(results);
    });
});

// POST - Tambah data absensi
router.post('/attendance', verifyToken, isGuru, (req, res) => {
    const { attendance } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
        return res.status(400).json({ message: 'Attendance data is required' });
    }

    let values = [];

    attendance.forEach(item => {
        const { student_id, subject_id, class_id, date, status } = item;

        if (!student_id || !subject_id || !class_id || !date || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!['hadir', 'alpha', 'izin', 'sakit'].includes(status)) {
            return res.status(400).json({ message: 'Invalid attendance status' });
        }

        const attendanceDate = new Date(date);
        if (isNaN(attendanceDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const day = days[attendanceDate.getDay()];
        values.push([student_id, subject_id, class_id, date, day, status]);
    });

    // Insert langsung tanpa pengecekan, memungkinkan absen kapan saja per mata pelajaran
    const insertQuery = `INSERT INTO attendance (student_id, subject_id, class_id, date, day, status) VALUES ?`;
    db.query(insertQuery, [values], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error recording attendance', error: err });
        }
        res.json({ message: 'Attendance recorded successfully' });
    });
});


router.put('/attendance/:id', verifyToken, isGuru, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Pastikan status yang dikirimkan valid
    const validStatus = ['hadir', 'alpha', 'izin', 'sakit'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({ message: 'Invalid attendance status' });
    }

    // Cek apakah absensi dengan ID tersebut ada
    db.query('SELECT * FROM attendance WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        // Update hanya status absensi
        db.query('UPDATE attendance SET status = ? WHERE id = ?', [status, id], (err, updateResults) => {
            if (err) return res.status(500).json({ message: 'Failed to update attendance', error: err });

            res.json({ message: 'Attendance updated successfully' });
        });
    });
});


// 🔹 Guru melihat daftar kelas & mata pelajaran yang dia ajar
router.get('/assigned-subjects', verifyToken, isGuru, (req, res) => {
    const teacherId = req.user.id;

    const query = `
        SELECT 
            c.id AS class_id, 
            c.name AS class_name, 
            s.id AS subject_id, 
            s.name AS subject_name
        FROM teachers_classes_subjects tcs
        JOIN classes c ON tcs.class_id = c.id
        JOIN subjects s ON tcs.subject_id = s.id
        WHERE tcs.teacher_id = ?;
    `;

    db.query(query, [teacherId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching assigned subjects', error: err });
        }
        res.json(results);
    });
});

// Guru melihat riwayat absensi siswa berdasarkan kelas yang dia ajar (dikelompokkan per hari)
const moment = require('moment');

router.get('/attendance-history/:classId', verifyToken, isGuru, (req, res) => {
    const classId = parseInt(req.params.classId, 10);

    if (isNaN(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
    }

    const query = `
        SELECT 
            a.date, 
            a.day, 
            s.name AS student_name, 
            a.status
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.class_id = ?
        ORDER BY a.date DESC, s.name ASC
    `;

    db.query(query, [classId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching attendance history', error: err });
        }

        // 🔹 Format ulang tanggal agar lebih bersih
        const groupedHistory = results.reduce((acc, record) => {
            const formattedDate = moment(record.date).format('YYYY-MM-DD'); // Format menjadi YYYY-MM-DD
            const key = `${formattedDate} (${record.day})`;

            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push({ student_name: record.student_name, status: record.status });
            return acc;
        }, {});

        res.json(groupedHistory);
    });
});

router.get('/name', verifyToken, (req, res) => {
    const { username, role } = req.user; // Ambil username & role dari token

    db.query('SELECT name FROM users WHERE username = ? AND role = ?', [username, role], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ name: results[0].name }); // Hanya mengembalikan name
    });
});

router.put('/user/update-name', verifyToken, (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // Ambil ID user dari token

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    // Update hanya kolom name berdasarkan user yang sedang login
    db.query('UPDATE users SET name = ? WHERE id = ?', [name, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update name', error: err });
        }
        res.json({ message: 'Name updated successfully' });
    });
});



module.exports = router;
