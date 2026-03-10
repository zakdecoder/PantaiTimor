<?php
/**
 * File: course-controller.php
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 23/02/2026
 * Last Modified: 02/03/2026
 * Description: API controller for Course operations.
 *              Handles Create, Search, Edit, Delete and GetAll.
 *              Data is stored in a JSON file to persist between requests.
 */

require_once __DIR__ . '/../classes/Course.php';

// Allow cross-origin requests for frontend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
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
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(DATA_FILE, json_encode($courses, JSON_PRETTY_PRINT));
}

/**
 * Finds the index of a course by course code using linear search.
 * @param array $courses The array of courses to search.
 * @param string $courseCode The course code to find.
 * @return int The index if found, -1 otherwise.
 */
function findCourseIndex(array $courses, string $courseCode): int {
    for ($i = 0; $i < count($courses); $i++) {
        if (strtoupper($courses[$i]['course_code']) === strtoupper(trim($courseCode))) {
            return $i;
        }
    }
    return -1;
}

/**
 * Handles adding a new course.
 * Validates input and checks for duplicate course code.
 */
function createCourse(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    $course = new Course(
        $input['course_name'] ?? '',
        $input['course_code'] ?? '',
        (int)($input['credit_hour'] ?? 0),
        $input['course_summary'] ?? '',
        $input['ms_teams_link'] ?? ''
    );

    $errors = $course->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    $courses = loadCourses();

    // Check array bounds to prevent overflow
    if (count($courses) >= MAX_COURSES) {
        echo json_encode(['success' => false, 'message' => 'Maximum course limit reached (' . MAX_COURSES . ').']);
        return;
    }

    // Check for duplicate course code
    if (findCourseIndex($courses, $course->getCourseCode()) !== -1) {
        echo json_encode(['success' => false, 'message' => 'Course code already exists.']);
        return;
    }

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
    $index = findCourseIndex($courses, $courseCode);

    if ($index !== -1) {
        echo json_encode([
            'success' => true,
            'message' => 'Course found.',
            'course' => $courses[$index]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
    }
}

/**
 * Handles editing a course.
 * Searches by course code, then updates all attributes except course code.
 */
function editCourse(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    $courseCode = $input['course_code'] ?? '';
    if (empty(trim($courseCode))) {
        echo json_encode(['success' => false, 'message' => 'Course code is required.']);
        return;
    }

    $courses = loadCourses();
    $index = findCourseIndex($courses, $courseCode);

    if ($index === -1) {
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
        return;
    }

    // Create Course object with updated data for validation
    $course = new Course(
        $input['course_name'] ?? $courses[$index]['course_name'],
        $courseCode,
        (int)($input['credit_hour'] ?? $courses[$index]['credit_hour']),
        $input['course_summary'] ?? $courses[$index]['course_summary'],
        $input['ms_teams_link'] ?? $courses[$index]['ms_teams_link']
    );

    $errors = $course->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    // Update all attributes except course code
    $courses[$index]['course_name'] = $course->getCourseName();
    $courses[$index]['credit_hour'] = $course->getCreditHour();
    $courses[$index]['course_summary'] = $course->getCourseSummary();
    $courses[$index]['ms_teams_link'] = $course->getMsTeamsLink();

    saveCourses($courses);

    echo json_encode([
        'success' => true,
        'message' => 'Course updated successfully.',
        'course' => $courses[$index]
    ]);
}

/**
 * Handles deleting a course.
 * Searches by course code, confirms and removes from array.
 */
function deleteCourse(): void {
    $courseCode = $_GET['course_code'] ?? '';

    if (empty(trim($courseCode))) {
        echo json_encode(['success' => false, 'message' => 'Course code is required.']);
        return;
    }

    $courses = loadCourses();
    $index = findCourseIndex($courses, $courseCode);

    if ($index === -1) {
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
        return;
    }

    // Store deleted course info for response
    $deletedCourse = $courses[$index];

    // Remove course from array
    array_splice($courses, $index, 1);
    saveCourses($courses);

    echo json_encode([
        'success' => true,
        'message' => 'Course "' . $deletedCourse['course_code'] . '" deleted successfully.',
        'courses' => $courses,
        'total' => count($courses)
    ]);
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
    case 'edit':
        editCourse();
        break;
    case 'delete':
        deleteCourse();
        break;
    case 'getAll':
        getAllCourses();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        break;
}
