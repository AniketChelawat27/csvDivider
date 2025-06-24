const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { divideCSV } = require('./csvDivider');

// Configuration
const CONFIG = {
    PORT: process.env.PORT || 3001,
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
    UPLOAD_DIR: 'uploads',
    OUTPUT_DIR: 'divided_csvs'
};

// Initialize Express app
const app = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, CONFIG.UPLOAD_DIR);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `csv-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (isValidCSVFile(file)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed!'), false);
        }
    },
    limits: {
        fileSize: CONFIG.MAX_FILE_SIZE
    }
});

// Utility functions
function isValidCSVFile(file) {
    return file.mimetype === 'text/csv' || 
           path.extname(file.originalname).toLowerCase() === '.csv';
}

function cleanupFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Error cleaning up file:', error);
        }
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Serve React app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.post('/api/divide-csv', upload.single('csvFile'), async (req, res) => {
    let uploadedFilePath = null;
    
    try {
        // Validate request
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        uploadedFilePath = req.file.path;
        const divideInto = parseInt(req.body.divideInto) || 2;
        const uploadedUrl = req.body.uploadedUrl; // Get the uploaded URL from external API
        
        if (!divideInto || divideInto < 2) {
            return res.status(400).json({
                success: false,
                error: 'Invalid division number. Must be 2 or greater.'
            });
        }

        console.log(`Processing file: ${req.file.originalname}`);
        console.log(`Uploaded URL: ${uploadedUrl}`);
        console.log(`Dividing into: ${divideInto} parts`);

        // Process the CSV file
        const result = await divideCSV(uploadedFilePath, divideInto);
        
        // Add download URLs to the result instead of AWS URLs
        if (result.success && result.filesCreated) {
            result.filesCreated = result.filesCreated.map(file => ({
                ...file,
                downloadUrl: `${req.protocol}://${req.get('host')}/api/download/${file.fileName}`,
                originalUploadedUrl: uploadedUrl // Include the original uploaded URL
            }));
        }
        
        console.log('Processing complete. Files created:', result.filesCreated?.length || 0);
        
        res.json(result);

    } catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        // Clean up uploaded file
        cleanupFile(uploadedFilePath);
    }
});

// Serve divided CSV files for download
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, CONFIG.OUTPUT_DIR, filename);
    
    if (fs.existsSync(filePath)) {
        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Stream the file for download
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
        fileStream.on('error', (err) => {
            console.error('Download error:', err);
            res.status(500).json({ error: 'Download failed' });
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: `File too large. Maximum size is ${formatFileSize(CONFIG.MAX_FILE_SIZE)}.`
            });
        }
    }
    
    res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
function startServer() {
    // Ensure output directory exists
    const outputDir = path.join(__dirname, CONFIG.OUTPUT_DIR);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    app.listen(CONFIG.PORT, () => {
        console.log(`🚀 CSV Divider API server running on http://localhost:${CONFIG.PORT}`);
        console.log(`📁 Upload directory: ${path.join(__dirname, CONFIG.UPLOAD_DIR)}`);
        console.log(`📁 Output directory: ${outputDir}`);
        console.log(`📊 Max file size: ${formatFileSize(CONFIG.MAX_FILE_SIZE)}`);
    });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    process.exit(0);
});

// Start the server
startServer();

module.exports = { app, CONFIG }; 