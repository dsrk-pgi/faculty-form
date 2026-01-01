# Faculty Subject Allocation Form

## Overview
This is a local web-based form for collecting faculty subject allocation data across 8 semesters of a nursing program. The form works offline and stores data locally.

## Files Structure
```
D:\faculty_data_form\
├── index.html          # Main form page
├── data_viewer.html     # View all submitted data
├── styles.css          # Styling
├── script.js           # Main functionality
├── subjects.js         # Subject data for all semesters
└── README.md           # This file
```

## How to Use

### For Faculty (Data Entry):
1. Open `index.html` in any web browser
2. Fill in faculty information (Name, Email, Faculty ID)
3. Navigate through semester tabs (1-8)
4. Check subjects you're allocated to teach
5. Enter allotted hours and completed hours for each subject
6. Click "Preview Summary" to review your data
7. Click "Submit Data" to save locally
8. Click "Export to Excel" to download your data as JSON

### For Admin (Data Collection):
1. Share the `index.html` file via WhatsApp or email
2. Faculty can fill the form offline
3. Open `data_viewer.html` to see all submitted data
4. Export all data to CSV/Excel format
5. Clear data when needed

## Features
- ✅ Works completely offline
- ✅ Mobile-friendly responsive design
- ✅ Data validation and error checking
- ✅ Progress tracking (completed vs allotted hours)
- ✅ Export individual and combined data
- ✅ Local storage backup
- ✅ Summary preview before submission

## Sharing Instructions
1. Zip the entire `faculty_data_form` folder
2. Share via WhatsApp/Email
3. Recipients extract and open `index.html`
4. No internet connection required

## Data Storage
- Data is stored in browser's localStorage
- Each faculty submission is saved separately
- Data persists until manually cleared
- Export functions create downloadable files

## Browser Compatibility
- Chrome, Firefox, Safari, Edge (all modern versions)
- Works on mobile browsers
- No plugins or extensions required

## Technical Details
- Pure HTML/CSS/JavaScript (no server required)
- Uses localStorage for data persistence
- JSON export format for easy data processing
- CSV export for Excel compatibility

## Troubleshooting
- If form doesn't load: Check if JavaScript is enabled
- If data doesn't save: Check browser storage permissions
- If export doesn't work: Try a different browser
- For mobile issues: Use landscape mode for better experience