# Sistem Absensi dan Monitoring

Sistem ini digunakan untuk absensi dan monitoring kegiatan belajar mengajar di sekolah dengan peran Admin dan Guru.

## REVISI

#### 1. Register (POST)
**Endpoint:** `api/auth/register`
```json
{
    "name": "Guru2",
    "password": "guru",
    "role": "guru"
}
```
#### 2. Login (POST)
**Endpoint:** `api/auth/login`
```json
{
    "id": "001",
    "password": "admin"
}

```
#### 3. DASHBOARD GURU HISTORY RANGE TANGGAL (GET)
- **Endpoint:** `api/teacher/attendance-history/:classId/:subjectId/:startDate?/:endDate?`
- **Endpoint Contoh:** `api/teacher/attendance-history/62/50/2025-04-01/2026-04-30`
##### NOTES : untuk input tanggal opsional jadi tetap bisa walaupun ga input tanggal tampilan kelas tetap muncul ga mesti input tanggal
```json
{
    "2025-08-01 (Rabu)": [
        {
            "id": 3,
            "student_name": "ANISAH",
            "status": "Izin"
        }
    ],
    "2025-04-30 (Senin)": [
        {
            "id": 1,
            "student_name": "ALWANSYAH DIFFAREL",
            "status": "Izin"
        }
    ],
    "2025-04-01 (Selasa)": [
        {
            "id": 2,
            "student_name": "AMANDA ELFARIANI",
            "status": "Hadir"
        }
    ]
}

```
#### 4. DASHBOARD GURU REKAP ABSEN BY KELAS YANG DIAJAR (GET)
- **Endpoint Contoh :** `api/teacher/attendance-recap/:classId/:startDate/:endDate`
- **Endpoint Contoh :** `api/teacher/attendance-recap/62/2025-04-01/2026-04-30`
```json
{
    "ALWANSYAH DIFFAREL": {
        "hadir": 0,
        "izin": 1,
        "sakit": 0,
        "alpha": 0,
        "dispen": 0
    },
    "AMANDA ELFARIANI": {
        "hadir": 1,
        "izin": 0,
        "sakit": 0,
        "alpha": 0,
        "dispen": 0
    },
    "ANISAH": {
        "hadir": 0,
        "izin": 1,
        "sakit": 0,
        "alpha": 0,
        "dispen": 0
    }
}

```
#### 5. DASHBOARD ADMIN REKAP ABSEN (GET)
- **Endpoint :** `api/admin/attendance-recap/:startDate/:endDate`
- **Endpoint Contoh:** `api/admin/attendance-recap/2025-04-01/2026-04-30`
```json
{
    "11 F1": {
        "ALWANSYAH DIFFAREL": {
            "hadir": 0,
            "izin": 1,
            "sakit": 0,
            "alpha": 0,
            "dispen": 0
        },
        "AMANDA ELFARIANI": {
            "hadir": 1,
            "izin": 0,
            "sakit": 0,
            "alpha": 0,
            "dispen": 0
        },
        "ANISAH": {
            "hadir": 0,
            "izin": 1,
            "sakit": 0,
            "alpha": 0,
            "dispen": 0
        }
    },
    "11 F3": {
        "AULIA AZZAHRA": {
            "hadir": 0,
            "izin": 0,
            "sakit": 0,
            "alpha": 1,
            "dispen": 0
        }
    }
}

```
#### 6. DASHBOARD ADMIN History (GET)
- **Endpoint :** `api/admin/attendance-history`
- **Endpoint Contoh:** `api/admin/attendance-history?classId=62&subjectId=50&startDate=2025-04-01&endDate=2026-04-01`
- kirim value ke parameter valid (classId, subjectId, startDate, endDate)
```json
[
    {
        "id": 3,
        "date": "2025-07-31T17:00:00.000Z",
        "day": "Rabu",
        "student_name": "ANISAH",
        "status": "Izin",
        "class_id": 62,
        "subject_id": 50
    },
    {
        "id": 1,
        "date": "2025-04-29T17:00:00.000Z",
        "day": "Senin",
        "student_name": "ALWANSYAH DIFFAREL",
        "status": "Izin",
        "class_id": 62,
        "subject_id": 50
    },
    {
        "id": 2,
        "date": "2025-03-31T17:00:00.000Z",
        "day": "Selasa",
        "student_name": "AMANDA ELFARIANI",
        "status": "Hadir",
        "class_id": 62,
        "subject_id": 50
    }
]

```

