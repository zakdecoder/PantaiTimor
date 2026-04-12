<?php
/**
 * File: enrolment-controller.php
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Student ID: BSW01085030
 * Date Created: 23/02/2026
 * Last Modified: 13/04/2026
 * Description: API controller for Course operations.
 *              Handles Create, Search, Edit, Delete and GetAll.
 */

require_once __DIR__ . '/../classes/Course.php';
require_once __DIR__ . '/../classes/Student.php';

// Set response headers for JSON API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// File paths for data storage
define('ENROL_FILE', __DIR__ . '/../data/enrolments.json');
define('COURSE_FILE', __DIR__ . '/../data/courses.json');
define('STUDENT_FILE', __DIR__ . '/../data/students.json');


// ========== DATA HELPER FUNCTIONS ==========

/**
 * Loads data from a JSON file.
 * Returns an empty array if the file doesn't exist yet.
 */
function loadData(string $file): array {
    if (!file_exists($file)) {
        return [];
    }

    return json_decode(file_get_contents($file), true) ?? [];
}

/**
 * Saves data to a JSON file.
 * Creates the directory if it doesn't exist.
 * Uses array_values() to make sure the JSON stays as a clean array.
 */
function saveData(string $file, array $data): void {
    $dir = dirname($file);

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents($file, json_encode(array_values($data), JSON_PRETTY_PRINT));
}


// ========== LOOKUP FUNCTIONS ==========

/**
 * Finds a course by its code.
 * Returns the course array if found, null otherwise.
 */
function findCourse(string $code): ?array {
    $courses = loadData(COURSE_FILE);

    foreach ($courses as $course) {
        if (strtoupper($course['course_code']) === strtoupper(trim($code))) {
            return $course;
        }
    }

    return null;
}

/**
 * Finds a student by their ID.
 * Returns the student array if found, null otherwise.
 */
function findStudent(string $id): ?array {
    $students = loadData(STUDENT_FILE);

    foreach ($students as $student) {
        if (strtoupper($student['student_id']) === strtoupper(trim($id))) {
            return $student;
        }
    }

    return null;
}


// ========== ENROL STUDENT ==========

/**
 * Enrols a student into a course.
 * Before enrolling, we check that both the course and student
 * exist in the system, and that the student isn't already enrolled.
 */
function enrolStudent(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    $courseCode = trim($input['course_code'] ?? '');
    $studentId = trim($input['student_id'] ?? '');

    // Both fields are required
    if (empty($courseCode) || empty($studentId)) {
        echo json_encode(['success' => false, 'message' => 'Both course code and student ID are required.']);
        return;
    }

    // Make sure the course actually exists
    $course = findCourse($courseCode);
    if (!$course) {
        echo json_encode(['success' => false, 'message' => 'Course not found in the system.']);
        return;
    }

    // Make sure the student actually exists
    $student = findStudent($studentId);
    if (!$student) {
        echo json_encode(['success' => false, 'message' => 'Student not found in the system.']);
        return;
    }

    // Check if this enrolment already exists (prevent duplicates)
    $enrolments = loadData(ENROL_FILE);

    foreach ($enrolments as $enrolment) {
        if (strtoupper($enrolment['course_code']) === strtoupper($courseCode) &&
            strtoupper($enrolment['student_id']) === strtoupper($studentId)) {
            echo json_encode(['success' => false, 'message' => 'Student is already enrolled in this course.']);
            return;
        }
    }

    // Everything checks out — create the enrolment record
    $studentName = $student['first_name'] . ' ' . $student['last_name'];

    $enrolments[] = [
        'course_code' => $course['course_code'],
        'student_id' => $student['student_id'],
        'enrol_date' => date('Y-m-d')
    ];

    saveData(ENROL_FILE, $enrolments);

    echo json_encode([
        'success' => true,
        'message' => 'Student "' . $studentName . '" enrolled in "' . $course['course_name'] . '" successfully.'
    ]);
}


// ========== LIST COURSES BY STUDENT ==========

/**
 * Lists all courses that a specific student is enrolled in.
 * We look through the enrolments and pull the full course details for each match.
 */
function listCoursesByStudent(): void {
    $studentId = trim($_GET['student_id'] ?? '');

    if (empty($studentId)) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required.']);
        return;
    }

    // Verify the student exists first
    $student = findStudent($studentId);
    if (!$student) {
        echo json_encode(['success' => false, 'message' => 'Student not found in the system.']);
        return;
    }

    // Go through enrolments and collect matching courses
    $enrolments = loadData(ENROL_FILE);
    $courses = [];

    foreach ($enrolments as $enrolment) {
        if (strtoupper($enrolment['student_id']) === strtoupper($studentId)) {
            $course = findCourse($enrolment['course_code']);
            if ($course) {
                $courses[] = $course;
            }
        }
    }

    $studentName = $student['first_name'] . ' ' . $student['last_name'];

    // Return appropriate response based on whether we found anything
    if (empty($courses)) {
        echo json_encode([
            'success' => true,
            'message' => 'Student has no enrolled courses.',
            'student_name' => $studentName,
            'courses' => [],
            'total' => 0
        ]);
        return;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Courses found.',
        'student_name' => $studentName,
        'courses' => $courses,
        'total' => count($courses)
    ]);
}


