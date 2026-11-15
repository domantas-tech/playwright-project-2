const os = require("os");
const path = require("path");
const ExcelJs = require("exceljs");

const WORKSHEET_NAME = "Sheet1";
const defaultFilePath = path.join(os.homedir(), "Downloads", "Excel Playwright Practice.xlsx");
const excelFilePath = process.argv[2] || defaultFilePath;

async function printWorksheet(filePath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(WORKSHEET_NAME);

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, columnNumber) => {
            console.log(`Row ${rowNumber}, Column ${columnNumber}: ${cell.value}`);
        });
    });
}

printWorksheet(excelFilePath).catch((error) => {
    console.error(`Failed to read ${excelFilePath}:`, error.message);
    process.exitCode = 1;
});
