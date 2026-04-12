/**
 * File: course-handler.js
<<<<<<< HEAD
 * Author: Muhammad Ainul Khalis bin Mohd Radzi
 * Date: 02/03/2026
 * Description: JavaScript handler for Course Profile page.
 *              Handles Create, Search, Edit, Delete and View All.
=======
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Date: 02/03/2026
 * Description: JavaScript handler for Course Profile page. Handles Create, Search, Edit, Delete and View All.
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
 */
const API_BASE_URL='../api/course-controller.php';
function showMessage(id,text,type){const el=document.getElementById(id);el.textContent=text;el.className='message show message-'+type;}
function hideMessage(id){document.getElementById(id).className='message';}

async function handleCreateCourse(e){
  e.preventDefault();hideMessage('createMessage');
  const d={course_name:document.getElementById('courseName').value.trim(),course_code:document.getElementById('courseCode').value.trim(),credit_hour:parseInt(document.getElementById('creditHour').value),course_summary:document.getElementById('courseSummary').value.trim(),ms_teams_link:document.getElementById('msTeamsLink').value.trim()};
  const err=validateCourseInput(d);if(err.length>0){showMessage('createMessage',err.join(' '),'error');return;}
  try{const r=await fetch(API_BASE_URL+'?action=create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const res=await r.json();
    if(res.success){showMessage('createMessage',res.message,'success');document.getElementById('courseForm').reset();loadAllCourses();}else{showMessage('createMessage',res.message,'error');}
  }catch(err){showMessage('createMessage','Error connecting to server.','error');}
}
function validateCourseInput(d){const e=[];if(!d.course_name)e.push('Course name is required.');if(!d.course_code)e.push('Course code is required.');if(isNaN(d.credit_hour)||d.credit_hour<1||d.credit_hour>6)e.push('Credit hour must be between 1 and 6.');if(!d.course_summary)e.push('Course summary is required.');return e;}

<<<<<<< HEAD

// ========== MESSAGE HELPERS ==========

/**
 * Shows a message banner (success, error, or info).
 */
function showMessage(elementId, text, type) {
    var element = document.getElementById(elementId);
    element.textContent = text;
    element.className = 'message show message-' + type;
}

/**
 * Hides a message banner.
 */
function hideMessage(elementId) {
    document.getElementById(elementId).className = 'message';
=======
async function handleSearchCourse(e){
  e.preventDefault();hideMessage('searchMessage');hideSearchResult();
  const code=document.getElementById('searchCode').value.trim();
  if(!code){showMessage('searchMessage','Please enter a course code to search.','error');return;}
  try{const r=await fetch(API_BASE_URL+'?action=search&course_code='+encodeURIComponent(code));const res=await r.json();
    if(res.success){showMessage('searchMessage',res.message,'success');displaySearchResult(res.course);}else{showMessage('searchMessage',res.message,'error');}
  }catch(err){showMessage('searchMessage','Error connecting to server.','error');}
}
function displaySearchResult(c){const el=document.getElementById('searchResult');el.innerHTML=`<div class="detail-grid"><span class="detail-label">Course Name:</span><span class="detail-value">${escapeHtml(c.course_name)}</span><span class="detail-label">Course Code:</span><span class="detail-value">${escapeHtml(c.course_code)}</span><span class="detail-label">Credit Hour:</span><span class="detail-value">${c.credit_hour}</span><span class="detail-label">Summary:</span><span class="detail-value">${escapeHtml(c.course_summary)}</span><span class="detail-label">MS Teams Link:</span><span class="detail-value">${c.ms_teams_link?'<a href="'+escapeHtml(c.ms_teams_link)+'" target="_blank">'+escapeHtml(c.ms_teams_link)+'</a>':'-'}</span></div>`;el.classList.add('show');}
function hideSearchResult(){const el=document.getElementById('searchResult');el.classList.remove('show');el.innerHTML='';}

async function handleSearchToEdit(e){
  e.preventDefault();hideMessage('editMessage');hideEditForm();
  const code=document.getElementById('editSearchCode').value.trim();
  if(!code){showMessage('editMessage','Please enter a course code to edit.','error');return;}
  try{const r=await fetch(API_BASE_URL+'?action=search&course_code='+encodeURIComponent(code));const res=await r.json();
    if(res.success){showMessage('editMessage','Course found. Edit the fields below.','success');populateEditForm(res.course);}else{showMessage('editMessage',res.message,'error');}
  }catch(err){showMessage('editMessage','Error connecting to server.','error');}
}
function populateEditForm(c){document.getElementById('editCourseCode').value=c.course_code;document.getElementById('editCourseName').value=c.course_name;document.getElementById('editCreditHour').value=c.credit_hour;document.getElementById('editCourseSummary').value=c.course_summary;document.getElementById('editMsTeamsLink').value=c.ms_teams_link||'';document.getElementById('editFormContainer').classList.add('show');}
function hideEditForm(){document.getElementById('editFormContainer').classList.remove('show');}

async function handleEditCourse(e){
  e.preventDefault();hideMessage('editMessage');
  const d={course_code:document.getElementById('editCourseCode').value.trim(),course_name:document.getElementById('editCourseName').value.trim(),credit_hour:parseInt(document.getElementById('editCreditHour').value),course_summary:document.getElementById('editCourseSummary').value.trim(),ms_teams_link:document.getElementById('editMsTeamsLink').value.trim()};
  const err=validateCourseInput(d);if(err.length>0){showMessage('editMessage',err.join(' '),'error');return;}
  try{const r=await fetch(API_BASE_URL+'?action=edit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const res=await r.json();
    if(res.success){showMessage('editMessage',res.message,'success');const el=document.getElementById('editedResult');el.innerHTML=`<h3 style="font-size:14px;color:#1f4e79;margin-bottom:8px;">Updated Course:</h3><div class="detail-grid"><span class="detail-label">Course Name:</span><span class="detail-value">${escapeHtml(res.course.course_name)}</span><span class="detail-label">Course Code:</span><span class="detail-value">${escapeHtml(res.course.course_code)}</span><span class="detail-label">Credit Hour:</span><span class="detail-value">${res.course.credit_hour}</span><span class="detail-label">Summary:</span><span class="detail-value">${escapeHtml(res.course.course_summary)}</span></div>`;el.classList.add('show');loadAllCourses();}else{showMessage('editMessage',res.message,'error');}
  }catch(err){showMessage('editMessage','Error connecting to server.','error');}
}

async function handleSearchToDelete(e){
  e.preventDefault();hideMessage('deleteMessage');hideDeleteConfirm();
  const code=document.getElementById('deleteSearchCode').value.trim();
  if(!code){showMessage('deleteMessage','Please enter a course code to delete.','error');return;}
  try{const r=await fetch(API_BASE_URL+'?action=search&course_code='+encodeURIComponent(code));const res=await r.json();
    if(res.success){showMessage('deleteMessage','Course found. Confirm deletion below.','info');showDeleteConfirm(res.course);}else{showMessage('deleteMessage',res.message,'error');}
  }catch(err){showMessage('deleteMessage','Error connecting to server.','error');}
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
}
function showDeleteConfirm(c){const el=document.getElementById('deleteConfirmContainer');el.innerHTML=`<div class="detail-grid" style="margin-bottom:16px"><span class="detail-label">Course Name:</span><span class="detail-value">${escapeHtml(c.course_name)}</span><span class="detail-label">Course Code:</span><span class="detail-value">${escapeHtml(c.course_code)}</span><span class="detail-label">Credit Hour:</span><span class="detail-value">${c.credit_hour}</span></div><p style="color:#dc3545;font-weight:600;margin-bottom:12px">Are you sure you want to delete this course?</p><div class="btn-group"><button class="btn btn-danger" onclick="confirmDeleteCourse('${escapeHtml(c.course_code)}')">Yes, Delete</button><button class="btn btn-secondary" onclick="hideDeleteConfirm()">Cancel</button></div>`;el.classList.add('show');}
function hideDeleteConfirm(){const el=document.getElementById('deleteConfirmContainer');el.classList.remove('show');el.innerHTML='';}
async function confirmDeleteCourse(code){hideMessage('deleteMessage');try{const r=await fetch(API_BASE_URL+'?action=delete&course_code='+encodeURIComponent(code));const res=await r.json();if(res.success){showMessage('deleteMessage',res.message,'success');hideDeleteConfirm();document.getElementById('deleteSearchCode').value='';loadAllCourses();}else{showMessage('deleteMessage',res.message,'error');}}catch(err){showMessage('deleteMessage','Error connecting to server.','error');}}

<<<<<<< HEAD

// ========== CREATE COURSE ==========

/**
 * Handles the "Add New Course" form submission.
 * Collects the form data, validates it, then sends to the API.
 */
async function handleCreateCourse(event) {
    event.preventDefault();
    hideMessage('createMessage');

    // Grab all the form values
    var courseData = {
        course_name: document.getElementById('courseName').value.trim(),
        course_code: document.getElementById('courseCode').value.trim(),
        credit_hour: parseInt(document.getElementById('creditHour').value),
        course_summary: document.getElementById('courseSummary').value.trim(),
        ms_teams_link: document.getElementById('msTeamsLink').value.trim()
    };

    // Check for any validation errors before sending
    var errors = validateCourseInput(courseData);
    if (errors.length > 0) {
        showMessage('createMessage', errors.join(' '), 'error');
        return;
    }

    try {
        var response = await fetch(API_BASE_URL + '?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });
        var result = await response.json();

        if (result.success) {
            showMessage('createMessage', result.message, 'success');
            document.getElementById('courseForm').reset();
            loadAllCourses(); // refresh the table
        } else {
            showMessage('createMessage', result.message, 'error');
        }
    } catch (error) {
        showMessage('createMessage', 'Error connecting to server.', 'error');
    }
=======
async function loadAllCourses(){
  const tbody=document.getElementById('courseTableBody');
  try{const r=await fetch(API_BASE_URL+'?action=getAll');const res=await r.json();
    if(res.success&&res.courses.length>0){tbody.innerHTML=res.courses.map((c,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(c.course_code)}</td><td>${escapeHtml(c.course_name)}</td><td>${c.credit_hour}</td><td>${escapeHtml(c.course_summary)}</td><td>${c.ms_teams_link?'<a href="'+escapeHtml(c.ms_teams_link)+'" target="_blank">Link</a>':'-'}</td></tr>`).join('');
      const t=document.getElementById('totalCourses');if(t)t.textContent='Total: '+res.total+' course(s)';
    }else{tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:#888">No courses added yet.</td></tr>';const t=document.getElementById('totalCourses');if(t)t.textContent='Total: 0 course(s)';}
  }catch(err){tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:#dc3545">Error loading courses.</td></tr>';}
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
}
function escapeHtml(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}

<<<<<<< HEAD
/**
 * Validates course input on the frontend before sending to the API.
 * Returns an array of error messages (empty if everything is fine).
 */
function validateCourseInput(data) {
    var errors = [];

    if (!data.course_name) {
        errors.push('Course name is required.');
    }
    if (!data.course_code) {
        errors.push('Course code is required.');
    }
    if (isNaN(data.credit_hour) || data.credit_hour < 1 || data.credit_hour > 6) {
        errors.push('Credit hour must be between 1 and 6.');
    }
    if (!data.course_summary) {
        errors.push('Course summary is required.');
    }

    return errors;
}


// ========== SEARCH COURSE ==========

/**
 * Handles the course search form.
 * Sends the course code to the API and displays the result.
 */
async function handleSearchCourse(event) {
    event.preventDefault();
    hideMessage('searchMessage');
    hideSearchResult();

    var courseCode = document.getElementById('searchCode').value.trim();

    if (!courseCode) {
        showMessage('searchMessage', 'Please enter a course code to search.', 'error');
        return;
    }

    try {
        var response = await fetch(API_BASE_URL + '?action=search&course_code=' + encodeURIComponent(courseCode));
        var result = await response.json();

        if (result.success) {
            showMessage('searchMessage', result.message, 'success');
            displaySearchResult(result.course);
        } else {
            showMessage('searchMessage', result.message, 'error');
        }
    } catch (error) {
        showMessage('searchMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Displays the search result in a nice detail grid.
 */
function displaySearchResult(course) {
    var container = document.getElementById('searchResult');

    container.innerHTML =
        '<div class="detail-grid">' +
            '<span class="detail-label">Course Name:</span>' +
            '<span class="detail-value">' + escapeHtml(course.course_name) + '</span>' +
            '<span class="detail-label">Course Code:</span>' +
            '<span class="detail-value">' + escapeHtml(course.course_code) + '</span>' +
            '<span class="detail-label">Credit Hour:</span>' +
            '<span class="detail-value">' + course.credit_hour + '</span>' +
            '<span class="detail-label">Summary:</span>' +
            '<span class="detail-value">' + escapeHtml(course.course_summary) + '</span>' +
            '<span class="detail-label">MS Teams Link:</span>' +
            '<span class="detail-value">' +
                (course.ms_teams_link
                    ? '<a href="' + escapeHtml(course.ms_teams_link) + '" target="_blank">' + escapeHtml(course.ms_teams_link) + '</a>'
                    : '-') +
            '</span>' +
        '</div>';

    container.classList.add('show');
}

/**
 * Hides the search result section.
 */
function hideSearchResult() {
    var container = document.getElementById('searchResult');
    container.classList.remove('show');
    container.innerHTML = '';
}


// ========== EDIT COURSE ==========

/**
 * Step 1: Search for the course to edit.
 * If found, populate the edit form with current values.
 */
async function handleSearchToEdit(event) {
    event.preventDefault();
    hideMessage('editMessage');
    hideEditForm();

    var courseCode = document.getElementById('editSearchCode').value.trim();

    if (!courseCode) {
        showMessage('editMessage', 'Please enter a course code to edit.', 'error');
        return;
    }

    try {
        var response = await fetch(API_BASE_URL + '?action=search&course_code=' + encodeURIComponent(courseCode));
        var result = await response.json();

        if (result.success) {
            showMessage('editMessage', 'Course found. Edit the fields below.', 'success');
            populateEditForm(result.course);
        } else {
            showMessage('editMessage', result.message, 'error');
        }
    } catch (error) {
        showMessage('editMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Fills the edit form with the course's current data.
 * Course code is read-only since it can't be changed.
 */
function populateEditForm(course) {
    document.getElementById('editCourseCode').value = course.course_code;
    document.getElementById('editCourseName').value = course.course_name;
    document.getElementById('editCreditHour').value = course.credit_hour;
    document.getElementById('editCourseSummary').value = course.course_summary;
    document.getElementById('editMsTeamsLink').value = course.ms_teams_link || '';

    document.getElementById('editFormContainer').classList.add('show');
}

/**
 * Hides the edit form.
 */
function hideEditForm() {
    document.getElementById('editFormContainer').classList.remove('show');
}

/**
 * Step 2: Submit the edited course data.
 * Validates and sends the updated info to the API.
 */
async function handleEditCourse(event) {
    event.preventDefault();
    hideMessage('editMessage');

    var courseData = {
        course_code: document.getElementById('editCourseCode').value.trim(),
        course_name: document.getElementById('editCourseName').value.trim(),
        credit_hour: parseInt(document.getElementById('editCreditHour').value),
        course_summary: document.getElementById('editCourseSummary').value.trim(),
        ms_teams_link: document.getElementById('editMsTeamsLink').value.trim()
    };

    var errors = validateCourseInput(courseData);
    if (errors.length > 0) {
        showMessage('editMessage', errors.join(' '), 'error');
        return;
    }

    try {
        var response = await fetch(API_BASE_URL + '?action=edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });
        var result = await response.json();

        if (result.success) {
            showMessage('editMessage', result.message, 'success');

            // Show the updated course details so user can verify the changes
            var container = document.getElementById('editedResult');
            container.innerHTML =
                '<h3 style="font-size:14px;color:#1f4e79;margin-bottom:8px;">Updated Course:</h3>' +
                '<div class="detail-grid">' +
                    '<span class="detail-label">Course Name:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.course.course_name) + '</span>' +
                    '<span class="detail-label">Course Code:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.course.course_code) + '</span>' +
                    '<span class="detail-label">Credit Hour:</span>' +
                    '<span class="detail-value">' + result.course.credit_hour + '</span>' +
                    '<span class="detail-label">Summary:</span>' +
                    '<span class="detail-value">' + escapeHtml(result.course.course_summary) + '</span>' +
                '</div>';
            container.classList.add('show');

            loadAllCourses(); // refresh the table
        } else {
            showMessage('editMessage', result.message, 'error');
        }
    } catch (error) {
        showMessage('editMessage', 'Error connecting to server.', 'error');
    }
}


// ========== DELETE COURSE ==========

/**
 * Step 1: Search for the course to delete.
 * If found, show the course details with a confirmation prompt.
 */
async function handleSearchToDelete(event) {
    event.preventDefault();
    hideMessage('deleteMessage');
    hideDeleteConfirm();

    var courseCode = document.getElementById('deleteSearchCode').value.trim();

    if (!courseCode) {
        showMessage('deleteMessage', 'Please enter a course code to delete.', 'error');
        return;
    }

    try {
        var response = await fetch(API_BASE_URL + '?action=search&course_code=' + encodeURIComponent(courseCode));
        var result = await response.json();

        if (result.success) {
            showMessage('deleteMessage', 'Course found. Confirm deletion below.', 'info');
            showDeleteConfirm(result.course);
        } else {
            showMessage('deleteMessage', result.message, 'error');
        }
    } catch (error) {
        showMessage('deleteMessage', 'Error connecting to server.', 'error');
    }
}

/**
 * Shows the course details and asks "Are you sure?" before deleting.
 */
function showDeleteConfirm(course) {
    var container = document.getElementById('deleteConfirmContainer');

    container.innerHTML =
        '<div class="detail-grid" style="margin-bottom:16px">' +
            '<span class="detail-label">Course Name:</span>' +
            '<span class="detail-value">' + escapeHtml(course.course_name) + '</span>' +
            '<span class="detail-label">Course Code:</span>' +
            '<span class="detail-value">' + escapeHtml(course.course_code) + '</span>' +
            '<span class="detail-label">Credit Hour:</span>' +
            '<span class="detail-value">' + course.credit_hour + '</span>' +
        '</div>' +
        '<p style="color:#dc3545;font-weight:600;margin-bottom:12px">' +
            'Are you sure you want to delete this course?' +
        '</p>' +
        '<div class="btn-group">' +
            '<button class="btn btn-danger" onclick="confirmDeleteCourse(\'' + escapeHtml(course.course_code) + '\')">Yes, Delete</button>' +
            '<button class="btn btn-secondary" onclick="hideDeleteConfirm()">Cancel</button>' +
        '</div>';

    container.classList.add('show');
}

/**
 * Hides the delete confirmation section.
 */
function hideDeleteConfirm() {
    var container = document.getElementById('deleteConfirmContainer');
    container.classList.remove('show');
    container.innerHTML = '';
}

/**
 * Step 2: Actually deletes the course after user confirms.
 */
async function confirmDeleteCourse(courseCode) {
    hideMessage('deleteMessage');

    try {
        var response = await fetch(API_BASE_URL + '?action=delete&course_code=' + encodeURIComponent(courseCode));
        var result = await response.json();

        if (result.success) {
            showMessage('deleteMessage', result.message, 'success');
            hideDeleteConfirm();
            document.getElementById('deleteSearchCode').value = '';
            loadAllCourses(); // refresh the table
        } else {
            showMessage('deleteMessage', result.message, 'error');
        }
    } catch (error) {
        showMessage('deleteMessage', 'Error connecting to server.', 'error');
    }
}


// ========== VIEW ALL COURSES ==========

/**
 * Loads all courses from the API and displays them in the table.
 * This gets called on page load and after any create/edit/delete.
 */
async function loadAllCourses() {
    var tableBody = document.getElementById('courseTableBody');

    try {
        var response = await fetch(API_BASE_URL + '?action=getAll');
        var result = await response.json();

        if (result.success && result.courses.length > 0) {
            // Build the table rows
            tableBody.innerHTML = result.courses.map(function(course, index) {
                return '<tr>' +
                    '<td>' + (index + 1) + '</td>' +
                    '<td>' + escapeHtml(course.course_code) + '</td>' +
                    '<td>' + escapeHtml(course.course_name) + '</td>' +
                    '<td>' + course.credit_hour + '</td>' +
                    '<td>' + escapeHtml(course.course_summary) + '</td>' +
                    '<td>' + (course.ms_teams_link
                        ? '<a href="' + escapeHtml(course.ms_teams_link) + '" target="_blank">Link</a>'
                        : '-') +
                    '</td>' +
                '</tr>';
            }).join('');

            // Update the counter
            var totalElement = document.getElementById('totalCourses');
            if (totalElement) {
                totalElement.textContent = 'Total: ' + result.total + ' course(s)';
            }
        } else {
            // No courses yet — show empty state
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888">No courses added yet.</td></tr>';

            var totalElement = document.getElementById('totalCourses');
            if (totalElement) {
                totalElement.textContent = 'Total: 0 course(s)';
            }
        }
    } catch (error) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#dc3545">Error loading courses.</td></tr>';
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
 * and load the courses table.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create form
    var courseForm = document.getElementById('courseForm');
    if (courseForm) {
        courseForm.addEventListener('submit', handleCreateCourse);
    }

    // Search form
    var searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchCourse);
    }

    // Edit search form
    var editSearchForm = document.getElementById('editSearchForm');
    if (editSearchForm) {
        editSearchForm.addEventListener('submit', handleSearchToEdit);
    }

    // Edit submit form
    var editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditCourse);
    }

    // Delete search form
    var deleteSearchForm = document.getElementById('deleteSearchForm');
    if (deleteSearchForm) {
        deleteSearchForm.addEventListener('submit', handleSearchToDelete);
    }

    // Load all courses into the table
    loadAllCourses();
});
=======
document.addEventListener('DOMContentLoaded',function(){
  const f1=document.getElementById('courseForm');if(f1)f1.addEventListener('submit',handleCreateCourse);
  const f2=document.getElementById('searchForm');if(f2)f2.addEventListener('submit',handleSearchCourse);
  const f3=document.getElementById('editSearchForm');if(f3)f3.addEventListener('submit',handleSearchToEdit);
  const f4=document.getElementById('editForm');if(f4)f4.addEventListener('submit',handleEditCourse);
  const f5=document.getElementById('deleteSearchForm');if(f5)f5.addEventListener('submit',handleSearchToDelete);
  loadAllCourses();
});
>>>>>>> 94816a24fdd3259137ea09aed985450724436556
