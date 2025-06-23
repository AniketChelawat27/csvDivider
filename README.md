# CSV Divider Web Application

A modern, responsive web application for dividing large CSV files into smaller, manageable parts. Built with Node.js, Express, and vanilla JavaScript.

## 🚀 Features

- **Modern UI**: Beautiful, responsive design with smooth animations
- **Drag & Drop**: Intuitive file upload with drag and drop support
- **File Validation**: Automatic CSV file validation and size limits
- **Real-time Feedback**: Loading states and progress indicators
- **Download Links**: Direct download links for all divided files
- **Error Handling**: Comprehensive error messages and validation
- **Mobile Responsive**: Works perfectly on desktop and mobile devices

## 📁 Project Structure

```
csv_divider/
├── index.html          # Main HTML file
├── styles.css          # CSS styles (separated)
├── app.js             # Frontend JavaScript (modular)
├── server.js          # Express server
├── csvDivider.js      # Core CSV processing logic
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## 🛠️ Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

## 📖 Usage

1. **Upload a CSV file** by either:
   - Clicking the upload area to select a file
   - Dragging and dropping a CSV file onto the page

2. **Enter the number of parts** you want to divide the CSV into (minimum 2)

3. **Click "Divide CSV File"** and wait for processing

4. **Download the divided files** using the provided download links

## ⚙️ Configuration

The application can be configured by modifying the `CONFIG` object in `server.js`:

```javascript
const CONFIG = {
    PORT: process.env.PORT || 3000,        // Server port
    MAX_FILE_SIZE: 100 * 1024 * 1024,     // Max file size (100MB)
    UPLOAD_DIR: 'uploads',                 // Upload directory
    OUTPUT_DIR: 'divided_csvs'             // Output directory
};
```

## 🔧 Scripts

- `npm start` - Start the web server
- `npm run dev` - Run the command-line version
- `npm test` - Run tests (not implemented yet)

## 🏗️ Architecture

### Frontend (`app.js`)
- **CSVDividerApp Class**: Main application logic
- **Modular Design**: Clean separation of concerns
- **Event Handling**: Comprehensive drag & drop and form handling
- **Error Management**: User-friendly error messages

### Backend (`server.js`)
- **Express Server**: RESTful API endpoints
- **File Upload**: Multer middleware for file handling
- **Error Handling**: Comprehensive error middleware
- **Configuration**: Centralized configuration management

### Core Logic (`csvDivider.js`)
- **CSV Processing**: Core file division logic
- **Validation**: Input validation and error checking
- **File Management**: Output file creation and management

## 🎨 Styling (`styles.css`)

- **Modern Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Mobile-first approach
- **Component-based**: Organized CSS with clear sections
- **Accessibility**: Proper contrast and focus states

## 🔒 Security Features

- **File Type Validation**: Only CSV files accepted
- **File Size Limits**: Configurable maximum file size
- **Unique Filenames**: Prevents file conflicts
- **Automatic Cleanup**: Uploaded files are deleted after processing
- **Error Boundaries**: Graceful error handling

## 📊 API Endpoints

- `GET /` - Serve the main application page
- `POST /divide-csv` - Process and divide CSV files
- `GET /download/:filename` - Download divided files
- `GET /health` - Health check endpoint

## 🚀 Performance Optimizations

- **Separated Concerns**: CSS and JS in separate files for better caching
- **Modular Code**: Clean, maintainable code structure
- **Efficient File Handling**: Stream-based CSV processing
- **Memory Management**: Automatic file cleanup

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot find module" errors**:
   ```bash
   npm install
   ```

2. **Port already in use**:
   Change the port in `server.js` or kill the existing process

3. **File upload fails**:
   - Check file size (max 100MB)
   - Ensure file is a valid CSV
   - Check upload directory permissions

4. **Download links don't work**:
   - Ensure the divided_csvs directory exists
   - Check file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Review the error messages in the browser console
3. Check the server logs for backend errors

---

**Built with ❤️ using Node.js, Express, and vanilla JavaScript** 