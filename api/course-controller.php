<?php
/**
 * File: course-controller.php
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 23/02/2026
 * Last Modified: 23/02/2026
 * Description: API controller for Course operations.
 *              Handles Create and Search functionality.
 *              Data is stored in a JSON file to persist between requests.
 */

require_once __DIR__ . '/../classes/Course.php';

// Allow cross-origin requests for frontend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Path to store course data
define('DATA_FILE', __DIR__ . '/../data/courses.json');
define('MAX_COURSES', 100);

/**
 * Loads all courses from the JSON data file.
 * @return array Array of course data.
 */
function loadCourses(): array {
    if (!file_exists(DATA_FILE)) {
        return [];
    }
    $json = file_get_contents(DATA_FILE);
    return json_decode($json, true) ?? [];
}

/**
 * Saves all courses to the JSON data file.
 * @param array $courses Array of course data to save.
 */
function saveCourses(array $courses): void {
    // Create data directory if it doesn't exist
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(DATA_FILE, json_encode($courses, JSON_PRETTY_PRINT));
}

/**
 * Handles adding a new course.
 * Validates input and checks for duplicate course code.
 */
function createCourse(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate that input exists
    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    // Create Course object and set attributes
    $course = new Course(
        $input['course_name'] ?? '',
        $input['course_code'] ?? '',
        (int)($input['credit_hour'] ?? 0),
        $input['course_summary'] ?? '',
        $input['ms_teams_link'] ?? ''
    );

    // Validate course data
    $errors = $course->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    // Load existing courses
    $courses = loadCourses();

    // Check array bounds to prevent overflow
    if (count($courses) >= MAX_COURSES) {
        echo json_encode(['success' => false, 'message' => 'Maximum course limit reached (' . MAX_COURSES . ').']);
        return;
    }

    // Check for duplicate course code
    foreach ($courses as $existing) {
        if (strtoupper($existing['course_code']) === strtoupper($course->getCourseCode())) {
            echo json_encode(['success' => false, 'message' => 'Course code already exists.']);
            return;
        }
    }

    // Add course to array and save
    $courses[] = $course->toArray();
    saveCourses($courses);

    echo json_encode([
        'success' => true,
        'message' => 'Course added successfully.',
        'course' => $course->toArray()
    ]);
}

/**
 * Handles searching for a course by course code.
 * Uses linear search to find the matching course.
 */
function searchCourse(): void {
    $courseCode = $_GET['course_code'] ?? '';

    if (empty(trim($courseCode))) {
        echo json_encode(['success' => false, 'message' => 'Please enter a course code to search.']);
        return;
    }

    $courses = loadCourses();

    // Linear search through the array
    foreach ($courses as $course) {
        if (strtoupper($course['course_code']) === strtoupper(trim($courseCode))) {
            echo json_encode([
                'success' => true,
                'message' => 'Course found.',
                'course' => $course
            ]);
            return;
        }
    }

    // Course not found
    echo json_encode(['success' => false, 'message' => 'Course not found.']);
}

/**
 * Returns all stored courses.
 */
function getAllCourses(): void {
    $courses = loadCourses();
    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'total' => count($courses)
    ]);
}

// ========== ROUTE REQUESTS ==========
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        createCourse();
        break;
    case 'search':
        searchCourse();
        break;
    case 'getAll':
        getAllCourses();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        break;
}
