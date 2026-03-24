<?php
/**
 * File: Student.php
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 09/03/2026
 * Last Modified: 16/03/2026
 * Description: Student class definition with getter/setter methods,
 *              validation, and data conversion for the SLMS.
 */
class Student {
    private string $firstName;
    private string $lastName;
    private string $studentId;
    private string $email;
    private string $phoneNumber;

    public function __construct(string $firstName="",string $lastName="",string $studentId="",string $email="",string $phoneNumber="") {
        $this->firstName=$firstName;$this->lastName=$lastName;$this->studentId=$studentId;$this->email=$email;$this->phoneNumber=$phoneNumber;
    }
    public function getFirstName():string{return $this->firstName;}
    public function getLastName():string{return $this->lastName;}
    public function getStudentId():string{return $this->studentId;}
    public function getEmail():string{return $this->email;}
    public function getPhoneNumber():string{return $this->phoneNumber;}
    public function setFirstName(string $v):void{$this->firstName=$v;}
    public function setLastName(string $v):void{$this->lastName=$v;}
    public function setStudentId(string $v):void{$this->studentId=$v;}
    public function setEmail(string $v):void{$this->email=$v;}
    public function setPhoneNumber(string $v):void{$this->phoneNumber=$v;}

    public function toArray():array{
        return ['first_name'=>$this->firstName,'last_name'=>$this->lastName,'student_id'=>$this->studentId,'email'=>$this->email,'phone_number'=>$this->phoneNumber];
    }
    public function validate():array{
        $e=[];
        if(empty(trim($this->firstName)))$e[]="First name is required.";
        if(empty(trim($this->lastName)))$e[]="Last name is required.";
        if(empty(trim($this->studentId)))$e[]="Student ID is required.";
        if(empty(trim($this->email)))$e[]="Email is required.";
        elseif(!filter_var($this->email,FILTER_VALIDATE_EMAIL))$e[]="Invalid email format.";
        if(empty(trim($this->phoneNumber)))$e[]="Phone number is required.";
        return $e;
    }
}
