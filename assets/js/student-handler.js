/**
 * File: student-handler.js
<<<<<<< HEAD
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
=======
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Date: 09/03/2026
 * Description: JavaScript handler for Student Profile page. Handles Create, Search, Edit, Delete and View All.
 */
const STUDENT_API_URL='../api/student-controller.php';
function showStudentMsg(id,text,type){const el=document.getElementById(id);el.textContent=text;el.className='message show message-'+type;}
function hideStudentMsg(id){document.getElementById(id).className='message';}

async function handleCreateStudent(e){
  e.preventDefault();hideStudentMsg('createStudentMessage');
  const d={first_name:document.getElementById('firstName').value.trim(),last_name:document.getElementById('lastName').value.trim(),student_id:document.getElementById('studentId').value.trim(),email:document.getElementById('studentEmail').value.trim(),phone_number:document.getElementById('phoneNumber').value.trim()};
  const err=validateStudentInput(d);if(err.length>0){showStudentMsg('createStudentMessage',err.join(' '),'error');return;}
  try{const r=await fetch(STUDENT_API_URL+'?action=create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const res=await r.json();
    if(res.success){showStudentMsg('createStudentMessage',res.message,'success');document.getElementById('studentForm').reset();loadAllStudents();}else{showStudentMsg('createStudentMessage',res.message,'error');}
  }catch(err){showStudentMsg('createStudentMessage','Error connecting to server.','error');}
}
function validateStudentInput(d){const e=[];if(!d.first_name)e.push('First name is required.');if(!d.last_name)e.push('Last name is required.');if(!d.student_id)e.push('Student ID is required.');if(!d.email)e.push('Email is required.');if(!d.phone_number)e.push('Phone number is required.');return e;}

async function handleSearchStudent(e){
  e.preventDefault();hideStudentMsg('searchStudentMessage');hideStudentSearchResult();
  const id=document.getElementById('searchStudentId').value.trim();
  if(!id){showStudentMsg('searchStudentMessage','Please enter a student ID to search.','error');return;}
  try{const r=await fetch(STUDENT_API_URL+'?action=search&student_id='+encodeURIComponent(id));const res=await r.json();
    if(res.success){showStudentMsg('searchStudentMessage',res.message,'success');displayStudentSearchResult(res.student);}else{showStudentMsg('searchStudentMessage',res.message,'error');}
  }catch(err){showStudentMsg('searchStudentMessage','Error connecting to server.','error');}
}
function displayStudentSearchResult(s){const el=document.getElementById('searchStudentResult');el.innerHTML=`<div class="detail-grid"><span class="detail-label">First Name:</span><span class="detail-value">${escapeHtml(s.first_name)}</span><span class="detail-label">Last Name:</span><span class="detail-value">${escapeHtml(s.last_name)}</span><span class="detail-label">Student ID:</span><span class="detail-value">${escapeHtml(s.student_id)}</span><span class="detail-label">Email:</span><span class="detail-value">${escapeHtml(s.email)}</span><span class="detail-label">Phone:</span><span class="detail-value">${escapeHtml(s.phone_number)}</span></div>`;el.classList.add('show');}
function hideStudentSearchResult(){const el=document.getElementById('searchStudentResult');el.classList.remove('show');el.innerHTML='';}

async function handleSearchToEditStudent(e){
  e.preventDefault();hideStudentMsg('editStudentMessage');hideEditStudentForm();
  const id=document.getElementById('editSearchStudentId').value.trim();
  if(!id){showStudentMsg('editStudentMessage','Please enter a student ID to edit.','error');return;}
  try{const r=await fetch(STUDENT_API_URL+'?action=search&student_id='+encodeURIComponent(id));const res=await r.json();
    if(res.success){showStudentMsg('editStudentMessage','Student found. Edit below.','success');populateEditStudentForm(res.student);}else{showStudentMsg('editStudentMessage',res.message,'error');}
  }catch(err){showStudentMsg('editStudentMessage','Error connecting to server.','error');}
}
function populateEditStudentForm(s){document.getElementById('editStudentId').value=s.student_id;document.getElementById('editFirstName').value=s.first_name;document.getElementById('editLastName').value=s.last_name;document.getElementById('editStudentEmail').value=s.email;document.getElementById('editPhoneNumber').value=s.phone_number;document.getElementById('editStudentFormContainer').classList.add('show');}
function hideEditStudentForm(){document.getElementById('editStudentFormContainer').classList.remove('show');}

async function handleEditStudent(e){
  e.preventDefault();hideStudentMsg('editStudentMessage');
  const d={student_id:document.getElementById('editStudentId').value.trim(),first_name:document.getElementById('editFirstName').value.trim(),last_name:document.getElementById('editLastName').value.trim(),email:document.getElementById('editStudentEmail').value.trim(),phone_number:document.getElementById('editPhoneNumber').value.trim()};
  const err=validateStudentInput(d);if(err.length>0){showStudentMsg('editStudentMessage',err.join(' '),'error');return;}
  try{const r=await fetch(STUDENT_API_URL+'?action=edit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const res=await r.json();
    if(res.success){showStudentMsg('editStudentMessage',res.message,'success');const el=document.getElementById('editedStudentResult');el.innerHTML=`<h3 style="font-size:14px;color:#1f4e79;margin-bottom:8px;">Updated Student:</h3><div class="detail-grid"><span class="detail-label">Name:</span><span class="detail-value">${escapeHtml(res.student.first_name)} ${escapeHtml(res.student.last_name)}</span><span class="detail-label">Student ID:</span><span class="detail-value">${escapeHtml(res.student.student_id)}</span><span class="detail-label">Email:</span><span class="detail-value">${escapeHtml(res.student.email)}</span><span class="detail-label">Phone:</span><span class="detail-value">${escapeHtml(res.student.phone_number)}</span></div>`;el.classList.add('show');loadAllStudents();}else{showStudentMsg('editStudentMessage',res.message,'error');}
  }catch(err){showStudentMsg('editStudentMessage','Error connecting to server.','error');}
}

async function handleSearchToDeleteStudent(e){
  e.preventDefault();hideStudentMsg('deleteStudentMessage');hideDeleteStudentConfirm();
  const id=document.getElementById('deleteSearchStudentId').value.trim();
  if(!id){showStudentMsg('deleteStudentMessage','Please enter a student ID to delete.','error');return;}
  try{const r=await fetch(STUDENT_API_URL+'?action=search&student_id='+encodeURIComponent(id));const res=await r.json();
    if(res.success){showStudentMsg('deleteStudentMessage','Student found. Confirm deletion.','info');showDeleteStudentConfirm(res.student);}else{showStudentMsg('deleteStudentMessage',res.message,'error');}
  }catch(err){showStudentMsg('deleteStudentMessage','Error connecting to server.','error');}
}
function showDeleteStudentConfirm(s){const el=document.getElementById('deleteStudentConfirmContainer');el.innerHTML=`<div class="detail-grid" style="margin-bottom:16px"><span class="detail-label">Name:</span><span class="detail-value">${escapeHtml(s.first_name)} ${escapeHtml(s.last_name)}</span><span class="detail-label">Student ID:</span><span class="detail-value">${escapeHtml(s.student_id)}</span><span class="detail-label">Email:</span><span class="detail-value">${escapeHtml(s.email)}</span></div><p style="color:#dc3545;font-weight:600;margin-bottom:12px">Are you sure you want to delete this student?</p><div class="btn-group"><button class="btn btn-danger" onclick="confirmDeleteStudent('${escapeHtml(s.student_id)}')">Yes, Delete</button><button class="btn btn-secondary" onclick="hideDeleteStudentConfirm()">Cancel</button></div>`;el.classList.add('show');}
function hideDeleteStudentConfirm(){const el=document.getElementById('deleteStudentConfirmContainer');el.classList.remove('show');el.innerHTML='';}
async function confirmDeleteStudent(id){hideStudentMsg('deleteStudentMessage');try{const r=await fetch(STUDENT_API_URL+'?action=delete&student_id='+encodeURIComponent(id));const res=await r.json();if(res.success){showStudentMsg('deleteStudentMessage',res.message,'success');hideDeleteStudentConfirm();document.getElementById('deleteSearchStudentId').value='';loadAllStudents();}else{showStudentMsg('deleteStudentMessage',res.message,'error');}}catch(err){showStudentMsg('deleteStudentMessage','Error connecting to server.','error');}}

async function loadAllStudents(){
  const tbody=document.getElementById('studentTableBody');
  try{const r=await fetch(STUDENT_API_URL+'?action=getAll');const res=await r.json();
    if(res.success&&res.students.length>0){tbody.innerHTML=res.students.map((s,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(s.student_id)}</td><td>${escapeHtml(s.first_name)} ${escapeHtml(s.last_name)}</td><td>${escapeHtml(s.email)}</td><td>${escapeHtml(s.phone_number)}</td></tr>`).join('');
      const t=document.getElementById('totalStudents');if(t)t.textContent='Total: '+res.total+' student(s)';
    }else{tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:#888">No students added yet.</td></tr>';const t=document.getElementById('totalStudents');if(t)t.textContent='Total: 0 student(s)';}
  }catch(err){tbody.innerHTML='<tr><td colspan="5" style="text-align:center;color:#dc3545">Error loading students.</td></tr>';}
}
function escapeHtml(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}

document.addEventListener('DOMContentLoaded',function(){
  const f1=document.getElementById('studentForm');if(f1)f1.addEventListener('submit',handleCreateStudent);
  const f2=document.getElementById('searchStudentForm');if(f2)f2.addEventListener('submit',handleSearchStudent);
  const f3=document.getElementById('editSearchStudentForm');if(f3)f3.addEventListener('submit',handleSearchToEditStudent);
  const f4=document.getElementById('editStudentForm');if(f4)f4.addEventListener('submit',handleEditStudent);
  const f5=document.getElementById('deleteSearchStudentForm');if(f5)f5.addEventListener('submit',handleSearchToDeleteStudent);
  loadAllStudents();
});
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
