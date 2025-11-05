// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// File upload functionality
const uploadArea = document.getElementById('uploadArea');
const resumeFile = document.getElementById('resumeFile');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const analyzeButton = document.getElementById('analyzeButton');
const jobRequirements = document.getElementById('jobRequirements');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultsSection = document.getElementById('resultsSection');
const analysisResults = document.getElementById('analysisResults');

let selectedFile = null;

// Click to upload
uploadArea.addEventListener('click', (e) => {
    if (e.target !== removeFile) {
        resumeFile.click();
    }
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// File input change
resumeFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Handle file selection
function handleFileSelect(file) {
    const validTypes = ['.pdf', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showError('Please upload a PDF, DOCX, or TXT file.');
        return;
    }
    
    if (file.size > 16 * 1024 * 1024) {
        showError('File size must be less than 16MB.');
        return;
    }
    
    selectedFile = file;
    fileName.textContent = file.name;
    uploadPlaceholder.style.display = 'none';
    fileInfo.style.display = 'flex';
}

// Remove file
removeFile.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFile = null;
    resumeFile.value = '';
    uploadPlaceholder.style.display = 'flex';
    fileInfo.style.display = 'none';
});

// Analyze resume
analyzeButton.addEventListener('click', async () => {
    // Validation
    if (!selectedFile) {
        showError('Please upload a resume first.');
        return;
    }
    
    if (!jobRequirements.value.trim()) {
        showError('Please enter job requirements.');
        return;
    }
    
    // Show loading
    loadingOverlay.style.display = 'flex';
    resultsSection.style.display = 'none';
    
    // Prepare form data
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('job_requirements', jobRequirements.value.trim());
    
    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayResults(data.analysis);
        } else {
            showError(data.error || 'An error occurred during analysis.');
        }
    } catch (error) {
        showError('Failed to connect to the server. Please try again.');
        console.error('Error:', error);
    } finally {
        loadingOverlay.style.display = 'none';
    }
});

// Display analysis results
function displayResults(analysis) {
    // Convert markdown-style formatting to HTML
    let htmlContent = analysis
        .replace(/\*\*SCORE:\s*(\d+)\/100\*\*/gi, '<div class="score-badge">Score: $1/100</div>')
        .replace(/\*\*([^*]+)\*\*/g, '<h3>$1</h3>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</ul><p></p><ul>')
        .replace(/<li>/g, '<ul><li>')
        .replace(/<\/li>\n(?!<li>)/g, '</li></ul>');
    
    // Clean up extra ul tags
    htmlContent = htmlContent.replace(/<ul>\s*<\/ul>/g, '');
    htmlContent = htmlContent.replace(/<ul>(<ul>)/g, '$1');
    htmlContent = htmlContent.replace(/(<\/ul>)<\/ul>/g, '$1');
    
    analysisResults.innerHTML = htmlContent;
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show error message
function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
