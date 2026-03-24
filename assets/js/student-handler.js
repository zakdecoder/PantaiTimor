/**
 * File: student-handler.js
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