## API Endpoint

### Autentikasi

#### 1. Register (POST)
**Endpoint:** `api/auth/register`
```json
{
    "name": "Muhammad Arif Rivai",
    "username": "arif12",
    "password": "arif",
    "role": "guru"
}
```

#### 2. Login (POST)
**Endpoint:** `api/auth/login`
```json
{
    "username": "arif",
    "password": "rivai"
}
```

#### 3. Ubah Password (POST)
**Endpoint:** `api/auth/change-password`
- **Admin**
```json
{
  "newPassword": "arif"
}
```
- **Guru**
```json
{
  "oldPassword": "rivai",
  "newPassword": "arif"
}
```

---

### Admin

#### 1. Manajemen Kelas
- **Tambah Kelas (POST)** `api/admin/classes/`
```json
{
    "name": "12 IPA 9"
}
```
- **Lihat Daftar Kelas (GET)** `api/admin/classes/`
- **Ubah Kelas (PUT)** `api/admin/classes/:class_id`
```json
{
    "name": "10 IPA 1 Update"
}
```
- **Hapus Kelas (DELETE)** `api/admin/classes/:id`

#### 2. Manajemen Mata Pelajaran
- **Tambah Mata Pelajaran (POST)** `api/admin/subjects`
```json
{
    "name": "Matematika"
}
```
- **Lihat Daftar Mata Pelajaran (GET)** `api/admin/subjects`
- **Ubah Mata Pelajaran (PUT)** `api/admin/subjects/:id`
```json
{
    "name": "Tester Final Update Mapel"
}
```
- **Hapus Mata Pelajaran (DELETE)** `api/admin/subjects/:id`

#### 3. Manajemen Siswa
- **Tambah Siswa (POST)** `api/admin/students`
```json
{
    "name": "rivai",
    "nis": "22132441",
    "class_id": 10
}
```
- **Lihat Daftar Siswa Berdasarkan Kelas (GET)** `api/admin/students/grouped-by-class`
- **Lihat Siswa dalam Kelas Tertentu (GET)** `api/admin/classes/:class_id/students`
- **Ubah Siswa (PUT)** `api/admin/students/:id`
```json
{
    "name": "rivai Update",
    "nis": "22132441",
    "class_id": 11
}
```
- **Hapus Siswa (DELETE)** `api/admin/students/:id`

#### 4. Penjadwalan Guru
- **Tetapkan Jadwal (POST)** `api/admin/assign-teacher`
```json
{
    "teacher_id": 2,
    "class_id": 10,
    "subject_id": 22,
    "teaching_day": "Minggu",
    "start_time": "08:00:00",
    "duration": 90
}
```
- **Lihat Jadwal Guru (GET)** `api/admin/teachers-schedule`
- **Ubah Jadwal (PUT)** `api/admin/assign-teacher/:id`
```json
{
    "teacher_id": 7,
    "class_id": 10,
    "subject_id": 22,
    "teaching_day": "Minggu",
    "start_time": "08:00:00",
    "duration": 90
}
```
- **Hapus Jadwal (DELETE)** `api/admin/teachers-schedule/:id`

#### 5. Manajemen Guru
- **Lihat Daftar Guru (GET)** `api/admin/teachers`
- **Ubah Guru (PUT)** `api/admin/teachers/:id`
```json
{
    "name": "Muhammad",
    "username": "guru"
}
```

---

### Guru

#### 1. Absensi
- **Tambah Absensi (POST)** `api/teacher/attendance`
```json
{
    "attendance": [
        {
            "student_id": "21",
            "subject_id": "17",
            "class_id": "10",
            "date": "2025-03-28",
            "status": "alpha"
        }
    ]
}
```
- **Ubah Absensi (PUT)** `api/teacher/attendance/:id`
```json
{
  "status": "izin"
}
```
- **Lihat Kelas dan Mata Pelajaran yang Diajarkan (GET)** `api/teacher/assigned-subjects`
- **Lihat Nama Guru (GET)** `api/teacher/name`
- **Ubah Nama Guru (PUT)** `api/teacher/user/update-name`
```json
{
  "name": "Akhfee Lauki Update"
}
```

---

## Teknologi yang Digunakan
- **Backend:** Laravel / Node.js (sesuai implementasi)
- **Database:** MySQL / PostgreSQL
- **Autentikasi:** JSON Web Token (JWT)
- **Framework API:** RESTful API

## Lisensi
Proyek ini dirilis di bawah lisensi MIT.

