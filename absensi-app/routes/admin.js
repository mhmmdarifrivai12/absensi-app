const express = require('express');
const db = require('../config/db');
const { verifyToken, isAdmin, isGuru } = require('../middleware/auth');
const Class = require('../models/class');
const Subject = require('../models/subject');
const TeacherSubject = require('../models/teacherSubject');
const TeacherClass = require('../models/teacherClass');
const Student = require('../models/student');

const router = express.Router();

/**
 * ===============================
 *        KELAS & PELAJARAN
 * ===============================
 */

// ✅ Menambahkan kelas baru
router.post('/classes', verifyToken, isAdmin, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Nama kelas tidak boleh kosong' });
    }

    Class.createClass(name, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal menambahkan kelas', error: err });

        res.status(201).json({ message: 'Kelas berhasil dibuat', class: results });
    });
});

// ✅ Mendapatkan daftar kelas tanpa verifikasi token atau admin
router.get('/classes', (req, res) => {
    Class.getAllClasses((err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil daftar kelas', error: err });

        res.status(200).json({ classes: results });
    });
});

// ✅ Memperbarui nama kelas
router.put('/classes/:id', verifyToken, isAdmin, (req, res) => {
    const classId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Nama kelas tidak boleh kosong' });
    }

    db.query('UPDATE classes SET name = ? WHERE id = ?', [name, classId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal memperbarui kelas', error: err });

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        res.status(200).json({ message: 'Kelas berhasil diperbarui' });
    });
});

// ✅ Menghapus kelas
router.delete('/classes/:id', verifyToken, isAdmin, (req, res) => {
    const classId = req.params.id;

    db.query('DELETE FROM classes WHERE id = ?', [classId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus kelas', error: err });

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        res.status(200).json({ message: 'Kelas berhasil dihapus' });
    });
});


// ✅ Menambahkan mata pelajaran baru
router.post('/subjects', verifyToken, isAdmin, (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Nama pelajaran tidak boleh kosong' });
    }

    Subject.createSubject(name, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal menambahkan pelajaran', error: err });

        res.status(201).json({ message: 'Pelajaran berhasil dibuat', subject: results });
    });
});

// ✅ Menampilkan daftar mata pelajaran
router.get('/subjects', verifyToken, isAdmin, (req, res) => {
    Subject.getAllSubjects((err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil daftar pelajaran', error: err });

        res.json(results);
    });
});

// ✅ Memperbarui nama mata pelajaran
router.put('/subjects/:id', verifyToken, isAdmin, (req, res) => {
    const subjectId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Nama pelajaran tidak boleh kosong' });
    }

    db.query('UPDATE subjects SET name = ? WHERE id = ?', [name, subjectId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal memperbarui pelajaran', error: err });

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelajaran tidak ditemukan' });
        }

        res.status(200).json({ message: 'Pelajaran berhasil diperbarui' });
    });
});

// ✅ Menghapus mata pelajaran
router.delete('/subjects/:id', verifyToken, isAdmin, (req, res) => {
    const subjectId = req.params.id;

    db.query('DELETE FROM subjects WHERE id = ?', [subjectId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus pelajaran', error: err });

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Pelajaran tidak ditemukan' });
        }

        res.status(200).json({ message: 'Pelajaran berhasil dihapus' });
    });
});


/**
 * ===============================
 *             SISWA
 * ===============================
 */
// ✅ Route untuk menambahkan siswa ke dalam kelas
router.post('/students', (req, res) => {
    const { name, nis, class_id } = req.body;

    // Validasi input
    if (!name || !nis || !class_id) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Panggil fungsi addStudentToClass dari model Student
    Student.addStudentToClass(name, nis, class_id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal menambahkan siswa', error: err });
        }
        res.status(201).json({ message: 'Siswa berhasil ditambahkan', data: result });
    });
});


// ✅ Menampilkan daftar siswa sesuai dengan kelasnya masing-masing
router.get('/students/grouped-by-class', verifyToken, isAdmin, (req, res) => {
    Student.getAllStudents((err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil daftar siswa', error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Tidak ada siswa yang terdaftar' });
        }

        // Mengelompokkan siswa berdasarkan class_id
        const groupedStudents = results.reduce((acc, student) => {
            const classId = student.class_id;
            if (!acc[classId]) {
                acc[classId] = [];
            }
            acc[classId].push({
                id: student.id,
                name: student.name,
                nis: student.nis,
            });
            return acc;
        }, {});

        res.json(groupedStudents);
    });
});


// ✅ Menampilkan daftar siswa berdasarkan kelas
router.get('/classes/:class_id/students', verifyToken, isAdmin, (req, res) => {
    const { class_id } = req.params;

    Student.getStudentsByClass(class_id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil daftar siswa', error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: `Tidak ada siswa di kelas ${class_id}` });
        }

        res.json(results);
    });
});

router.put('/students/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, nis, class_id } = req.body;

    // Validasi input
    if (!name || !nis || !class_id) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Panggil fungsi updateStudent dari model Student
    Student.updateStudent(id, name, nis, class_id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal memperbarui data siswa', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Siswa tidak ditemukan' });
        }

        res.json({ message: 'Data siswa berhasil diperbarui', data: result });
    });
});

