let currentSemester = 1;
let facultyData = {};

/**
 * Handles the display of subjects based on the selected tab (Semester/Year).
 * @param {string|number} semester - The identifier for the subjects to show.
 */
function showSemester(semester) {
    currentSemester = semester;

    // 1. Update Tab Button UI
    // We use a robust selector to find the active button even if the 'event' object is missing.
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        const clickAttr = btn.getAttribute('onclick');
        if (clickAttr && (clickAttr.includes(`'${semester}'`) || clickAttr.includes(`(${semester})`))) {
            btn.classList.add('active');
        }
    });

    const content = document.getElementById('semesterContent');
    
    // Safety check: subjectsData must be defined in your separate subjects.js file
    if (typeof subjectsData === 'undefined') {
        content.innerHTML = "<p style='color:red; padding:20px;'>Error: subjectsData not found. Please ensure subjects.js is loaded.</p>";
        return;
    }

    const subjects = subjectsData[semester] || [];

    // 2. Format Header Label for UI
    let headerLabel = "";
    if (semester === "BSC4") {
        headerLabel = "B.Sc. 4th Year";
    } else if (isNaN(semester)) {
        headerLabel = `M.Sc. ${semester.replace('MSC', '')}${semester.includes('1') ? 'st' : 'nd'} Year`;
    } else {
        headerLabel = `Semester ${semester}`;
    }

    let html = `<h3>${headerLabel} Subjects</h3><div class="subjects-grid">`;

    if (subjects.length === 0) {
        html += `<p style="padding: 20px; color: #666;">No subjects found for this selection.</p>`;
    }

    subjects.forEach(subject => {
        const key = `sem${semester}_${subject.code}`;
        const savedData = facultyData[key] || {
            allocated: false,
            allottedHours: 0,
            completedHours: 0,
            asOnDate: new Date().toISOString().split('T')[0]
        };

        html += `
            <div class="subject-card">
                <div class="subject-header">
                    <input type="checkbox" id="${key}_check"
                        ${savedData.allocated ? 'checked' : ''}
                        onchange="toggleSubject('${key}', this.checked)">
                    <label for="${key}_check">
                        <strong>${subject.code}</strong><br>
                        ${subject.title}
                    </label>
                </div>

                <div class="subject-inputs" id="${key}_inputs"
                    style="display:${savedData.allocated ? 'block' : 'none'}">

                    <div class="hours-group">
                        <label>Allotted Hours</label>
                        <input type="number" placeholder="0"
                            value="${savedData.allottedHours}"
                            onchange="updateHours('${key}', 'allottedHours', this.value)">
                    </div>

                    <div class="hours-group">
                        <label>Completed Hours</label>
                        <input type="number" placeholder="0"
                            value="${savedData.completedHours}"
                            onchange="updateHours('${key}', 'completedHours', this.value)">
                    </div>

                    <div class="hours-group">
                        <label>As on Date</label>
                        <input type="date"
                            value="${savedData.asOnDate}"
                            onchange="updateDate('${key}', this.value)">
                    </div>

                    <div class="hours-group">
                        <label>Remaining</label>
                        <input type="number"
                            id="${key}_left"
                            value="${savedData.allottedHours - savedData.completedHours}"
                            readonly>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    content.innerHTML = html;
}

function toggleSubject(key, allocated) {
    if (!facultyData[key]) {
        facultyData[key] = {
            allottedHours: 0,
            completedHours: 0,
            asOnDate: new Date().toISOString().split('T')[0]
        };
    }
    facultyData[key].allocated = allocated;
    const inputDiv = document.getElementById(`${key}_inputs`);
    if (inputDiv) inputDiv.style.display = allocated ? 'block' : 'none';
}

function updateHours(key, type, value) {
    if (!facultyData[key]) facultyData[key] = {};
    facultyData[key][type] = parseInt(value) || 0;
    
    const allotted = facultyData[key].allottedHours || 0;
    const completed = facultyData[key].completedHours || 0;
    const leftInput = document.getElementById(`${key}_left`);
    if (leftInput) leftInput.value = allotted - completed;
}

function updateDate(key, value) {
    if (!facultyData[key]) facultyData[key] = {};
    facultyData[key].asOnDate = value;
}

function showSummary() {
    const name = document.getElementById('facultyName').value;
    const email = document.getElementById('facultyEmail').value;
    const id = document.getElementById('facultyId').value;

    if (!name || !id) {
        alert('Please fill in Faculty Name and ID before previewing.');
        return;
    }

    let summaryHtml = `<div class="faculty-summary"><h3>Faculty: ${name} (${id})</h3><p>Email: ${email}</p></div>`;

    // Define all possible keys to check for summary
    const checkKeys = [1, 2, 3, 4, 5, 6, 7, 8, 'BSC4', 'MSC1', 'MSC2'];

    checkKeys.forEach(sem => {
        const semesterSubjects = Object.keys(facultyData)
            .filter(k => k.startsWith(`sem${sem}_`) && facultyData[k].allocated)
            .map(k => {
                const code = k.split('_')[1];
                const subject = subjectsData[sem].find(s => s.code === code);
                return { ...subject, ...facultyData[k] };
            });

        if (semesterSubjects.length === 0) return;

        let label = (sem === 'BSC4') ? "B.Sc. 4th Year" : (isNaN(sem) ? `M.Sc. ${sem}` : `Semester ${sem}`);

        summaryHtml += `
            <h4>${label}</h4>
            <table class="summary-table" border="1" style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>Code</th><th>Title</th><th>Allotted</th><th>Completed</th><th>Remaining</th><th>As on</th>
                    </tr>
                </thead>
                <tbody>
        `;

        semesterSubjects.forEach(s => {
            summaryHtml += `
                <tr>
                    <td>${s.code}</td>
                    <td>${s.title}</td>
                    <td align="center">${s.allottedHours}</td>
                    <td align="center">${s.completedHours}</td>
                    <td align="center">${s.allottedHours - s.completedHours}</td>
                    <td align="center">${s.asOnDate}</td>
                </tr>
            `;
        });
        summaryHtml += '</tbody></table>';
    });

    const summarySection = document.getElementById('summarySection');
    document.getElementById('summaryContent').innerHTML = summaryHtml;
    summarySection.style.display = 'block';
    summarySection.scrollIntoView({ behavior: 'smooth' });
}

function exportData() {
    const name = document.getElementById('facultyName').value;
    const id = document.getElementById('facultyId').value;

    if (!name || !id) {
        alert('Please fill in Faculty Name and ID.');
        return;
    }

    const payload = {
        faculty: { name, id, email: document.getElementById('facultyEmail').value },
        data: facultyData,
        submittedAt: new Date().toLocaleString()
    };

    const msg = `Faculty Report: ${name} (${id})\nData: ${JSON.stringify(payload, null, 2)}`;
    const waUrl = `https://wa.me/919140878191?text=${encodeURIComponent(msg)}`;
    window.open(waUrl);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initial load for Semester 1
    showSemester(1);
    
    // Form submission event
    const form = document.getElementById('facultyForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            exportData();
        });
    }
});