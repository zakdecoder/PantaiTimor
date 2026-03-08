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

### Requirements
- [XAMPP](https://www.apachefriends.org/) (includes Apache + PHP)

### Steps

1. **Download and install XAMPP**

2. **Clone this repo into the htdocs folder**
   ```bash
   # Windows
   cd C:/xampp/htdocs
   git clone https://github.com/zakdecoder/PantaiTimor.git

   # Mac
   cd /Applications/XAMPP/htdocs
   git clone https://github.com/zakdecoder/PantaiTimor.git
   ```

3. **Start Apache** in XAMPP Control Panel

4. **Open your browser** and go to:
   ```
   http://localhost/PantaiTimor/
   ```

5. **Navigate to Course Profile** to start adding and searching courses

### Quick Test
- Click **Courses** in the navigation bar
- Fill in the form and click **Submit** to add a course
- Enter a course code in the search bar and click **Search**

---

## Project Structure

```
PantaiTimor/
├── index.html              # Homepage
├── pages/
│   ├── course-profile.html # Course management (add, search, view)
│   ├── student-profile.html# (Coming in Lab 5-6)
│   └── enrolment.html      # (Coming in Lab 7-8)
├── assets/
│   ├── css/style.css       # Stylesheet
│   └── js/
│       └── course-handler.js # Course JS logic
├── api/
│   └── course-controller.php # Course API (create, search, getAll)
├── classes/
│   └── Course.php          # Course class
├── data/                   # JSON data storage
├── docs/                   # Lab reports
└── README.md
```

---

## Features (Current)
### Lab 2 - Planning Phase
- **Use Case** -

### Lab 3 - Course Profile (Create & Search)
- **Course Class** — PHP class with getter/setter, validation, toArray()
- **Add Course** — Form with validation, duplicate check, array boundary check
- **Search Course** — Linear search by course code, displays full course details
- **View All Courses** — Table showing all added courses


## Lab Progress

| Lab | Topic | Status |
|-----|-------|--------|
| 1 | Setup & Repository | ✅ Done |
| 2 | Pre-set Software Construction | ✅ Done |
| 3 | Course Profile (Class, Create, Search) | ✅ Done |
| 4 | Course Profile (Edit, Delete, View All) | ⬜ In Progress |
| 5-6 | Student Profile (CRUD) | ⬜ Pending |
| 7-8 | Course-Student Relationship | ⬜ Pending |
| 9 | System Tests | ⬜ Pending |
| 10 | Final Documentation | ⬜ Pending |
| 11 | Group Interview | ⬜ Pending |