router.delete('/students/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;

    // Panggil fungsi deleteStudent dari model Student
    Student.deleteStudent(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Gagal menghapus siswa', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Siswa tidak ditemukan' });
        }

        res.json({ message: 'Siswa berhasil dihapus' });
    });
});



/**
 * ===============================
 *   MENETAPKAN GURU KE KELAS & PELAJARAN
 * ===============================
 */

// ✅ Admin menetapkan guru ke kelas, mata pelajaran, hari, jam, dan durasi mengajar
router.post('/assign-teacher', verifyToken, isAdmin, (req, res) => {
    const { teacher_id, class_id, subject_id, teaching_day, start_time, duration } = req.body;

    if (!teacher_id || !class_id || !subject_id || !teaching_day || !start_time || !duration) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Validasi hari mengajar
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    if (!validDays.includes(teaching_day)) {
        return res.status(400).json({ message: 'Hari mengajar tidak valid' });
    }

    // Pastikan teacher_id adalah guru
    db.query('SELECT id FROM users WHERE id = ? AND role = "guru"', [teacher_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Guru tidak ditemukan' });
        }

        // Insert ke database dengan hari, jam mulai, dan durasi
        const query = `
            INSERT INTO teachers_classes_subjects (teacher_id, class_id, subject_id, teaching_day, start_time, duration)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [teacher_id, class_id, subject_id, teaching_day, start_time, duration], (err, results) => {
            if (err) return res.status(500).json({ message: 'Gagal menetapkan guru', error: err });

            res.json({ message: 'Guru berhasil ditetapkan ke kelas dan mata pelajaran dengan jadwal mengajar' });
        });
    });
});

router.get('/teachers-schedule', verifyToken, isAdmin, (req, res) => {
    const query = `
        SELECT 
            tcs.id AS id, 
            u.name AS teacher_name, 
            c.name AS class_name, 
            s.name AS subject_name,
            tcs.teaching_day, 
            tcs.start_time, 
            tcs.duration
        FROM teachers_classes_subjects tcs
        JOIN users u ON tcs.teacher_id = u.id
        JOIN classes c ON tcs.class_id = c.id
        JOIN subjects s ON tcs.subject_id = s.id
        ORDER BY tcs.teaching_day, tcs.start_time;
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal mengambil data jadwal guru', error: err });

        res.json(results);
    });
});

router.put('/assign-teacher/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { teacher_id, class_id, subject_id, teaching_day, start_time, duration } = req.body;

    if (!teacher_id || !class_id || !subject_id || !teaching_day || !start_time || !duration) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    const query = `
        UPDATE teachers_classes_subjects 
        SET teacher_id = ?, class_id = ?, subject_id = ?, teaching_day = ?, start_time = ?, duration = ?
        WHERE id = ?
    `;

    db.query(query, [teacher_id, class_id, subject_id, teaching_day, start_time, duration, id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal memperbarui penugasan guru', error: err });

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Penugasan guru tidak ditemukan' });
        }

        res.json({ message: 'Penugasan guru berhasil diperbarui' });
    });
});

router.delete('/assign-teacher/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM teachers_classes_subjects WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Gagal menghapus penugasan guru', error: err });

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Penugasan guru tidak ditemukan' });
        }

        res.json({ message: 'Penugasan guru berhasil dihapus' });
    });
});


/**
 * ===============================
 *   MENAMPILKAN DAFTAR GURU
 * ===============================
 */
// ✅ GET: Menampilkan semua user dengan role "guru"
router.get('/teachers', verifyToken, isAdmin, (req, res) => {
    const query = `SELECT id, username, name FROM users WHERE role = ?`;

    db.query(query, ['guru'], (err, results) => {
        if (err) {
            console.error('Database Query Error:', err.message);
            return res.status(500).json({ message: 'Gagal mengambil data guru', error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Tidak ada guru ditemukan' });
        }

        res.json(results);
    });
});

router.put('/teachers/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, username } = req.body;

    if (!name || !username) {
        return res.status(400).json({ message: 'Nama dan username wajib diisi' });
    }

    const query = `
        UPDATE users 
        SET name = ?, username = ? 
        WHERE id = ? AND role = "guru"
    `;

    db.query(query, [name, username, id], (err, results) => {
        if (err) {
            console.error('Database Query Error:', err.message);
            return res.status(500).json({ message: 'Gagal memperbarui data guru', error: err.message });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Guru tidak ditemukan atau tidak memiliki role guru' });
        }

        res.json({ message: 'Data guru berhasil diperbarui' });
    });
});

// Ambil semua data user - hanya admin
router.get('/users', verifyToken, isAdmin, (req, res) => {
    const query = `SELECT id, name, username, role FROM users ORDER BY id ASC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Gagal mengambil data user', error: err });
        }

        res.json(results);
    });
});

// Hapus user berdasarkan ID - hanya admin
router.delete('/users/:id', verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM users WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Gagal menghapus user:', err);
            return res.status(500).json({ message: 'Gagal menghapus user', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json({ message: 'User berhasil dihapus' });
    });
});




module.exports = router;