// ========== LIST STUDENTS BY COURSE ==========

/**
 * Lists all students enrolled in a specific course.
 * Similar to listCoursesByStudent but the other way around.
 */
function listStudentsByCourse(): void {
    $courseCode = trim($_GET['course_code'] ?? '');

    if (empty($courseCode)) {
        echo json_encode(['success' => false, 'message' => 'Course code is required.']);
        return;
    }

    // Verify the course exists first
    $course = findCourse($courseCode);
    if (!$course) {
        echo json_encode(['success' => false, 'message' => 'Course not found in the system.']);
        return;
    }

    // Go through enrolments and collect matching students
    $enrolments = loadData(ENROL_FILE);
    $students = [];

    foreach ($enrolments as $enrolment) {
        if (strtoupper($enrolment['course_code']) === strtoupper($courseCode)) {
            $student = findStudent($enrolment['student_id']);
            if ($student) {
                $students[] = $student;
            }
        }
    }

    if (empty($students)) {
        echo json_encode([
            'success' => true,
            'message' => 'Course has no enrolled students.',
            'course_name' => $course['course_name'],
            'students' => [],
            'total' => 0
        ]);
        return;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Students found.',
        'course_name' => $course['course_name'],
        'students' => $students,
        'total' => count($students)
    ]);
}


// ========== REMOVE ENROLMENT ==========

/**
 * Removes an enrolment record (unenrols a student from a course).
 * Searches through the enrolments array for a matching pair.
 */
function removeEnrolment(): void {
    $courseCode = trim($_GET['course_code'] ?? '');
    $studentId = trim($_GET['student_id'] ?? '');

    if (empty($courseCode) || empty($studentId)) {
        echo json_encode(['success' => false, 'message' => 'Both course code and student ID are required.']);
        return;
    }

    $enrolments = loadData(ENROL_FILE);

    // Find and remove the matching enrolment
    for ($i = 0; $i < count($enrolments); $i++) {
        if (strtoupper($enrolments[$i]['course_code']) === strtoupper($courseCode) &&
            strtoupper($enrolments[$i]['student_id']) === strtoupper($studentId)) {

            array_splice($enrolments, $i, 1);
            saveData(ENROL_FILE, $enrolments);

            echo json_encode(['success' => true, 'message' => 'Enrolment removed successfully.']);
            return;
        }
    }

    // If we get here, the enrolment wasn't found
    echo json_encode(['success' => false, 'message' => 'Enrolment not found.']);
}


// ========== GET ALL ENROLMENTS ==========

/**
 * Returns all enrolment records with full course and student names.
 * We look up the names from the source files since the enrolment
 * records only store the codes/IDs.
 */
function getAllEnrolments(): void {
    $enrolments = loadData(ENROL_FILE);
    $result = [];

    foreach ($enrolments as $enrolment) {
        $courseName = '';
        $studentName = '';

        // Look up the course name
        $course = findCourse($enrolment['course_code']);
        if ($course) {
            $courseName = $course['course_name'];
        }

        // Look up the student name
        $student = findStudent($enrolment['student_id']);
        if ($student) {
            $studentName = $student['first_name'] . ' ' . $student['last_name'];
        }

        $result[] = [
            'course_code' => $enrolment['course_code'],
            'course_name' => $courseName,
            'student_id' => $enrolment['student_id'],
            'student_name' => $studentName,
            'enrol_date' => $enrolment['enrol_date']
        ];
    }

    echo json_encode([
        'success' => true,
        'enrolments' => $result,
        'total' => count($result)
    ]);
}


// ========== AUTO-SUGGESTION ==========

/**
 * Returns all courses for the auto-suggestion dropdown.
 * This gets loaded once when the page opens so users can
 * type and see matching courses as they fill in the form.
 */
function suggestCourses(): void {
    $courses = loadData(COURSE_FILE);

    echo json_encode([
        'success' => true,
        'suggestions' => $courses
    ]);
}

/**
 * Returns all students for the auto-suggestion dropdown.
 * Same idea as suggestCourses but for students.
 */
function suggestStudents(): void {
    $students = loadData(STUDENT_FILE);

    echo json_encode([
        'success' => true,
        'suggestions' => $students
    ]);
}


// ========== ROUTING ==========

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'enrol':
        enrolStudent();
        break;
    case 'listCourses':
        listCoursesByStudent();
        break;
    case 'listStudents':
        listStudentsByCourse();
        break;
    case 'remove':
        removeEnrolment();
        break;
    case 'getAll':
        getAllEnrolments();
        break;
    case 'suggestCourses':
        suggestCourses();
        break;
    case 'suggestStudents':
        suggestStudents();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}