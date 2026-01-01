let currentSemester = 1;
let facultyData = {};

function showSemester(semester) {
    currentSemester = semester;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Generate semester content
    const content = document.getElementById('semesterContent');
    const subjects = subjectsData[semester];
    
    let html = `<h3>Semester ${semester} Subjects</h3><div class="subjects-grid">`;
    
    subjects.forEach(subject => {
        const key = `sem${semester}_${subject.code}`;
        const savedData = facultyData[key] || { allocated: false, allottedHours: 0, completedHours: 0 };
        
        html += `
            <div class="subject-card">
                <div class="subject-header">
                    <input type="checkbox" id="${key}_check" ${savedData.allocated ? 'checked' : ''} 
                           onchange="toggleSubject('${key}', this.checked)">
                    <label for="${key}_check">
                        <strong>${subject.code}</strong><br>
                        ${subject.title}<br>
                        <small>Credits: ${subject.credits} | Total Hours: ${subject.hours}</small>
                    </label>
                </div>
                <div class="subject-inputs" id="${key}_inputs" style="display: ${savedData.allocated ? 'block' : 'none'}">
                    <div class="hours-group">
                        <label>Allotted Hours</label>
                        <input type="number" placeholder="0" value="${savedData.allottedHours}" 
                               onchange="updateHours('${key}', 'allottedHours', this.value)">
                    </div>
                    <div class="hours-group">
                        <label>Completed Hours</label>
                        <input type="number" placeholder="0" value="${savedData.completedHours}"
                               onchange="updateHours('${key}', 'completedHours', this.value)">
                    </div>
                    <div class="hours-group">
                        <label>Remaining Hours</label>
                        <input type="number" id="${key}_left" value="${savedData.allottedHours - savedData.completedHours}" readonly>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
}

function toggleSubject(key, allocated) {
    if (!facultyData[key]) facultyData[key] = {};
    facultyData[key].allocated = allocated;
    
    const inputs = document.getElementById(`${key}_inputs`);
    inputs.style.display = allocated ? 'block' : 'none';
    
    if (!allocated) {
        facultyData[key].allottedHours = 0;
        facultyData[key].completedHours = 0;
    }
}

function updateHours(key, type, value) {
    if (!facultyData[key]) facultyData[key] = {};
    facultyData[key][type] = parseInt(value) || 0;
    
    // Update left hours automatically
    const allotted = facultyData[key].allottedHours || 0;
    const completed = facultyData[key].completedHours || 0;
    const leftHours = allotted - completed;
    
    const leftInput = document.getElementById(`${key}_left`);
    if (leftInput) {
        leftInput.value = leftHours;
    }
}

function showSummary() {
    const name = document.getElementById('facultyName').value;
    const email = document.getElementById('facultyEmail').value;
    const id = document.getElementById('facultyId').value;
    
    if (!name || !email || !id) {
        alert('Please fill in all faculty information first.');
        return;
    }
    
    let summaryHtml = `
        <div class="faculty-summary">
            <h3>Faculty: ${name} (${id})</h3>
            <p>Email: ${email}</p>
        </div>
        <div class="subjects-summary">
    `;
    
    for (let sem = 1; sem <= 8; sem++) {
        const semesterSubjects = Object.keys(facultyData)
            .filter(key => key.startsWith(`sem${sem}_`) && facultyData[key].allocated)
            .map(key => {
                const code = key.split('_')[1];
                const subject = subjectsData[sem].find(s => s.code === code);
                return {
                    ...subject,
                    ...facultyData[key]
                };
            });
        
        if (semesterSubjects.length > 0) {
            summaryHtml += `
                <h4>Semester ${sem}</h4>
                <table class="summary-table">
                    <tr>
                        <th>Subject Code</th>
                        <th>Subject Title</th>
                        <th>Allotted Hours</th>
                        <th>Completed Hours</th>
                        <th>Remaining Hours</th>
                        <th>Progress</th>
                    </tr>
            `;
            
            semesterSubjects.forEach(subject => {
                const progress = subject.allottedHours > 0 ? 
                    Math.round((subject.completedHours / subject.allottedHours) * 100) : 0;
                summaryHtml += `
                    <tr>
                        <td>${subject.code}</td>
                        <td>${subject.title}</td>
                        <td>${subject.allottedHours}</td>
                        <td>${subject.completedHours}</td>
                        <td>${subject.allottedHours - subject.completedHours}</td>
                        <td>${progress}%</td>
                    </tr>
                `;
            });
            summaryHtml += '</table>';
        }
    }
    
    summaryHtml += '</div>';
    document.getElementById('summaryContent').innerHTML = summaryHtml;
    document.getElementById('summarySection').style.display = 'block';
    
    // Scroll to summary
    document.getElementById('summarySection').scrollIntoView({ behavior: 'smooth' });
}

function exportData() {
    const name = document.getElementById('facultyName').value;
    const email = document.getElementById('facultyEmail').value;
    const id = document.getElementById('facultyId').value;
    
    if (!name || !email || !id) {
        alert('Please fill in all faculty information first.');
        return;
    }
    
    const exportData = {
        faculty: { name, email, id },
        subjects: facultyData,
        timestamp: new Date().toISOString()
    };
    
    // Create WhatsApp message
    const message = `Faculty Data Submission:\n\nName: ${name}\nID: ${id}\nEmail: ${email}\n\nSubjects: ${JSON.stringify(facultyData, null, 2)}`;
    const whatsappUrl = `https://wa.me/919140878191?text=${encodeURIComponent(message)}`;
    
    // Also create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `faculty_data_${id}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    // Open WhatsApp
    if (confirm('Send data via WhatsApp?')) {
        window.open(whatsappUrl);
    }
}

document.getElementById('facultyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('facultyName').value;
    const email = document.getElementById('facultyEmail').value;
    const id = document.getElementById('facultyId').value;
    
    if (!name || !email || !id) {
        alert('Please fill in all faculty information.');
        return;
    }
    
    // Save to localStorage
    const submissionData = {
        faculty: { name, email, id },
        subjects: facultyData,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`faculty_${id}`, JSON.stringify(submissionData));
    
    // Auto-send email with data
    const emailBody = `Faculty Data Submission:\n\nName: ${name}\nID: ${id}\nEmail: ${email}\n\nData: ${JSON.stringify(submissionData, null, 2)}`;
    const mailtoLink = `mailto:rkrajesh.pgi@gmail.com?subject=Faculty Data - ${name}&body=${encodeURIComponent(emailBody)}`;
    
    alert('Data saved! Please send the email that will open.');
    window.open(mailtoLink);
    exportData();
});

// Initialize with semester 1
document.addEventListener('DOMContentLoaded', function() {
    showSemester(1);
});
