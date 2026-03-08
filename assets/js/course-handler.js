/**
 * File: course-handler.js
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Date: 23/02/2026
 * Description: JavaScript handler for Course Profile page.
 *              Handles form submission (Create) and Search functionality.
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

  // Collect form data
  const courseData = {
    course_name: document.getElementById('courseName').value.trim(),
    course_code: document.getElementById('courseCode').value.trim(),
    credit_hour: parseInt(document.getElementById('creditHour').value),
    course_summary: document.getElementById('courseSummary').value.trim(),
    ms_teams_link: document.getElementById('msTeamsLink').value.trim()
  };

  // Frontend validation
  const errors = validateCourseInput(courseData);
  if (errors.length > 0) {
    showMessage('createMessage', errors.join(' '), 'error');
    return;
  }

  try {
    // Send data to API
    const response = await fetch(API_BASE_URL + '?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });

    const result = await response.json();

    if (result.success) {
      showMessage('createMessage', result.message, 'success');
      document.getElementById('courseForm').reset();
      // Refresh the course list
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

// ========== VIEW ALL COURSES ==========

/**
 * Loads and displays all courses in the table.
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
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #888;">
            No courses added yet.
          </td>
        </tr>
      `;
    }
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #dc3545;">
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

  // Load all courses on page load
  loadAllCourses();
});
