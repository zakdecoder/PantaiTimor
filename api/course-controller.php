<?php
/**
 * File: course-controller.php
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Student ID: BSW01085030
 * Date Created: 23/02/2026
<<<<<<< HEAD
 * Last Modified: 13/04/2026
 * Description: API controller for Course operations.
 *              Handles Create, Search, Edit, Delete and GetAll.
 */

require_once __DIR__ . '/../classes/Course.php';

// Set response headers for JSON API
=======
 * Last Modified: 02/03/2026
 * Description: API controller for Course operations. Handles Create, Search, Edit, Delete and GetAll.
 */
require_once __DIR__.'/../classes/Course.php';
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(200);exit;}

<<<<<<< HEAD
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Constants
define('DATA_FILE', __DIR__ . '/../data/courses.json');
define('MAX_COURSES', 100);


// ========== DATA FUNCTIONS ==========

/**
 * Loads all courses from the JSON file.
 * Returns empty array if file doesn't exist yet.
 */
function loadCourses(): array {
    if (!file_exists(DATA_FILE)) {
        return [];
    }

    $json = file_get_contents(DATA_FILE);
    return json_decode($json, true) ?? [];
}

/**
 * Saves the courses array to JSON file.
 * Creates the data directory if it doesn't exist.
 */
function saveCourses(array $courses): void {
    $dir = dirname(DATA_FILE);

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents(DATA_FILE, json_encode($courses, JSON_PRETTY_PRINT));
}

/**
 * Finds the index of a course by its code using linear search.
 * Returns -1 if not found.
 */
function findCourseIndex(array $courses, string $code): int {
    for ($i = 0; $i < count($courses); $i++) {
        if (strtoupper($courses[$i]['course_code']) === strtoupper(trim($code))) {
            return $i;
        }
    }

    return -1;
}


// ========== CREATE ==========

/**
 * Adds a new course to the system.
 * Validates input, checks for duplicates, and enforces array limit.
 */
