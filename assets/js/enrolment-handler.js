/**
 * File: enrolment-handler.js
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Date: 30/03/2026
 * Description: JavaScript handler for Enrolment page.
 *              Handles enrol, list courses by student, list students by course,
 *              auto-suggestion, and view all enrolments.
 */

const ENROL_API = '../api/enrolment-controller.php';

function showEnrolMsg(id, text, type) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = 'message show message-' + type;
}

function hideEnrolMsg(id) {
    document.getElementById(id).className = 'message';
}

function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

// ========== AUTO-SUGGESTION ==========

async function loadCourseSuggestions() {
    try {
        const r = await fetch(ENROL_API + '?action=suggestCourses');
        const res = await r.json();
        if (res.success) {
            document.querySelectorAll('.course-suggestions').forEach(function(list) {
                list.innerHTML = res.suggestions.map(function(c) {
                    return '<option value="' + escapeHtml(c.course_code) + '">' +
                        escapeHtml(c.course_code) + ' - ' + escapeHtml(c.course_name) + '</option>';
                }).join('');
            });
        }
    } catch (e) { /* silent */ }
}

async function loadStudentSuggestions() {
    try {
        const r = await fetch(ENROL_API + '?action=suggestStudents');
        const res = await r.json();
        if (res.success) {
            document.querySelectorAll('.student-suggestions').forEach(function(list) {
                list.innerHTML = res.suggestions.map(function(s) {
                    return '<option value="' + escapeHtml(s.student_id) + '">' +
                        escapeHtml(s.student_id) + ' - ' + escapeHtml(s.first_name) + ' ' +
                        escapeHtml(s.last_name) + '</option>';
                }).join('');
            });
        }
    } catch (e) { /* silent */ }
}

// ========== ENROL ==========

async function handleEnrol(e) {
    e.preventDefault();
    hideEnrolMsg('enrolMessage');

    const courseCode = document.getElementById('enrolCourseCode').value.trim();
    const studentId = document.getElementById('enrolStudentId').value.trim();

    if (!courseCode || !studentId) {
        showEnrolMsg('enrolMessage', 'Both course code and student ID are required.', 'error');
        return;
    }

    try {
        const r = await fetch(ENROL_API + '?action=enrol', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ course_code: courseCode, student_id: studentId })
        });
        const res = await r.json();

        if (res.success) {
            showEnrolMsg('enrolMessage', res.message, 'success');
            document.getElementById('enrolForm').reset();
            loadAllEnrolments();
        } else {
            showEnrolMsg('enrolMessage', res.message, 'error');
        }
    } catch (err) {
        showEnrolMsg('enrolMessage', 'Error connecting to server.', 'error');
    }
}

// ========== LIST COURSES BY STUDENT ==========

async function handleListCourses(e) {
    e.preventDefault();
    hideEnrolMsg('listCoursesMessage');
    const container = document.getElementById('listCoursesResult');
    container.classList.remove('show');

    const studentId = document.getElementById('listCoursesStudentId').value.trim();
    if (!studentId) {
        showEnrolMsg('listCoursesMessage', 'Please enter a student ID.', 'error');
        return;
    }

    try {
        const r = await fetch(ENROL_API + '?action=listCourses&student_id=' + encodeURIComponent(studentId));
        const res = await r.json();

        if (res.success) {
            if (res.courses.length === 0) {
                showEnrolMsg('listCoursesMessage', 'Student has no enrolled courses.', 'info');
                container.innerHTML = '';
            } else {
                showEnrolMsg('listCoursesMessage',
                    'Found ' + res.total + ' course(s) for ' + escapeHtml(res.student_name) + '.', 'success');
                container.innerHTML = '<table><thead><tr><th>#</th><th>Course Code</th><th>Course Name</th><th>Credit Hour</th></tr></thead><tbody>' +
                    res.courses.map(function(c, i) {
                        return '<tr><td>' + (i + 1) + '</td><td>' + escapeHtml(c.course_code) +
                            '</td><td>' + escapeHtml(c.course_name) + '</td><td>' + c.credit_hour + '</td></tr>';
                    }).join('') + '</tbody></table>';
                container.classList.add('show');
            }
        } else {
            showEnrolMsg('listCoursesMessage', res.message, 'error');
        }
    } catch (err) {
        showEnrolMsg('listCoursesMessage', 'Error connecting to server.', 'error');
    }
}

