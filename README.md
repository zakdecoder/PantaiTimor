# PantaiTimor - Student Learning Management System (SLMS)

**Group 1 [PantaiTimor]** | CSEB5223 - Software Construction & Methods  
Semester 2, 2025/2026 | UNITEN

---

## What is this?

A simple web-based system to manage **courses** and **students**. Admins can add, search, edit, and delete course/student profiles, and enrol students into courses.

**Built with:** HTML, CSS, JavaScript, PHP

---

## Team

| Name | Student ID |
|------|-----------|
| Muhammad Zakariyya Bin Ahmad Radzif (Leader) | BSW01085129 |
| Wan Muhammad Aqilrasydan Bin Wan Arman | BSW01084986 |
| Muhammad Faredzul Azri Bin Mohd Ruzi | BSW01085016 |
| Muhammad Ainul Khalis bin Mod Radzi | BSW01085030 |

**Lecturer:** [Dr. Yim Ling Loo](https://github.com/YimLingLoo)

---

## How to Run

1. Install [XAMPP](https://www.apachefriends.org/)
2. Clone this repo into your `htdocs` folder
   ```bash
   cd /Applications/XAMPP/htdocs
   git clone https://github.com/zakdecoder/PantaiTimor.git
   ```
3. Set data folder permission
   ```bash
   mkdir -p /Applications/XAMPP/htdocs/PantaiTimor/data
   chmod 777 /Applications/XAMPP/htdocs/PantaiTimor/data
   ```
4. Start Apache in XAMPP
5. Open `http://localhost/PantaiTimor/` in your browser

---

## Project Structure

```
PantaiTimor/
├── index.html                # Homepage
├── pages/
│   ├── course-profile.html   # Course CRUD
│   ├── student-profile.html  # Student CRUD
│   └── enrolment.html        # Coming soon
├── assets/
│   ├── css/style.css         # Stylesheet
│   └── js/
│       ├── course-handler.js # Course JS
│       └── student-handler.js# Student JS
├── api/
│   ├── course-controller.php # Course API
│   └── student-controller.php# Student API
├── classes/
│   ├── Course.php            # Course class
│   └── Student.php           # Student class
├── data/                     # JSON storage
├── docs/                     # Reports
└── README.md
```

---

## Lab Progress

| Lab | Topic | Status |
|-----|-------|--------|
| 1 | Setup & Repository | ✅ Done |
| 2 | Pre-set Software Construction | ✅ Done |
| 3 | Course Profile (Class, Create, Search) | ✅ Done |
| 4 | Course Profile (Edit, Delete, View All) | ✅ Done |
| 5 | Student Profile (Class, Create, Search, Edit) | ✅ Done |
| 6 | Student Profile (Delete, View All, Integration) | ✅ Done |
| 7-8 | Course-Student Relationship | ⬜ Pending |
| 9 | System Tests | ⬜ Pending |
| 10 | Final Documentation | ⬜ Pending |
| 11 | Group Interview | ⬜ Pending |
