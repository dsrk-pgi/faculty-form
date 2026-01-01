// Add this to script.js for Google Forms integration

function submitToGoogleForm(data) {
    // Replace with your Google Form URL and field IDs
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
    
    const formData = new FormData();
    formData.append('entry.FACULTY_NAME_ID', data.faculty.name);
    formData.append('entry.FACULTY_EMAIL_ID', data.faculty.email);
    formData.append('entry.FACULTY_ID_ID', data.faculty.id);
    formData.append('entry.SUBJECTS_DATA_ID', JSON.stringify(data.subjects));
    
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    }).then(() => {
        alert('Data submitted to Google Forms successfully!');
    }).catch(() => {
        alert('Please submit manually via email.');
    });
}

// Steps to set up:
// 1. Create a Google Form with fields: Faculty Name, Email, ID, Subjects Data
// 2. Get the form URL and field entry IDs
// 3. Replace the URL and IDs in the code above
// 4. Add submitToGoogleForm(submissionData) to your submit function