function createCourse(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    // Create course object from input
    $course = new Course(
        $input['course_name'] ?? '',
        $input['course_code'] ?? '',
        (int)($input['credit_hour'] ?? 0),
        $input['course_summary'] ?? '',
        $input['ms_teams_link'] ?? ''
    );

    // Validate the course data
    $errors = $course->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    $courses = loadCourses();

    // Check if we've hit the max limit
    if (count($courses) >= MAX_COURSES) {
        echo json_encode(['success' => false, 'message' => 'Maximum course limit reached.']);
        return;
    }

    // Make sure the course code doesn't already exist
    if (findCourseIndex($courses, $course->getCourseCode()) !== -1) {
        echo json_encode(['success' => false, 'message' => 'Course code already exists.']);
        return;
    }

    // All good — add and save
    $courses[] = $course->toArray();
    saveCourses($courses);

    echo json_encode([
        'success' => true,
        'message' => 'Course added successfully.',
        'course' => $course->toArray()
    ]);
=======
define('DATA_FILE',__DIR__.'/../data/courses.json');
define('MAX_COURSES',100);

function loadCourses():array{if(!file_exists(DATA_FILE))return[];return json_decode(file_get_contents(DATA_FILE),true)??[];}
function saveCourses(array $c):void{$d=dirname(DATA_FILE);if(!is_dir($d))mkdir($d,0755,true);file_put_contents(DATA_FILE,json_encode($c,JSON_PRETTY_PRINT));}
function findCourseIndex(array $c,string $code):int{for($i=0;$i<count($c);$i++)if(strtoupper($c[$i]['course_code'])===strtoupper(trim($code)))return $i;return -1;}

function createCourse():void{
    $input=json_decode(file_get_contents('php://input'),true);
    if(!$input){echo json_encode(['success'=>false,'message'=>'Invalid input data.']);return;}
    $course=new Course($input['course_name']??'',$input['course_code']??'',(int)($input['credit_hour']??0),$input['course_summary']??'',$input['ms_teams_link']??'');
    $errors=$course->validate();
    if(!empty($errors)){echo json_encode(['success'=>false,'message'=>implode(' ',$errors)]);return;}
    $courses=loadCourses();
    if(count($courses)>=MAX_COURSES){echo json_encode(['success'=>false,'message'=>'Maximum course limit reached.']);return;}
    if(findCourseIndex($courses,$course->getCourseCode())!==-1){echo json_encode(['success'=>false,'message'=>'Course code already exists.']);return;}
    $courses[]=$course->toArray();saveCourses($courses);
    echo json_encode(['success'=>true,'message'=>'Course added successfully.','course'=>$course->toArray()]);
}
function searchCourse():void{
    $code=$_GET['course_code']??'';
    if(empty(trim($code))){echo json_encode(['success'=>false,'message'=>'Please enter a course code to search.']);return;}
    $courses=loadCourses();$i=findCourseIndex($courses,$code);
    if($i!==-1)echo json_encode(['success'=>true,'message'=>'Course found.','course'=>$courses[$i]]);
    else echo json_encode(['success'=>false,'message'=>'Course not found.']);
}
function editCourse():void{
    $input=json_decode(file_get_contents('php://input'),true);
    if(!$input){echo json_encode(['success'=>false,'message'=>'Invalid input data.']);return;}
    $code=$input['course_code']??'';
    if(empty(trim($code))){echo json_encode(['success'=>false,'message'=>'Course code is required.']);return;}
    $courses=loadCourses();$i=findCourseIndex($courses,$code);
    if($i===-1){echo json_encode(['success'=>false,'message'=>'Course not found.']);return;}
    $course=new Course($input['course_name']??$courses[$i]['course_name'],$code,(int)($input['credit_hour']??$courses[$i]['credit_hour']),$input['course_summary']??$courses[$i]['course_summary'],$input['ms_teams_link']??$courses[$i]['ms_teams_link']);
    $errors=$course->validate();
    if(!empty($errors)){echo json_encode(['success'=>false,'message'=>implode(' ',$errors)]);return;}
    $courses[$i]['course_name']=$course->getCourseName();$courses[$i]['credit_hour']=$course->getCreditHour();
    $courses[$i]['course_summary']=$course->getCourseSummary();$courses[$i]['ms_teams_link']=$course->getMsTeamsLink();
    saveCourses($courses);echo json_encode(['success'=>true,'message'=>'Course updated successfully.','course'=>$courses[$i]]);
}
function deleteCourse():void{
    $code=$_GET['course_code']??'';
    if(empty(trim($code))){echo json_encode(['success'=>false,'message'=>'Course code is required.']);return;}
    $courses=loadCourses();$i=findCourseIndex($courses,$code);
    if($i===-1){echo json_encode(['success'=>false,'message'=>'Course not found.']);return;}
    $del=$courses[$i];array_splice($courses,$i,1);saveCourses($courses);
    echo json_encode(['success'=>true,'message'=>'Course "'.$del['course_code'].'" deleted successfully.','courses'=>$courses,'total'=>count($courses)]);
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
}
function getAllCourses():void{$c=loadCourses();echo json_encode(['success'=>true,'courses'=>$c,'total'=>count($c)]);}

<<<<<<< HEAD

// ========== SEARCH ==========

/**
 * Searches for a course by its code.
 * Uses linear search through the courses array.
 */
function searchCourse(): void {
    $code = $_GET['course_code'] ?? '';

    if (empty(trim($code))) {
        echo json_encode(['success' => false, 'message' => 'Please enter a course code to search.']);
        return;
    }

    $courses = loadCourses();
    $index = findCourseIndex($courses, $code);

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


// ========== EDIT ==========

/**
 * Updates an existing course.
 * Course code cannot be changed — only other fields are updated.
 */
function editCourse(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    $code = $input['course_code'] ?? '';

    if (empty(trim($code))) {
        echo json_encode(['success' => false, 'message' => 'Course code is required.']);
        return;
    }

    $courses = loadCourses();
    $index = findCourseIndex($courses, $code);

    // Course must exist to be edited
    if ($index === -1) {
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
        return;
    }

    // Build updated course object for validation
    $course = new Course(
        $input['course_name'] ?? $courses[$index]['course_name'],
        $code,
        (int)($input['credit_hour'] ?? $courses[$index]['credit_hour']),
        $input['course_summary'] ?? $courses[$index]['course_summary'],
        $input['ms_teams_link'] ?? $courses[$index]['ms_teams_link']
    );

    $errors = $course->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    // Update the fields (course code stays the same)
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


// ========== DELETE ==========

/**
 * Deletes a course from the system.
 * Removes it from the array and saves.
 */
function deleteCourse(): void {
    $code = $_GET['course_code'] ?? '';

    if (empty(trim($code))) {
        echo json_encode(['success' => false, 'message' => 'Course code is required.']);
        return;
    }

    $courses = loadCourses();
    $index = findCourseIndex($courses, $code);

    if ($index === -1) {
        echo json_encode(['success' => false, 'message' => 'Course not found.']);
        return;
    }

    // Keep a copy for the response message
    $deleted = $courses[$index];

    // Remove from array and save
    array_splice($courses, $index, 1);
    saveCourses($courses);

    echo json_encode([
        'success' => true,
        'message' => 'Course "' . $deleted['course_code'] . '" deleted successfully.',
        'courses' => $courses,
        'total' => count($courses)
    ]);
}


// ========== GET ALL ==========

/**
 * Returns all courses in the system.
 */
function getAllCourses(): void {
    $courses = loadCourses();

    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'total' => count($courses)
    ]);
}


// ========== ROUTING ==========

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
}
=======
$action=$_GET['action']??'';
switch($action){case 'create':createCourse();break;case 'search':searchCourse();break;case 'edit':editCourse();break;case 'delete':deleteCourse();break;case 'getAll':getAllCourses();break;default:echo json_encode(['success'=>false,'message'=>'Invalid action.']);}
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
