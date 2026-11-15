const ExcelJs = require("exceljs");
const { test, expect } = require("@playwright/test");

const WORKSHEET_NAME = "Sheet1";

function findCellPosition(worksheet, searchText) {
    let cellPosition = null;
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, columnNumber) => {
            if (cell.value === searchText) {
                cellPosition = { row: rowNumber, column: columnNumber };
            }
        });
    });
    return cellPosition;
}

async function updateExcelCell(searchText, newValue, offset, filePath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(WORKSHEET_NAME);

    const cellPosition = findCellPosition(worksheet, searchText);
    if (!cellPosition) {
        throw new Error(`"${searchText}" was not found in ${WORKSHEET_NAME} of ${filePath}`);
    }

    const targetCell = worksheet.getCell(
        cellPosition.row + offset.rowChange,
        cellPosition.column + offset.colChange
    );
    targetCell.value = newValue;
    await workbook.xlsx.writeFile(filePath);
}

test("Upload download excel validation", async ({ page }, testInfo) => {
    const searchText = "Mango";
    const updatedPrice = "350";

    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;

    const downloadedFilePath = testInfo.outputPath("download.xlsx");
    await download.saveAs(downloadedFilePath);

    await updateExcelCell(searchText, updatedPrice, { rowChange: 0, colChange: 2 }, downloadedFilePath);

    await page.locator("#fileinput").setInputFiles(downloadedFilePath);

    const mangoRow = page.getByRole("row").filter({ has: page.getByText(searchText) });
    await expect(mangoRow.locator("#cell-4-undefined")).toContainText(updatedPrice);
});
