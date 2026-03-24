/**
 * File: course-handler.js
 * Author: Muhammad Zakariyya Bin Ahmad Radzif
 * Date: 02/03/2026
 * Description: JavaScript handler for Course Profile page. Handles Create, Search, Edit, Delete and View All.
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
}
function showDeleteConfirm(c){const el=document.getElementById('deleteConfirmContainer');el.innerHTML=`<div class="detail-grid" style="margin-bottom:16px"><span class="detail-label">Course Name:</span><span class="detail-value">${escapeHtml(c.course_name)}</span><span class="detail-label">Course Code:</span><span class="detail-value">${escapeHtml(c.course_code)}</span><span class="detail-label">Credit Hour:</span><span class="detail-value">${c.credit_hour}</span></div><p style="color:#dc3545;font-weight:600;margin-bottom:12px">Are you sure you want to delete this course?</p><div class="btn-group"><button class="btn btn-danger" onclick="confirmDeleteCourse('${escapeHtml(c.course_code)}')">Yes, Delete</button><button class="btn btn-secondary" onclick="hideDeleteConfirm()">Cancel</button></div>`;el.classList.add('show');}
function hideDeleteConfirm(){const el=document.getElementById('deleteConfirmContainer');el.classList.remove('show');el.innerHTML='';}
async function confirmDeleteCourse(code){hideMessage('deleteMessage');try{const r=await fetch(API_BASE_URL+'?action=delete&course_code='+encodeURIComponent(code));const res=await r.json();if(res.success){showMessage('deleteMessage',res.message,'success');hideDeleteConfirm();document.getElementById('deleteSearchCode').value='';loadAllCourses();}else{showMessage('deleteMessage',res.message,'error');}}catch(err){showMessage('deleteMessage','Error connecting to server.','error');}}

async function loadAllCourses(){
  const tbody=document.getElementById('courseTableBody');
  try{const r=await fetch(API_BASE_URL+'?action=getAll');const res=await r.json();
    if(res.success&&res.courses.length>0){tbody.innerHTML=res.courses.map((c,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(c.course_code)}</td><td>${escapeHtml(c.course_name)}</td><td>${c.credit_hour}</td><td>${escapeHtml(c.course_summary)}</td><td>${c.ms_teams_link?'<a href="'+escapeHtml(c.ms_teams_link)+'" target="_blank">Link</a>':'-'}</td></tr>`).join('');
      const t=document.getElementById('totalCourses');if(t)t.textContent='Total: '+res.total+' course(s)';
    }else{tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:#888">No courses added yet.</td></tr>';const t=document.getElementById('totalCourses');if(t)t.textContent='Total: 0 course(s)';}
  }catch(err){tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:#dc3545">Error loading courses.</td></tr>';}
}
function escapeHtml(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML;}

document.addEventListener('DOMContentLoaded',function(){
  const f1=document.getElementById('courseForm');if(f1)f1.addEventListener('submit',handleCreateCourse);
  const f2=document.getElementById('searchForm');if(f2)f2.addEventListener('submit',handleSearchCourse);
  const f3=document.getElementById('editSearchForm');if(f3)f3.addEventListener('submit',handleSearchToEdit);
  const f4=document.getElementById('editForm');if(f4)f4.addEventListener('submit',handleEditCourse);
  const f5=document.getElementById('deleteSearchForm');if(f5)f5.addEventListener('submit',handleSearchToDelete);
  loadAllCourses();
});
