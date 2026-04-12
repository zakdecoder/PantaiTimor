<?php
/**
 * File: student-controller.php
<<<<<<< HEAD
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Student ID: BSW01085030
 * Date Created: 23/02/2026
 * Last Modified: 13/04/2026
 * Description: API controller for Course operations.
 *              Handles Create, Search, Edit, Delete and GetAll.
 */

require_once __DIR__ . '/../classes/Student.php';

// Set response headers for JSON API
=======
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 09/03/2026
 * Last Modified: 16/03/2026
 * Description: API controller for Student operations. Handles Create, Search, Edit, Delete and GetAll.
 */
require_once __DIR__.'/../classes/Student.php';
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
<<<<<<< HEAD

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Constants
define('STUDENT_DATA_FILE', __DIR__ . '/../data/students.json');
define('MAX_STUDENTS', 100);


// ========== DATA FUNCTIONS ==========

/**
 * Loads all students from the JSON file.
 * Returns empty array if the file doesn't exist yet.
 */
function loadStudents(): array {
    if (!file_exists(STUDENT_DATA_FILE)) {
        return [];
    }

    return json_decode(file_get_contents(STUDENT_DATA_FILE), true) ?? [];
}

/**
 * Saves the students array to JSON file.
 * Creates the data directory if needed.
 */
function saveStudents(array $students): void {
    $dir = dirname(STUDENT_DATA_FILE);

    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents(STUDENT_DATA_FILE, json_encode($students, JSON_PRETTY_PRINT));
}

/**
 * Finds the index of a student by their ID using linear search.
 * Returns -1 if not found.
 */
function findStudentIndex(array $students, string $id): int {
    for ($i = 0; $i < count($students); $i++) {
        if (strtoupper($students[$i]['student_id']) === strtoupper(trim($id))) {
            return $i;
        }
    }

    return -1;
}


// ========== CREATE ==========

/**
 * Adds a new student to the system.
 * Validates input, checks for duplicate ID, and enforces array limit.
 */
function createStudent(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    // Create student object from input
    $student = new Student(
        $input['first_name'] ?? '',
        $input['last_name'] ?? '',
        $input['student_id'] ?? '',
        $input['email'] ?? '',
        $input['phone_number'] ?? ''
    );

    // Validate the student data
    $errors = $student->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    $students = loadStudents();

    // Check if we've hit the max limit
    if (count($students) >= MAX_STUDENTS) {
        echo json_encode(['success' => false, 'message' => 'Maximum student limit reached.']);
        return;
    }

    // Make sure the student ID doesn't already exist
    if (findStudentIndex($students, $student->getStudentId()) !== -1) {
        echo json_encode(['success' => false, 'message' => 'Student ID already exists.']);
        return;
    }

    // All good — add and save
    $students[] = $student->toArray();
    saveStudents($students);

    echo json_encode([
        'success' => true,
        'message' => 'Student added successfully.',
        'student' => $student->toArray()
    ]);
}


// ========== SEARCH ==========

/**
 * Searches for a student by their ID.
 * Uses linear search through the students array.
 */
function searchStudent(): void {
    $id = $_GET['student_id'] ?? '';

    if (empty(trim($id))) {
        echo json_encode(['success' => false, 'message' => 'Please enter a student ID to search.']);
        return;
    }

    $students = loadStudents();
    $index = findStudentIndex($students, $id);

    if ($index !== -1) {
        echo json_encode([
            'success' => true,
            'message' => 'Student found.',
            'student' => $students[$index]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Student not found.']);
    }
}


// ========== EDIT ==========

/**
 * Updates an existing student's information.
 * Student ID cannot be changed — only other fields are updated.
 */
function editStudent(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        return;
    }

    $id = $input['student_id'] ?? '';

    if (empty(trim($id))) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required.']);
        return;
    }

    $students = loadStudents();
    $index = findStudentIndex($students, $id);

    // Student must exist to be edited
    if ($index === -1) {
        echo json_encode(['success' => false, 'message' => 'Student not found.']);
        return;
    }

    // Build updated student object for validation
    $student = new Student(
        $input['first_name'] ?? $students[$index]['first_name'],
        $input['last_name'] ?? $students[$index]['last_name'],
        $id,
        $input['email'] ?? $students[$index]['email'],
        $input['phone_number'] ?? $students[$index]['phone_number']
    );

    $errors = $student->validate();
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
        return;
    }

    // Update the fields (student ID stays the same)
    $students[$index]['first_name'] = $student->getFirstName();
    $students[$index]['last_name'] = $student->getLastName();
    $students[$index]['email'] = $student->getEmail();
    $students[$index]['phone_number'] = $student->getPhoneNumber();

    saveStudents($students);

    echo json_encode([
        'success' => true,
        'message' => 'Student updated successfully.',
        'student' => $students[$index]
    ]);
}


// ========== DELETE ==========

/**
 * Removes a student from the system.
 * Finds the student by ID, removes from array, and saves.
 */
