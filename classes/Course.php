<?php
/**
 * File: Course.php
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Student ID: BSW01085129
 * Date Created: 23/02/2026
 * Last Modified: 02/03/2026
 * Description: Course class definition with getter/setter methods,
 *              validation, and data conversion for the SLMS.
 */
class Course {
    private string $courseName;
    private string $courseCode;
    private int $creditHour;
    private string $courseSummary;
    private string $msTeamsLink;

    public function __construct(string $courseName="",string $courseCode="",int $creditHour=0,string $courseSummary="",string $msTeamsLink="") {
        $this->courseName=$courseName;$this->courseCode=$courseCode;$this->creditHour=$creditHour;$this->courseSummary=$courseSummary;$this->msTeamsLink=$msTeamsLink;
    }
    public function getCourseName():string{return $this->courseName;}
    public function getCourseCode():string{return $this->courseCode;}
    public function getCreditHour():int{return $this->creditHour;}
    public function getCourseSummary():string{return $this->courseSummary;}
    public function getMsTeamsLink():string{return $this->msTeamsLink;}
    public function setCourseName(string $v):void{$this->courseName=$v;}
    public function setCourseCode(string $v):void{$this->courseCode=$v;}
    public function setCreditHour(int $v):void{$this->creditHour=$v;}
    public function setCourseSummary(string $v):void{$this->courseSummary=$v;}
    public function setMsTeamsLink(string $v):void{$this->msTeamsLink=$v;}

    public function toArray():array{
        return ['course_name'=>$this->courseName,'course_code'=>$this->courseCode,'credit_hour'=>$this->creditHour,'course_summary'=>$this->courseSummary,'ms_teams_link'=>$this->msTeamsLink];
    }
    public function validate():array{
        $e=[];
        if(empty(trim($this->courseName)))$e[]="Course name is required.";
        if(empty(trim($this->courseCode)))$e[]="Course code is required.";
        if($this->creditHour<1||$this->creditHour>6)$e[]="Credit hour must be between 1 and 6.";
        if(empty(trim($this->courseSummary)))$e[]="Course summary is required.";
        return $e;
    }
}
