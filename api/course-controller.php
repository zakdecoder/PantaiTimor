<?php
/**
 * File: course-controller.php
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 23/02/2026
 * Last Modified: 02/03/2026
 * Description: API controller for Course operations. Handles Create, Search, Edit, Delete and GetAll.
 */
require_once __DIR__.'/../classes/Course.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
if($_SERVER['REQUEST_METHOD']==='OPTIONS'){http_response_code(200);exit;}

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
}
function getAllCourses():void{$c=loadCourses();echo json_encode(['success'=>true,'courses'=>$c,'total'=>count($c)]);}

$action=$_GET['action']??'';
switch($action){case 'create':createCourse();break;case 'search':searchCourse();break;case 'edit':editCourse();break;case 'delete':deleteCourse();break;case 'getAll':getAllCourses();break;default:echo json_encode(['success'=>false,'message'=>'Invalid action.']);}
