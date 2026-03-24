<?php
/**
 * File: student-controller.php
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 09/03/2026
 * Last Modified: 16/03/2026
 * Description: API controller for Student operations. Handles Create, Search, Edit, Delete and GetAll.
 */
require_once __DIR__.'/../classes/Student.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
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
