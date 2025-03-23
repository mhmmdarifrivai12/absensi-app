const db = require('../config/db');

const Student = {
    /**
     * ✅ Tambah siswa ke dalam kelas dengan validasi
     */
    addStudentToClass: (name, nis, class_id, callback) => {
        if (!name || !nis || isNaN(class_id)) {
            return callback(new Error('Invalid input: name, nis, and class_id are required'));
        }

        const query = `INSERT INTO students (name, nis, class_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
        db.query(query, [name, nis, class_id], (err, results) => {
            if (err) {
                console.error('Error adding student:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    /**
     * ✅ Ambil daftar siswa berdasarkan class_id tertentu
     */
    getStudentsByClass: (class_id, callback) => {
        if (isNaN(class_id)) {
            return callback(new Error('Invalid class_id'));
        }

        const query = `
            SELECT students.id, students.name, students.nis, students.class_id, classes.name AS class_name
            FROM students
            LEFT JOIN classes ON students.class_id = classes.id
            WHERE students.class_id = ?
        `;
        db.query(query, [class_id], (err, results) => {
            if (err) {
                console.error('Error fetching students by class:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },

    /**
     * ✅ Ambil semua siswa dan kelompokkan berdasarkan kelas
     */
    getAllStudents: (callback) => {
        const query = `
            SELECT students.id, students.name, students.nis, students.class_id, classes.name AS class_name
            FROM students
            LEFT JOIN classes ON students.class_id = classes.id
            ORDER BY students.class_id, students.name
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching all students:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
        // ✅ Fungsi untuk memperbarui data siswa
        updateStudent: (id, name, nis, class_id, callback) => {
            const query = `UPDATE students SET name = ?, nis = ?, class_id = ?, updated_at = NOW() WHERE id = ?`;
            db.query(query, [name, nis, class_id, id], (err, results) => {
                if (err) {
                    console.error('Error updating student:', err);
                    return callback(err, null);
                }
                callback(null, results);
            });
        },

    // ✅ Fungsi untuk menghapus siswa berdasarkan ID
    deleteStudent: (id, callback) => {
        const query = `DELETE FROM students WHERE id = ?`;
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Error deleting student:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }

};



module.exports = Student;
