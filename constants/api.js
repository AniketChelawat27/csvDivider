// API endpoints and configuration constants
export const API_ENDPOINTS = {
    EXTERNAL_UPLOAD: 'https://easysource-stag2.hirequotient.com/api/upload/files',
    CSV_DIVIDER: '/api/divide-csv',
    FILE_DOWNLOAD: '/download',
    CREATE_JD_PROJECT: 'https://easysource-stag2.hirequotient.com/api/v2/project/create-jd-project'
};

export const DEFAULT_VALUES = {
    DIVIDE_INTO: 2,
    MAX_FILES: 5,
    MAX_FILE_SIZE: 100 * 1024 * 1024 // 100MB
};

export const FILE_TYPES = {
    CSV: {
        MIME_TYPE: 'text/csv',
        EXTENSION: '.csv'
    }
}; 