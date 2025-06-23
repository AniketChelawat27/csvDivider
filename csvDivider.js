const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Function to validate inputs
function validateInputs(inputPath, divideInto) {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`File not found at ${inputPath}`);
    }
    
    if (!divideInto || isNaN(divideInto) || divideInto <= 0) {
        throw new Error('Division number must be a positive integer');
    }
}

// Function to create output directory
function createOutputDirectory() {
    const outputDir = path.join(__dirname, "divided_csvs");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    return outputDir;
}

// Function to read CSV data
function readCSVData(inputPath) {
    return new Promise((resolve, reject) => {
        const data = [];
        
        fs.createReadStream(inputPath)
            .pipe(csv())
            .on("data", (row) => {
                data.push(row);
            })
            .on("end", () => {
                resolve(data);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

// Function to calculate division parameters
function calculateDivisionParams(dataLength, divideInto) {
    if (divideInto > dataLength) {
        throw new Error(`Invalid division number. Must be between 1 and ${dataLength}`);
    }
    
    return {
        recordsPerFile: Math.ceil(dataLength / divideInto),
        totalRecords: dataLength
    };
}

// Function to create CSV writer
function createCSVWriter(outputPath, headers) {
    return createCsvWriter({
        path: outputPath,
        header: headers.map((header) => ({
            id: header,
            title: header
        }))
    });
}

// Function to write CSV chunk
async function writeCSVChunk(csvWriter, chunk) {
    return await csvWriter.writeRecords(chunk);
}

// Function to divide and write CSV files
async function divideAndWriteFiles(data, divideInto, outputDir) {
    const headers = Object.keys(data[0]);
    const { recordsPerFile } = calculateDivisionParams(data.length, divideInto);
    
    const results = [];
    
    for (let i = 0; i < divideInto; i++) {
        const startIndex = i * recordsPerFile;
        const endIndex = Math.min((i + 1) * recordsPerFile, data.length);
        const chunk = data.slice(startIndex, endIndex);
        
        if (chunk.length === 0) break;
        
        const outputFileName = `part_${i + 1}_of_${divideInto}.csv`;
        const outputPath = path.join(outputDir, outputFileName);
        
        const csvWriter = createCSVWriter(outputPath, headers);
        await writeCSVChunk(csvWriter, chunk);
        
        results.push({
            fileName: outputFileName,
            recordCount: chunk.length,
            filePath: outputPath
        });
    }
    
    return results;
}

// Main function to divide CSV into multiple files
async function divideCSV(inputPath, divideInto) {
    try {
        // Validate inputs
        validateInputs(inputPath, divideInto);
        
        // Read CSV data
        const data = await readCSVData(inputPath);
        
        // Calculate division parameters
        const { totalRecords, recordsPerFile } = calculateDivisionParams(data.length, divideInto);
        
        // Create output directory
        const outputDir = createOutputDirectory();
        
        // Divide and write files
        const results = await divideAndWriteFiles(data, divideInto, outputDir);
        
        return {
            success: true,
            totalRecords,
            recordsPerFile,
            outputDirectory: outputDir,
            filesCreated: results
        };
        
    } catch (error) {
        throw error;
    }
}

// Main function to run the script
async function main() {
    const inputPath = "/Users/apple/Downloads/Dummy/dummyData8k.csv";
    
    // Get division number from command line argument
    const divideInto = parseInt(process.argv[2]);
    
    if (!divideInto || isNaN(divideInto) || divideInto <= 0) {
        process.stderr.write("Usage: node csv-divider.js <number_of_parts>\n");
        process.stderr.write("Example: node csv-divider.js 5\n");
        process.exit(1);
    }
    
    try {
        const result = await divideCSV(inputPath, divideInto);
        
        // Output results to stdout for programmatic use
        process.stdout.write(JSON.stringify(result, null, 2) + "\n");
        
    } catch (error) {
        process.stderr.write(`Error: ${error.message}\n`);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { divideCSV };
