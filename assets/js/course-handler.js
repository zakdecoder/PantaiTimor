/**
 * File: course-handler.js
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Date: 02/03/2026
 * Description: JavaScript handler for Course Profile page.
 *              Handles Create, Search, Edit, Delete and View All.
 */

const API_BASE_URL = '../api/course-controller.php';

// ========== MESSAGE DISPLAY ==========

/**
 * Displays a message to the user.
 * @param {string} elementId The ID of the message element.
 * @param {string} text The message text.
 * @param {string} type The message type: success, error, or info.
 */
function showMessage(elementId, text, type) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = 'message show message-' + type;
}

/**
 * Hides a message element.
 * @param {string} elementId The ID of the message element.
 */
function hideMessage(elementId) {
  const el = document.getElementById(elementId);
  el.className = 'message';
}

// ========== CREATE COURSE ==========

/**
 * Handles the course creation form submission.
 * Validates input on the frontend before sending to the API.
 */
async function handleCreateCourse(event) {
  event.preventDefault();
  hideMessage('createMessage');

  const courseData = {
    course_name: document.getElementById('courseName').value.trim(),
    course_code: document.getElementById('courseCode').value.trim(),
    credit_hour: parseInt(document.getElementById('creditHour').value),
    course_summary: document.getElementById('courseSummary').value.trim(),
    ms_teams_link: document.getElementById('msTeamsLink').value.trim()
  };

  const errors = validateCourseInput(courseData);
  if (errors.length > 0) {
    showMessage('createMessage', errors.join(' '), 'error');
    return;
  }

  try {
    const response = await fetch(API_BASE_URL + '?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });

    const result = await response.json();

    if (result.success) {
      showMessage('createMessage', result.message, 'success');
      document.getElementById('courseForm').reset();
      loadAllCourses();
    } else {
      showMessage('createMessage', result.message, 'error');
    }
  } catch (error) {
    showMessage('createMessage', 'Error connecting to server.', 'error');
  }
}

/**
 * Validates course input data on the frontend.
 * @param {Object} data The course data to validate.
 * @return {Array} Array of error messages. Empty if valid.
 */
function validateCourseInput(data) {
  const errors = [];

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
 * Handles the course search by course code.
 * Uses the API linear search endpoint.
 */
async function handleSearchCourse(event) {
  event.preventDefault();
  hideMessage('searchMessage');
  hideSearchResult();

  const courseCode = document.getElementById('searchCode').value.trim();

  if (!courseCode) {
    showMessage('searchMessage', 'Please enter a course code to search.', 'error');
    return;
  }

  try {
    const response = await fetch(
      API_BASE_URL + '?action=search&course_code=' + encodeURIComponent(courseCode)
    );

    const result = await response.json();

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
 * Displays the search result in the detail view.
 * @param {Object} course The course data to display.
 */
function displaySearchResult(course) {
  const container = document.getElementById('searchResult');
  container.innerHTML = `
    <div class="detail-grid">
      <span class="detail-label">Course Name:</span>
      <span class="detail-value">${escapeHtml(course.course_name)}</span>
      <span class="detail-label">Course Code:</span>
      <span class="detail-value">${escapeHtml(course.course_code)}</span>
      <span class="detail-label">Credit Hour:</span>
      <span class="detail-value">${course.credit_hour}</span>
      <span class="detail-label">Summary:</span>
      <span class="detail-value">${escapeHtml(course.course_summary)}</span>
      <span class="detail-label">MS Teams Link:</span>
      <span class="detail-value">${course.ms_teams_link ? '<a href="' + escapeHtml(course.ms_teams_link) + '" target="_blank">' + escapeHtml(course.ms_teams_link) + '</a>' : '-'}</span>
    </div>
  `;
  container.classList.add('show');
}

/**
 * Hides the search result display.
 */
function hideSearchResult() {
  const container = document.getElementById('searchResult');
  container.classList.remove('show');
  container.innerHTML = '';
}

// ========== EDIT COURSE ==========

/**
 * Searches for a course to edit, then populates the edit form.
 */
async function handleSearchToEdit(event) {
  event.preventDefault();
  hideMessage('editMessage');
  hideEditForm();

  const courseCode = document.getElementById('editSearchCode').value.trim();

  if (!courseCode) {
    showMessage('editMessage', 'Please enter a course code to edit.', 'error');
    return;
  }

  try {
    const response = await fetch(
      API_BASE_URL + '?action=search&course_code=' + encodeURIComponent(courseCode)
    );

    const result = await response.json();

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
 * Populates the edit form with course data.
 * Course code is displayed but not editable.
 * @param {Object} course The course data to populate.
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
 * Submits the edited course data to the API.
 */
async function handleEditCourse(event) {
  event.preventDefault();
  hideMessage('editMessage');

  const courseData = {
    course_code: document.getElementById('editCourseCode').value.trim(),
    course_name: document.getElementById('editCourseName').value.trim(),
    credit_hour: parseInt(document.getElementById('editCreditHour').value),
    course_summary: document.getElementById('editCourseSummary').value.trim(),
    ms_teams_link: document.getElementById('editMsTeamsLink').value.trim()
  };

  const errors = validateCourseInput(courseData);
  if (errors.length > 0) {
    showMessage('editMessage', errors.join(' '), 'error');
    return;
  }

  try {
    const response = await fetch(API_BASE_URL + '?action=edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });

    const result = await response.json();

    if (result.success) {
      showMessage('editMessage', result.message, 'success');
      // Display the edited course to validate changes
      displayEditedCourse(result.course);
      loadAllCourses();
    } else {
      showMessage('editMessage', result.message, 'error');
    }
  } catch (error) {
    showMessage('editMessage', 'Error connecting to server.', 'error');
  }
}

/**
 * Displays the edited course details after successful update.
 * @param {Object} course The updated course data.
 */
function displayEditedCourse(course) {
  const container = document.getElementById('editedResult');
  container.innerHTML = `
    <h3 style="font-size:14px; color:#1f4e79; margin-bottom:8px;">Updated Course Details:</h3>
    <div class="detail-grid">
      <span class="detail-label">Course Name:</span>
      <span class="detail-value">${escapeHtml(course.course_name)}</span>
      <span class="detail-label">Course Code:</span>
      <span class="detail-value">${escapeHtml(course.course_code)}</span>
      <span class="detail-label">Credit Hour:</span>
      <span class="detail-value">${course.credit_hour}</span>
      <span class="detail-label">Summary:</span>
      <span class="detail-value">${escapeHtml(course.course_summary)}</span>
      <span class="detail-label">MS Teams Link:</span>
      <span class="detail-value">${course.ms_teams_link ? escapeHtml(course.ms_teams_link) : '-'}</span>
    </div>
  `;
  container.classList.add('show');
}

// ========== DELETE COURSE ==========

/**
 * Searches for a course to delete, then shows course info with confirm button.
 */
async function handleSearchToDelete(event) {
  event.preventDefault();
  hideMessage('deleteMessage');
  hideDeleteConfirm();

  const courseCode = document.getElementById('deleteSearchCode').value.trim();

  if (!courseCode) {
    showMessage('deleteMessage', 'Please enter a course code to delete.', 'error');
    return;
  }

  try {
    const response = await fetch(
      API_BASE_URL + '?action=search&course_code=' + encodeURIComponent(courseCode)
    );

    const result = await response.json();

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
 * Shows course details and confirm/cancel buttons for deletion.
 * @param {Object} course The course to be deleted.
 */
function showDeleteConfirm(course) {
  const container = document.getElementById('deleteConfirmContainer');
  container.innerHTML = `
    <div class="detail-grid" style="margin-bottom: 16px;">
      <span class="detail-label">Course Name:</span>
      <span class="detail-value">${escapeHtml(course.course_name)}</span>
      <span class="detail-label">Course Code:</span>
      <span class="detail-value">${escapeHtml(course.course_code)}</span>
      <span class="detail-label">Credit Hour:</span>
      <span class="detail-value">${course.credit_hour}</span>
      <span class="detail-label">Summary:</span>
      <span class="detail-value">${escapeHtml(course.course_summary)}</span>
    </div>
    <p style="color: #dc3545; font-weight: 600; margin-bottom: 12px;">
      Are you sure you want to delete this course?
    </p>
    <div class="btn-group">
      <button class="btn btn-danger" onclick="confirmDeleteCourse('${escapeHtml(course.course_code)}')">
        Yes, Delete
      </button>
      <button class="btn btn-secondary" onclick="hideDeleteConfirm()">
        Cancel
      </button>
    </div>
  `;
  container.classList.add('show');
}

/**
 * Hides the delete confirmation section.
 */
function hideDeleteConfirm() {
  const container = document.getElementById('deleteConfirmContainer');
  container.classList.remove('show');
  container.innerHTML = '';
}

/**
 * Confirms and executes the course deletion.
 * @param {string} courseCode The course code to delete.
 */
async function confirmDeleteCourse(courseCode) {
  hideMessage('deleteMessage');

  try {
    const response = await fetch(
      API_BASE_URL + '?action=delete&course_code=' + encodeURIComponent(courseCode)
    );

    const result = await response.json();

    if (result.success) {
      showMessage('deleteMessage', result.message, 'success');
      hideDeleteConfirm();
      document.getElementById('deleteSearchCode').value = '';
      // Refresh the course list to validate deletion
      loadAllCourses();
    } else {
      showMessage('deleteMessage', result.message, 'error');
    }
  } catch (error) {
    showMessage('deleteMessage', 'Error connecting to server.', 'error');
  }
}

// ========== VIEW ALL COURSES ==========

/**
 * Loads and displays all courses in the table.
 * Invoked after Create, Edit, or Delete to show updated list.
 */
async function loadAllCourses() {
  const tbody = document.getElementById('courseTableBody');

  try {
    const response = await fetch(API_BASE_URL + '?action=getAll');
    const result = await response.json();

    if (result.success && result.courses.length > 0) {
      tbody.innerHTML = result.courses.map(function(course, index) {
        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(course.course_code)}</td>
            <td>${escapeHtml(course.course_name)}</td>
            <td>${course.credit_hour}</td>
            <td>${escapeHtml(course.course_summary)}</td>
            <td>${course.ms_teams_link ? '<a href="' + escapeHtml(course.ms_teams_link) + '" target="_blank">Link</a>' : '-'}</td>
          </tr>
        `;
      }).join('');

      // Update total count
      const totalEl = document.getElementById('totalCourses');
      if (totalEl) {
        totalEl.textContent = 'Total: ' + result.total + ' course(s)';
      }
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: #888;">
            No courses added yet.
          </td>
        </tr>
      `;
      const totalEl = document.getElementById('totalCourses');
      if (totalEl) {
        totalEl.textContent = 'Total: 0 course(s)';
      }
    }
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #dc3545;">
          Error loading courses. Make sure Apache/PHP is running.
        </td>
      </tr>
    `;
  }
}

// ========== UTILITY ==========

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} text The text to escape.
 * @return {string} The escaped text.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  // Bind create form
  const courseForm = document.getElementById('courseForm');
  if (courseForm) {
    courseForm.addEventListener('submit', handleCreateCourse);
  }

  // Bind search form
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearchCourse);
  }

  // Bind edit search form
  const editSearchForm = document.getElementById('editSearchForm');
  if (editSearchForm) {
    editSearchForm.addEventListener('submit', handleSearchToEdit);
  }

  // Bind edit submit form
  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', handleEditCourse);
  }

  // Bind delete search form
  const deleteSearchForm = document.getElementById('deleteSearchForm');
  if (deleteSearchForm) {
    deleteSearchForm.addEventListener('submit', handleSearchToDelete);
  }

  // Load all courses on page load
  loadAllCourses();
});