// ========== LIST STUDENTS BY COURSE ==========

async function handleListStudents(e) {
    e.preventDefault();
    hideEnrolMsg('listStudentsMessage');
    const container = document.getElementById('listStudentsResult');
    container.classList.remove('show');

    const courseCode = document.getElementById('listStudentsCourseCode').value.trim();
    if (!courseCode) {
        showEnrolMsg('listStudentsMessage', 'Please enter a course code.', 'error');
        return;
    }

    try {
        const r = await fetch(ENROL_API + '?action=listStudents&course_code=' + encodeURIComponent(courseCode));
        const res = await r.json();

        if (res.success) {
            if (res.students.length === 0) {
                showEnrolMsg('listStudentsMessage', 'Course has no enrolled students.', 'info');
                container.innerHTML = '';
            } else {
                showEnrolMsg('listStudentsMessage',
                    'Found ' + res.total + ' student(s) in ' + escapeHtml(res.course_name) + '.', 'success');
                container.innerHTML = '<table><thead><tr><th>#</th><th>Student ID</th><th>Name</th><th>Email</th></tr></thead><tbody>' +
                    res.students.map(function(s, i) {
                        return '<tr><td>' + (i + 1) + '</td><td>' + escapeHtml(s.student_id) +
                            '</td><td>' + escapeHtml(s.first_name) + ' ' + escapeHtml(s.last_name) +
                            '</td><td>' + escapeHtml(s.email) + '</td></tr>';
                    }).join('') + '</tbody></table>';
                container.classList.add('show');
            }
        } else {
            showEnrolMsg('listStudentsMessage', res.message, 'error');
        }
    } catch (err) {
        showEnrolMsg('listStudentsMessage', 'Error connecting to server.', 'error');
    }
}

// ========== VIEW ALL ==========

async function loadAllEnrolments() {
    const tbody = document.getElementById('enrolmentTableBody');
    try {
        const r = await fetch(ENROL_API + '?action=getAll');
        const res = await r.json();

        if (res.success && res.enrolments.length > 0) {
            tbody.innerHTML = res.enrolments.map(function(e, i) {
                return '<tr>' +
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + escapeHtml(e.course_code) + '</td>' +
                    '<td>' + escapeHtml(e.course_name) + '</td>' +
                    '<td>' + escapeHtml(e.student_id) + '</td>' +
                    '<td>' + escapeHtml(e.student_name) + '</td>' +
                    '<td>' + escapeHtml(e.enrol_date) + '</td>' +
                    '<td><button class="btn btn-danger" style="padding:4px 10px;font-size:12px" ' +
                    'onclick="handleRemoveEnrolment(\'' + escapeHtml(e.course_code) + '\',\'' +
                    escapeHtml(e.student_id) + '\')">Remove</button></td>' +
                    '</tr>';
            }).join('');
            const t = document.getElementById('totalEnrolments');
            if (t) t.textContent = 'Total: ' + res.total + ' enrolment(s)';
        } else {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888">No enrolments yet.</td></tr>';
            const t = document.getElementById('totalEnrolments');
            if (t) t.textContent = 'Total: 0 enrolment(s)';
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#dc3545">Error loading enrolments.</td></tr>';
    }
}

async function handleRemoveEnrolment(courseCode, studentId) {
    if (!confirm('Remove this enrolment?')) return;
    try {
        const r = await fetch(ENROL_API + '?action=remove&course_code=' +
            encodeURIComponent(courseCode) + '&student_id=' + encodeURIComponent(studentId));
        const res = await r.json();
        if (res.success) {
            loadAllEnrolments();
        } else {
            alert(res.message);
        }
    } catch (err) {
        alert('Error connecting to server.');
    }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    const f1 = document.getElementById('enrolForm');
    if (f1) f1.addEventListener('submit', handleEnrol);

    const f2 = document.getElementById('listCoursesForm');
    if (f2) f2.addEventListener('submit', handleListCourses);

    const f3 = document.getElementById('listStudentsForm');
    if (f3) f3.addEventListener('submit', handleListStudents);

    loadAllEnrolments();
    loadCourseSuggestions();
    loadStudentSuggestions();
});
