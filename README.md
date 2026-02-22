# PantaiTimor

PantaiTimor - Group 1
CSEB5223 - Software Construction &amp; Methods

Consist of:-
-----------------------------------------------------------
Muhammad Zakariyya Bin Ahmad Radzif      ||  BSW01085129    
Wan Muhammad Aqilrasydan Bin Wan Arman   ||  BSW01084986   
Muhammad Faredzul Azri Bin Mohd Ruzi     ||  BSW01085016   
Muhammad Ainul Khalis bin Mod Radzi      ||  BSW01085030   
-----------------------------------------------------------

# PantaiTimor - Student Learning Management System (SLMS)

**Group 1 [PantaiTimor]** || CSEB5223 - Software Construction & Methods  
Semester 2, 2025/2026 | Universiti Tenaga Nasional (UNITEN)

---

## 📋 Project Overview

The **Student Learning Management System (SLMS)** is a web-based application inspired by [Moodle](https://github.com/moodle/moodle) that allows administrators to manage course profiles, student profiles, and course-student enrolment relationships. Built as part of CSEB5223 lab coursework.

### Tech Stack
| Component | Technology |
|-----------|-----------|
| Backend | Java (Spring Boot) |
| Frontend | HTML, CSS, JavaScript (Thymeleaf) |
| Build Tool | Maven |
| Version Control | Git & GitHub |
| Testing | JUnit 5 |

---

## 📁 Project Structure

```
PantaiTimor/
├── src/
│   ├── main/
│   │   ├── java/com/pantaitimor/slms/
│   │   │   ├── model/            # Data classes (Course, Student, Enrolment)
│   │   │   ├── controller/       # HTTP request handlers
│   │   │   ├── service/          # Business logic & validation
│   │   │   └── repository/       # Data storage & retrieval
│   │   └── resources/
│   │       ├── templates/        # HTML files (Thymeleaf)
│   │       └── static/           # CSS, JavaScript
│   └── test/
│       └── java/com/pantaitimor/slms/  # Unit tests
├── docs/                         # Lab reports & documentation
├── README.md
└── pom.xml
```

---

## 📐 Software Construction Standards

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Class | PascalCase | `CourseProfile` |
| Method | camelCase | `searchCourse()` |
| Variable | camelCase | `courseName` |
| Constant | UPPER_SNAKE_CASE | `MAX_COURSES` |
| Package | lowercase | `com.pantaitimor.slms` |
| HTML File | kebab-case | `course-profile.html` |
| CSS Class | kebab-case | `course-card` |

### Coding Standards
- **Indentation:** 4 spaces (no tabs)
- **Max Line Length:** 120 characters
- **Braces:** K&R style (opening brace on same line)
- **Encoding:** UTF-8
- **Comments:** Javadoc for all public classes and methods

### File Header Template
```java
/**
 * File: [FileName].java
 * Author: [Full Name]
 * Student ID: [Student ID]
 * Date Created: [DD/MM/YYYY]
 * Last Modified: [DD/MM/YYYY]
 * Description: [Brief description]
 */
```

### Modularity Guidelines
- **Single Responsibility:** Each method performs one task only
- **Max Method Length:** 30 lines of logic
- **Max Parameters:** 4 per method
- **Architecture:** MVC (Model-View-Controller)

---

## 🔀 Git Workflow & CI Rules

### Branch Strategy
| Branch | Purpose | Example |
|--------|---------|---------|
| `main` | Production-ready (protected) | - |
| `develop` | Integration branch | - |
| `feature/*` | New features | `feature/course-profile` |
| `bugfix/*` | Bug fixes | `bugfix/search-not-found` |
| `lab/*` | Lab submissions | `lab/lab3-course-input` |

### Commit Message Format
```
[LAB#] <type>: <short description>
```
**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`

**Examples:**
```
[LAB3] feat: Add Course class with getter and setter methods
[LAB4] fix: Resolve array out-of-bound error in course search
[LAB5] docs: Update Javadoc comments for Student class
```

### Pull Request Rules
- All changes via Pull Request to `develop` branch
- Minimum **1 reviewer** approval required
- Team leader merges to `main` branch
- PR must include: what changed, why, and how to test

---

## 🚀 How to Run

```bash
# Clone the repository
git clone https://github.com/zakdecoder/PantaiTimor.git
cd PantaiTimor

# Build and run (requires Java 17+ and Maven)
mvn spring-boot:run

# Access the application
# Open browser: http://localhost:8080
```

---

## 📄 Documentation

- [Lab2_Report_Group1

*CSEB5223 Software Construction & Methods | Semester 2, 2025/2026 | UNITEN*
