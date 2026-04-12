/**
 * File: student-handler.js
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Date: 09/03/2026
 * Description: JavaScript handler for Student Profile page.
 *              Handles Create, Search, Edit, Delete and View All.
 */

var STUDENT_API_URL = '../api/student-controller.php';


// ========== MESSAGE HELPERS ==========

/**
 * Shows a message banner (success, error, or info).
 */
function showStudentMsg(elementId, text, type) {
    var element = document.getElementById(elementId);
    element.textContent = text;
    element.className = 'message show message-' + type;
}

/**
 * Hides a message banner.
 */
function hideStudentMsg(elementId) {
    document.getElementById(elementId).className = 'message';
}


// ========== CREATE STUDENT ==========

/**
 * Handles the "Add New Student" form submission.
 * Collects form data, validates it, then sends to the API.
 */
async function handleCreateStudent(event) {
    event.preventDefault();
    hideStudentMsg('createStudentMessage');

    // Grab all the form values
    var studentData = {
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        student_id: document.getElementById('studentId').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        phone_number: document.getElementById('phoneNumber').value.trim()
    };

    // Check for any validation errors before sending
    var errors = validateStudentInput(studentData);
    if (errors.length > 0) {
        showStudentMsg('createStudentMessage', errors.join(' '), 'error');
        return;
    }

    try {
        var response = await fetch(STUDENT_API_URL + '?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        var result = await response.json();

        if (result.success) {
            showStudentMsg('createStudentMessage', result.message, 'success');
            document.getElementById('studentForm').reset();
            loadAllStudents(); // refresh the table
        } else {
            showStudentMsg('createStudentMessage', result.message, 'error');
        }
    } catch (error) {
        showStudentMsg('createStudentMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Validates student input on the frontend before sending to the API.
 * Returns an array of error messages (empty if everything is fine).
 */
function validateStudentInput(data) {
    var errors = [];

    if (!data.first_name) {
        errors.push('First name is required.');
    }
    if (!data.last_name) {
        errors.push('Last name is required.');
    }
    if (!data.student_id) {
        errors.push('Student ID is required.');
    }
    if (!data.email) {
        errors.push('Email is required.');
    }
    if (!data.phone_number) {
        errors.push('Phone number is required.');
    }

    return errors;
}


// ========== SEARCH STUDENT ==========

/**
 * Handles the student search form.
 * Sends the student ID to the API and displays the result.
 */
async function handleSearchStudent(event) {
    event.preventDefault();
    hideStudentMsg('searchStudentMessage');
    hideStudentSearchResult();

    var studentId = document.getElementById('searchStudentId').value.trim();

    if (!studentId) {
        showStudentMsg('searchStudentMessage', 'Please enter a student ID to search.', 'error');
        return;
    }

    try {
        var response = await fetch(STUDENT_API_URL + '?action=search&student_id=' + encodeURIComponent(studentId));
        var result = await response.json();

        if (result.success) {
            showStudentMsg('searchStudentMessage', result.message, 'success');
            displayStudentSearchResult(result.student);
        } else {
            showStudentMsg('searchStudentMessage', result.message, 'error');
        }
    } catch (error) {
        showStudentMsg('searchStudentMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Displays the search result in a detail grid.
 */
function displayStudentSearchResult(student) {
    var container = document.getElementById('searchStudentResult');

    container.innerHTML =
        '<div class="detail-grid">' +
            '<span class="detail-label">First Name:</span>' +
            '<span class="detail-value">' + escapeHtml(student.first_name) + '</span>' +
            '<span class="detail-label">Last Name:</span>' +
            '<span class="detail-value">' + escapeHtml(student.last_name) + '</span>' +
            '<span class="detail-label">Student ID:</span>' +
            '<span class="detail-value">' + escapeHtml(student.student_id) + '</span>' +
            '<span class="detail-label">Email:</span>' +
            '<span class="detail-value">' + escapeHtml(student.email) + '</span>' +
            '<span class="detail-label">Phone:</span>' +
            '<span class="detail-value">' + escapeHtml(student.phone_number) + '</span>' +
        '</div>';

    container.classList.add('show');
}

/**
 * Hides the search result section.
 */
function hideStudentSearchResult() {
    var container = document.getElementById('searchStudentResult');
    container.classList.remove('show');
    container.innerHTML = '';
}


// ========== EDIT STUDENT ==========

/**
 * Step 1: Search for the student to edit.
 * If found, populate the edit form with their current info.
 */
async function handleSearchToEditStudent(event) {
    event.preventDefault();
    hideStudentMsg('editStudentMessage');
    hideEditStudentForm();

    var studentId = document.getElementById('editSearchStudentId').value.trim();

    if (!studentId) {
        showStudentMsg('editStudentMessage', 'Please enter a student ID to edit.', 'error');
        return;
    }

    try {
        var response = await fetch(STUDENT_API_URL + '?action=search&student_id=' + encodeURIComponent(studentId));
        var result = await response.json();

        if (result.success) {
            showStudentMsg('editStudentMessage', 'Student found. Edit below.', 'success');
            populateEditStudentForm(result.student);
        } else {
            showStudentMsg('editStudentMessage', result.message, 'error');
        }
    } catch (error) {
        showStudentMsg('editStudentMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Fills the edit form with the student's current data.
 * Student ID is read-only since it can't be changed.
 */
function populateEditStudentForm(student) {
    document.getElementById('editStudentId').value = student.student_id;
    document.getElementById('editFirstName').value = student.first_name;
    document.getElementById('editLastName').value = student.last_name;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editPhoneNumber').value = student.phone_number;

    document.getElementById('editStudentFormContainer').classList.add('show');
}

/**
 * Hides the edit form.
 */
function hideEditStudentForm() {
    document.getElementById('editStudentFormContainer').classList.remove('show');
}

/**
 * Step 2: Submit the edited student data.
 * Validates and sends the updated info to the API.
 */
async function handleEditStudent(event) {
    event.preventDefault();
    hideStudentMsg('editStudentMessage');

    var studentData = {
        student_id: document.getElementById('editStudentId').value.trim(),
        first_name: document.getElementById('editFirstName').value.trim(),
        last_name: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editStudentEmail').value.trim(),
        phone_number: document.getElementById('editPhoneNumber').value.trim()
    };

    var errors = validateStudentInput(studentData);
    if (errors.length > 0) {
        showStudentMsg('editStudentMessage', errors.join(' '), 'error');
        return;
    }

    try {
        var response = await fetch(STUDENT_API_URL + '?action=edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });
        var result = await response.json();

        if (result.success) {
            showStudentMsg('editStudentMessage', result.message, 'success');

            // Show the updated student details so user can verify changes
            var container = document.getElementById('editedStudentResult');
            container.innerHTML =
                '<h3 style="font-size:14px;color:#1f4e79;margin-bottom:8px;">Updated Student:</h3>' +
                '<div class="detail-grid">' +
                    '<span class="detail-label">Name:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.student.first_name) + ' ' + escapeHtml(result.student.last_name) + '</span>' +
                    '<span class="detail-label">Student ID:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.student.student_id) + '</span>' +
                    '<span class="detail-label">Email:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.student.email) + '</span>' +
                    '<span class="detail-label">Phone:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.student.phone_number) + '</span>' +
                '</div>';
            container.classList.add('show');

            loadAllStudents(); // refresh the table
        } else {
            showStudentMsg('editStudentMessage', result.message, 'error');
        }
    } catch (error) {
        showStudentMsg('editStudentMessage', 'Error connecting to server.', 'error');
    }
}


// ========== DELETE STUDENT ==========

/**
 * Step 1: Search for the student to delete.
 * If found, show their details with a confirmation prompt.
 */
async function handleSearchToDeleteStudent(event) {
    event.preventDefault();
    hideStudentMsg('deleteStudentMessage');
    hideDeleteStudentConfirm();

    var studentId = document.getElementById('deleteSearchStudentId').value.trim();

    if (!studentId) {
        showStudentMsg('deleteStudentMessage', 'Please enter a student ID to delete.', 'error');
        return;
    }

    try {
        var response = await fetch(STUDENT_API_URL + '?action=search&student_id=' + encodeURIComponent(studentId));
        var result = await response.json();

        if (result.success) {
            showStudentMsg('deleteStudentMessage', 'Student found. Confirm deletion.', 'info');
            showDeleteStudentConfirm(result.student);
        } else {
            showStudentMsg('deleteStudentMessage', result.message, 'error');
        }
    } catch (error) {
        showStudentMsg('deleteStudentMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Shows the student details and asks "Are you sure?" before deleting.
 */
function showDeleteStudentConfirm(student) {
    var container = document.getElementById('deleteStudentConfirmContainer');

    container.innerHTML =
        '<div class="detail-grid" style="margin-bottom:16px">' +
            '<span class="detail-label">Name:</span>' +
            '<span class="detail-value">' + escapeHtml(student.first_name) + ' ' + escapeHtml(student.last_name) + '</span>' +
            '<span class="detail-label">Student ID:</span>' +
            '<span class="detail-value">' + escapeHtml(student.student_id) + '</span>' +
            '<span class="detail-label">Email:</span>' +
            '<span class="detail-value">' + escapeHtml(student.email) + '</span>' +
        '</div>' +
        '<p style="color:#dc3545;font-weight:600;margin-bottom:12px">' +
            'Are you sure you want to delete this student?' +
        '</p>' +
        '<div class="btn-group">' +
            '<button class="btn btn-danger" onclick="confirmDeleteStudent(\'' + escapeHtml(student.student_id) + '\')">Yes, Delete</button>' +
            '<button class="btn btn-secondary" onclick="hideDeleteStudentConfirm()">Cancel</button>' +
        '</div>';

    container.classList.add('show');
}

/**
 * Hides the delete confirmation section.
 */
function hideDeleteStudentConfirm() {
    var container = document.getElementById('deleteStudentConfirmContainer');
    container.classList.remove('show');
    container.innerHTML = '';
}

/**
 * Step 2: Actually deletes the student after user confirms.
 */
async function confirmDeleteStudent(studentId) {
    hideStudentMsg('deleteStudentMessage');

    try {
        var response = await fetch(STUDENT_API_URL + '?action=delete&student_id=' + encodeURIComponent(studentId));
        var result = await response.json();

        if (result.success) {
            showStudentMsg('deleteStudentMessage', result.message, 'success');
            hideDeleteStudentConfirm();
            document.getElementById('deleteSearchStudentId').value = '';
            loadAllStudents(); // refresh the table
        } else {
            showStudentMsg('deleteStudentMessage', result.message, 'error');
        }
    } catch (error) {
        showStudentMsg('deleteStudentMessage', 'Error connecting to server.', 'error');
    }
}


// ========== VIEW ALL STUDENTS ==========

/**
 * Loads all students from the API and displays them in the table.
 * This gets called on page load and after any create/edit/delete.
 */
async function loadAllStudents() {
    var tableBody = document.getElementById('studentTableBody');

    try {
        var response = await fetch(STUDENT_API_URL + '?action=getAll');
        var result = await response.json();

        if (result.success && result.students.length > 0) {
            // Build the table rows
            tableBody.innerHTML = result.students.map(function(student, index) {
                return '<tr>' +
                    '<td>' + (index + 1) + '</td>' +
                    '<td>' + escapeHtml(student.student_id) + '</td>' +
                    '<td>' + escapeHtml(student.first_name) + ' ' + escapeHtml(student.last_name) + '</td>' +
                    '<td>' + escapeHtml(student.email) + '</td>' +
                    '<td>' + escapeHtml(student.phone_number) + '</td>' +
                '</tr>';
            }).join('');

            // Update the counter
            var totalElement = document.getElementById('totalStudents');
            if (totalElement) {
                totalElement.textContent = 'Total: ' + result.total + ' student(s)';
            }
        } else {
            // No students yet — show empty state
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888">No students added yet.</td></tr>';

            var totalElement = document.getElementById('totalStudents');
            if (totalElement) {
                totalElement.textContent = 'Total: 0 student(s)';
            }
        }
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#dc3545">Error loading students.</td></tr>';
    }
}


// ========== UTILITY ==========

/**
 * Escapes HTML characters to prevent XSS attacks.
 * Creates a text node and reads back the escaped version.
 */
function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ========== PAGE INITIALIZATION ==========

/**
 * When the page loads, bind all the form handlers
 * and load the students table.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create form
    var studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', handleCreateStudent);
    }

    // Search form
    var searchForm = document.getElementById('searchStudentForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchStudent);
    }

    // Edit search form
    var editSearchForm = document.getElementById('editSearchStudentForm');
    if (editSearchForm) {
        editSearchForm.addEventListener('submit', handleSearchToEditStudent);
    }

    // Edit submit form
    var editForm = document.getElementById('editStudentForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditStudent);
    }

    // Delete search form
    var deleteSearchForm = document.getElementById('deleteSearchStudentForm');
    if (deleteSearchForm) {
        deleteSearchForm.addEventListener('submit', handleSearchToDeleteStudent);
    }

    // Load all students into the table
    loadAllStudents();
});