let currentSemester = 1;
let facultyData = {};

function showSemester(semester) {
    currentSemester = semester;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event) event.target.classList.add('active');

    const content = document.getElementById('semesterContent');
    const subjects = subjectsData[semester] || [];

    // Format header based on type (Semester vs M.Sc.)
    let headerLabel = isNaN(semester) ? 
        `M.Sc. ${semester.replace('MSC', '')}${semester.includes('1') ? 'st' : 'nd'} Year` : 
        `Semester ${semester}`;

    let html = `<h3>${headerLabel} Subjects</h3><div class="subjects-grid">`;

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
                        <label>As on</label>
                        <input type="date"
                            value="${savedData.asOnDate}"
                            onchange="updateDate('${key}', this.value)">
                    </div>

                    <div class="hours-group">
                        <label>Remaining Hours</label>
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
    document.getElementById(`${key}_inputs`).style.display = allocated ? 'block' : 'none';
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

    if (!name || !email || !id) {
        alert('Please fill in all faculty information first.');
        return;
    }

    let summaryHtml = `<div class="faculty-summary"><h3>Faculty: ${name} (${id})</h3><p>Email: ${email}</p></div>`;

    const checkKeys = [1, 2, 3, 4, 5, 6, 7, 8, 'MSC1', 'MSC2'];

    checkKeys.forEach(sem => {
        const semesterSubjects = Object.keys(facultyData)
            .filter(k => k.startsWith(`sem${sem}_`) && facultyData[k].allocated)
            .map(k => {
                const code = k.split('_')[1];
                const subject = subjectsData[sem].find(s => s.code === code);
                return { ...subject, ...facultyData[k] };
            });

        if (!semesterSubjects.length) return;

        let tableHeader = isNaN(sem) ? 
            `M.Sc. ${sem.replace('MSC', '')}${sem.includes('1') ? 'st' : 'nd'} Year` : 
            `Semester ${sem}`;

        summaryHtml += `
            <h4>${tableHeader}</h4>
            <table class="summary-table">
                <tr><th>Code</th><th>Title</th><th>Allotted</th><th>Completed</th><th>Remaining</th><th>As on</th></tr>
        `;

        semesterSubjects.forEach(s => {
            summaryHtml += `
                <tr>
                    <td>${s.code}</td>
                    <td>${s.title}</td>
                    <td>${s.allottedHours}</td>
                    <td>${s.completedHours}</td>
                    <td>${s.allottedHours - s.completedHours}</td>
                    <td>${s.asOnDate}</td>
                </tr>
            `;
        });
        summaryHtml += '</table>';
    });

    const summarySection = document.getElementById('summarySection');
    document.getElementById('summaryContent').innerHTML = summaryHtml;
    summarySection.style.display = 'block';
    summarySection.scrollIntoView({ behavior: 'smooth' });
}

function exportData() {
    const payload = {
        faculty: { 
            name: document.getElementById('facultyName').value, 
            email: document.getElementById('facultyEmail').value, 
            id: document.getElementById('facultyId').value 
        },
        subjects: facultyData,
        timestamp: new Date().toISOString()
    };

    const msg = `Faculty Data:\n${JSON.stringify(payload, null, 2)}`;
    const waUrl = `https://wa.me/919140878191?text=${encodeURIComponent(msg)}`;
    window.open(waUrl);
}

document.getElementById('facultyForm').addEventListener('submit', e => {
    e.preventDefault();
    exportData();
});

document.addEventListener('DOMContentLoaded', () => showSemester(1));