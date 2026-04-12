<?php
/**
 * File: Enrolment.php
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Student ID: BSW01085129
 * Date Created: 30/03/2026
 * Last Modified: 06/04/2026
 * Description: Enrolment class to manage Course-Student relationships.
 */
class Enrolment {
    private string $courseCode;
    private string $studentId;
    private string $enrolDate;

    public function __construct(string $courseCode="",string $studentId="",string $enrolDate="") {
        $this->courseCode=$courseCode;$this->studentId=$studentId;$this->enrolDate=$enrolDate?:date('Y-m-d');
    }
    public function getCourseCode():string{return $this->courseCode;}
    public function getStudentId():string{return $this->studentId;}
    public function getEnrolDate():string{return $this->enrolDate;}
    public function setCourseCode(string $v):void{$this->courseCode=$v;}
    public function setStudentId(string $v):void{$this->studentId=$v;}
    public function setEnrolDate(string $v):void{$this->enrolDate=$v;}
    public function toArray():array{return ['course_code'=>$this->courseCode,'student_id'=>$this->studentId,'enrol_date'=>$this->enrolDate];}
    public function validate():array{$e=[];if(empty(trim($this->courseCode)))$e[]="Course code is required.";if(empty(trim($this->studentId)))$e[]="Student ID is required.";return $e;}
}
