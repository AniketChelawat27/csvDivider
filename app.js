// CSV Divider Application - Main JavaScript File

class CSVDividerApp {
    constructor() {
        this.selectedFile = null;
        this.initializeElements();
        this.bindEvents();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            fileInfo: document.getElementById('fileInfo'),
            fileName: document.getElementById('fileName'),
            fileSize: document.getElementById('fileSize'),
            form: document.getElementById('csvForm'),
            submitBtn: document.getElementById('submitBtn'),
            loading: document.getElementById('loading'),
            result: document.getElementById('result')
        };
    }

    // Bind event listeners
    bindEvents() {
        this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Drag and drop events
        this.elements.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.uploadArea.addEventListener('dragleave', () => this.handleDragLeave());
        this.elements.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
    }

    // Handle file selection
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.setSelectedFile(file);
        }
    }

    // Handle drag over
    handleDragOver(event) {
        event.preventDefault();
        this.elements.uploadArea.classList.add('dragover');
    }

    // Handle drag leave
    handleDragLeave() {
        this.elements.uploadArea.classList.remove('dragover');
    }

    // Handle file drop
    handleDrop(event) {
        event.preventDefault();
        this.elements.uploadArea.classList.remove('dragover');
        
        const file = event.dataTransfer.files[0];
        if (file && this.isValidCSVFile(file)) {
            this.setSelectedFile(file);
            this.elements.fileInput.files = event.dataTransfer.files;
        } else {
            this.showError('Please select a valid CSV file.');
        }
    }

    // Set selected file and update UI
    setSelectedFile(file) {
        this.selectedFile = file;
        this.elements.fileName.textContent = file.name;
        this.elements.fileSize.textContent = this.formatFileSize(file.size);
        this.elements.fileInfo.classList.add('show');
    }

    // Validate CSV file
    isValidCSVFile(file) {
        return file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
    }

    // Handle form submission
    async handleFormSubmit(event) {
        event.preventDefault();

        if (!this.selectedFile) {
            this.showError('Please select a CSV file first.');
            return;
        }

        const divideInto = parseInt(document.getElementById('divideInto').value);
        if (divideInto < 2) {
            this.showError('Please enter a number greater than 1.');
            return;
        }

        await this.processCSVFile(divideInto);
    }

    // Process CSV file
    async processCSVFile(divideInto) {
        this.setLoadingState(true);

        try {
            const formData = new FormData();
            formData.append('csvFile', this.selectedFile);
            formData.append('divideInto', divideInto);

            const response = await fetch('/divide-csv', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                this.showSuccessResult(data);
            } else {
                this.showError(data.error || 'An error occurred while processing the file.');
            }
        } catch (error) {
            this.showError('Error: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    // Set loading state
    setLoadingState(isLoading) {
        this.elements.submitBtn.disabled = isLoading;
        this.elements.loading.style.display = isLoading ? 'block' : 'none';
        this.elements.result.style.display = 'none';
    }

    // Show error message
    showError(message) {
        this.elements.result.textContent = message;
        this.elements.result.className = 'result error';
        this.elements.result.style.display = 'block';
    }

    // Show success result
    showSuccessResult(data) {
        const html = this.generateSuccessHTML(data);
        this.elements.result.innerHTML = html;
        this.elements.result.className = 'result success';
        this.elements.result.style.display = 'block';
    }

    // Generate success HTML
    generateSuccessHTML(data) {
        let html = `
            <h3>✅ Success!</h3>
            <p>Your CSV file has been divided into ${data.filesCreated.length} parts.</p>
            <p><strong>Total records:</strong> ${data.totalRecords}</p>
            <p><strong>Records per file:</strong> ${data.recordsPerFile}</p>
            
            <div class="download-links">
                <h4>Download your files:</h4>
        `;

        data.filesCreated.forEach((file) => {
            html += `
                <a href="/download/${file.fileName}" class="download-link" download>
                    📥 ${file.fileName} (${file.recordCount} records)
                </a>
            `;
        });

        html += '</div>';
        return html;
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Utility functions
const Utils = {
    // Format file size (alternative implementation)
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validate file type
    isValidCSV: (file) => {
        return file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');
    },

    // Show notification
    showNotification: (message, type = 'info') => {
        // Could be extended to show toast notifications
        console.log(`${type.toUpperCase()}: ${message}`);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CSVDividerApp();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CSVDividerApp, Utils };
} 