function deleteStudent(): void {
    $id = $_GET['student_id'] ?? '';

    if (empty(trim($id))) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required.']);
        return;
    }

    $students = loadStudents();
    $index = findStudentIndex($students, $id);

    if ($index === -1) {
        echo json_encode(['success' => false, 'message' => 'Student not found.']);
        return;
    }

    // Keep a copy for the response message
    $deleted = $students[$index];

    // Remove from array and save
    array_splice($students, $index, 1);
    saveStudents($students);

    echo json_encode([
        'success' => true,
        'message' => 'Student "' . $deleted['student_id'] . '" deleted successfully.',
        'students' => $students,
        'total' => count($students)
    ]);
}


// ========== GET ALL ==========

/**
 * Returns all students in the system.
 */
function getAllStudents(): void {
    $students = loadStudents();

    echo json_encode([
        'success' => true,
        'students' => $students,
        'total' => count($students)
    ]);
}


// ========== ROUTING ==========

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        createStudent();
        break;
    case 'search':
        searchStudent();
        break;
    case 'edit':
        editStudent();
        break;
    case 'delete':
        deleteStudent();
        break;
    case 'getAll':
        getAllStudents();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
}
=======
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(200);exit;}

define('STUDENT_DATA_FILE',__DIR__.'/../data/students.json');
define('MAX_STUDENTS',100);

function loadStudents():array{if(!file_exists(STUDENT_DATA_FILE))return[];return json_decode(file_get_contents(STUDENT_DATA_FILE),true)??[];}
function saveStudents(array $s):void{$d=dirname(STUDENT_DATA_FILE);if(!is_dir($d))mkdir($d,0755,true);file_put_contents(STUDENT_DATA_FILE,json_encode($s,JSON_PRETTY_PRINT));}
function findStudentIndex(array $s,string $id):int{for($i=0;$i<count($s);$i++)if(strtoupper($s[$i]['student_id'])===strtoupper(trim($id)))return $i;return -1;}

function createStudent():void{
    $input=json_decode(file_get_contents('php://input'),true);
    if(!$input){echo json_encode(['success'=>false,'message'=>'Invalid input data.']);return;}
    $st=new Student($input['first_name']??'',$input['last_name']??'',$input['student_id']??'',$input['email']??'',$input['phone_number']??'');
    $errors=$st->validate();if(!empty($errors)){echo json_encode(['success'=>false,'message'=>implode(' ',$errors)]);return;}
    $students=loadStudents();
    if(count($students)>=MAX_STUDENTS){echo json_encode(['success'=>false,'message'=>'Maximum student limit reached.']);return;}
    if(findStudentIndex($students,$st->getStudentId())!==-1){echo json_encode(['success'=>false,'message'=>'Student ID already exists.']);return;}
    $students[]=$st->toArray();saveStudents($students);
    echo json_encode(['success'=>true,'message'=>'Student added successfully.','student'=>$st->toArray()]);
}
function searchStudent():void{
    $id=$_GET['student_id']??'';
    if(empty(trim($id))){echo json_encode(['success'=>false,'message'=>'Please enter a student ID to search.']);return;}
    $students=loadStudents();$i=findStudentIndex($students,$id);
    if($i!==-1)echo json_encode(['success'=>true,'message'=>'Student found.','student'=>$students[$i]]);
    else echo json_encode(['success'=>false,'message'=>'Student not found.']);
}
function editStudent():void{
    $input=json_decode(file_get_contents('php://input'),true);
    if(!$input){echo json_encode(['success'=>false,'message'=>'Invalid input data.']);return;}
    $id=$input['student_id']??'';if(empty(trim($id))){echo json_encode(['success'=>false,'message'=>'Student ID is required.']);return;}
    $students=loadStudents();$i=findStudentIndex($students,$id);
    if($i===-1){echo json_encode(['success'=>false,'message'=>'Student not found.']);return;}
    $st=new Student($input['first_name']??$students[$i]['first_name'],$input['last_name']??$students[$i]['last_name'],$id,$input['email']??$students[$i]['email'],$input['phone_number']??$students[$i]['phone_number']);
    $errors=$st->validate();if(!empty($errors)){echo json_encode(['success'=>false,'message'=>implode(' ',$errors)]);return;}
    $students[$i]['first_name']=$st->getFirstName();$students[$i]['last_name']=$st->getLastName();
    $students[$i]['email']=$st->getEmail();$students[$i]['phone_number']=$st->getPhoneNumber();
    saveStudents($students);echo json_encode(['success'=>true,'message'=>'Student updated successfully.','student'=>$students[$i]]);
}
function deleteStudent():void{
    $id=$_GET['student_id']??'';if(empty(trim($id))){echo json_encode(['success'=>false,'message'=>'Student ID is required.']);return;}
    $students=loadStudents();$i=findStudentIndex($students,$id);
    if($i===-1){echo json_encode(['success'=>false,'message'=>'Student not found.']);return;}
    $del=$students[$i];array_splice($students,$i,1);saveStudents($students);
    echo json_encode(['success'=>true,'message'=>'Student "'.$del['student_id'].'" deleted successfully.','students'=>$students,'total'=>count($students)]);
}
function getAllStudents():void{$s=loadStudents();echo json_encode(['success'=>true,'students'=>$s,'total'=>count($s)]);}

$action=$_GET['action']??'';
switch($action){case 'create':createStudent();break;case 'search':searchStudent();break;case 'edit':editStudent();break;case 'delete':deleteStudent();break;case 'getAll':getAllStudents();break;default:echo json_encode(['success'=>false,'message'=>'Invalid action.']);}
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
