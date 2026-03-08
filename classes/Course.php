<?php
/**
 * File: Course.php
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Student ID: BSW01085129
 * Date Created: 23/02/2026
 * Last Modified: 23/02/2026
 * Description: Course class definition with getter/setter methods,
 *              validation, and data conversion for the SLMS.
 */

class Course {
    private string $courseName;
    private string $courseCode;
    private int $creditHour;
    private string $courseSummary;
    private string $msTeamsLink;

    /**
     * Constructor to initialize a Course object.
     * @param string $courseName Full name of the course.
     * @param string $courseCode Unique course identifier.
     * @param int $creditHour Number of credit hours.
     * @param string $courseSummary Brief course description.
     * @param string $msTeamsLink MS Teams meeting link.
     */
    public function __construct(
        string $courseName = "",
        string $courseCode = "",
        int $creditHour = 0,
        string $courseSummary = "",
        string $msTeamsLink = ""
    ) {
        $this->courseName = $courseName;
        $this->courseCode = $courseCode;
        $this->creditHour = $creditHour;
        $this->courseSummary = $courseSummary;
        $this->msTeamsLink = $msTeamsLink;
    }

    // ========== GETTER METHODS ==========

    /**
     * Gets the course name.
     * @return string The course name.
     */
    public function getCourseName(): string {
        return $this->courseName;
    }

    /**
     * Gets the course code.
     * @return string The course code.
     */
    public function getCourseCode(): string {
        return $this->courseCode;
    }

    /**
     * Gets the credit hour.
     * @return int The credit hour value.
     */
    public function getCreditHour(): int {
        return $this->creditHour;
    }

    /**
     * Gets the course summary.
     * @return string The course summary.
     */
    public function getCourseSummary(): string {
        return $this->courseSummary;
    }

    /**
     * Gets the MS Teams link.
     * @return string The MS Teams link.
     */
    public function getMsTeamsLink(): string {
        return $this->msTeamsLink;
    }

    // ========== SETTER METHODS ==========

    /**
     * Sets the course name.
     * @param string $courseName The course name to set.
     */
    public function setCourseName(string $courseName): void {
        $this->courseName = $courseName;
    }

    /**
     * Sets the course code.
     * @param string $courseCode The course code to set.
     */
    public function setCourseCode(string $courseCode): void {
        $this->courseCode = $courseCode;
    }

    /**
     * Sets the credit hour.
     * @param int $creditHour The credit hour to set.
     */
    public function setCreditHour(int $creditHour): void {
        $this->creditHour = $creditHour;
    }

    /**
     * Sets the course summary.
     * @param string $courseSummary The course summary to set.
     */
    public function setCourseSummary(string $courseSummary): void {
        $this->courseSummary = $courseSummary;
    }

    /**
     * Sets the MS Teams link.
     * @param string $msTeamsLink The MS Teams link to set.
     */
    public function setMsTeamsLink(string $msTeamsLink): void {
        $this->msTeamsLink = $msTeamsLink;
    }

    // ========== UTILITY METHODS ==========

    /**
     * Converts the Course object to an associative array.
     * @return array Associative array of course attributes.
     */
    public function toArray(): array {
        return [
            'course_name' => $this->courseName,
            'course_code' => $this->courseCode,
            'credit_hour' => $this->creditHour,
            'course_summary' => $this->courseSummary,
            'ms_teams_link' => $this->msTeamsLink,
        ];
    }

    /**
     * Validates the course data.
     * @return array Array of error messages. Empty if valid.
     */
    public function validate(): array {
        $errors = [];

        if (empty(trim($this->courseName))) {
            $errors[] = "Course name is required.";
        }
        if (empty(trim($this->courseCode))) {
            $errors[] = "Course code is required.";
        }
        if ($this->creditHour < 1 || $this->creditHour > 6) {
            $errors[] = "Credit hour must be between 1 and 6.";
        }
        if (empty(trim($this->courseSummary))) {
            $errors[] = "Course summary is required.";
        }

        return $errors;
    }
}
