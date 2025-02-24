const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Menampilkan absensi berdasarkan kelas dan tanggal
router.get('/attendance/:classId/:date', (req, res) => {
    const classId = parseInt(req.params.classId, 10);
    const date = req.params.date;  // Tanggal format 'YYYY-MM-DD'

    if (isNaN(classId)) {
        return res.status(400).json({ message: 'Invalid class ID' });
    }

    const query = `
        SELECT 
            a.class_id,
            c.name AS class_name,
            a.student_id,
            s.name AS student_name,
            a.subject_id,
            sub.name AS subject_name,
            a.date,
            a.day,
            a.status,
            t.username AS teacher_name
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN classes c ON a.class_id = c.id
        JOIN subjects sub ON a.subject_id = sub.id
        JOIN teachers_classes_subjects tcs ON a.class_id = tcs.class_id AND a.subject_id = tcs.subject_id
        JOIN users t ON tcs.teacher_id = t.id
        WHERE a.class_id = ? AND a.date = ?
        ORDER BY t.username ASC, sub.name ASC, s.name ASC
    `;

    db.query(query, [classId, date], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching attendance data', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this class and date' });
        }

        // Format tanggal menjadi lebih rapi
        const formattedResults = results.map(record => ({
            ...record,
            date: new Date(record.date).toLocaleDateString('id-ID'),  // Format tanggal DD-MM-YYYY
            status: record.status || 'Belum Diabsen'  // Menampilkan status "Belum Diabsen" jika kosong
        }));

        // Menyusun data per guru dan mata pelajaran
        const response = {};
        formattedResults.forEach(record => {
            const teacherSubjectKey = `${record.teacher_name} - ${record.subject_name}`;
            if (!response[teacherSubjectKey]) {
                response[teacherSubjectKey] = {
                    teacher_name: record.teacher_name,
                    subject_name: record.subject_name,
                    attendance: []
                };
            }
            response[teacherSubjectKey].attendance.push({
                student_name: record.student_name,
                date: record.date,
                day: record.day,
                status: record.status
            });
        });

        // Mengirimkan data per guru dan mata pelajaran
        res.json({
            class_id: results[0].class_id,
            class_name: results[0].class_name,
            attendance: Object.values(response)
        });
    });
});


module.exports = router;
