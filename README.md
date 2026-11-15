# Playwright E-commerce Test Automation

A personal practice project in which I built end-to-end UI test automation for a demo e-commerce web app using **Playwright** and **JavaScript**. The project uses the **Page Object Model**, **data-driven tests** and **Cucumber (BDD)** scenarios, and also includes a test that **edits an Excel file** with ExcelJS during the run.

The tests run against the public practice site [rahulshettyacademy.com/client](https://rahulshettyacademy.com/client/).

## What the automation does

### 1. End-to-end purchase flow (`tests/ClientAppPO.spec.js`)

The test buys a product from start to finish and checks the order was saved:

1. Opens the shop and **logs in**.
2. Finds the product by its exact name and **adds it to the cart**.
3. Opens the cart and **checks the product is there**.
4. Goes to checkout, types `ind` into the country search box and **picks "India"** from the suggestions.
5. **Checks that the shipping email** matches the logged-in user, then places the order.
6. **Checks the order confirmation** message and reads the new order ID.
7. Opens **My Orders**, finds the row with that order ID, opens its details and **checks the order ID matches**.

The test is **data-driven**. It runs once for each entry in `utils/clientAPPJSON.json`, so adding another product means adding one JSON object.

### 2. The same flow as a Cucumber (BDD) scenario (`features/`)

The purchase flow is also written in plain English with Gherkin, so people who don't write code can read it:

```gherkin
Scenario: Validate product search functionality
    Given I login to Ecommerce application with valid credentials
    When Add "ZARA COAT 3" to the cart
    Then Verify "ZARA COAT 3" is displayed in the cart
    When Enter valid details and place the order
    Then verify order is present in the OrderHistory page
```

The step definitions in `features/stepdefinitions/steps.js` call the same page objects as the Playwright tests, so both use the same automation code. Each scenario gets its own browser, which is closed when the scenario ends.

### 3. Download, edit and upload an Excel file (`tests/exampleSection16.spec.js`)

1. Downloads an `.xlsx` file from a practice page.
2. Opens it with **ExcelJS**, finds the cell containing `Mango` and changes its price, two columns to the right, to `350`.
3. Uploads the edited file back to the page.
4. **Checks that the web table** now shows the new price.

### 4. Excel reader script (`excelDemo.js`)

A small Node script that prints every cell of an Excel sheet. I used it to practise the ExcelJS API.

## Project structure

```
├── pageobjects/              Page Object Model
│   ├── LoginPage.js          Login page: open the site and log in
│   ├── DashboardPage.js      Product list, cart, checkout and order history
│   └── POManager.js          Creates the page objects and hands them out
├── tests/                    Playwright test specs
│   ├── ClientAppPO.spec.js   Data-driven end-to-end purchase test
│   └── exampleSection16.spec.js   Excel download/edit/upload test
├── features/                 Cucumber BDD
│   ├── Ecommerce.feature     Gherkin scenario
│   └── stepdefinitions/steps.js
├── utils/
│   └── clientAPPJSON.example.json   Template for test data and login (copy it to make your own)
├── excelDemo.js              Standalone Excel reader
├── playwright.config.js
└── .github/workflows/playwright.yml   GitHub Actions CI
```

## Techniques and skills shown

- **Page Object Model.** Each page's locators and actions live in one class, so the tests read like user steps. `POManager` gives the tests one place to get every page object.
- **Locators that wait.** Products and countries are found with `filter({ has / hasText })`, and checks use Playwright's auto-waiting `expect` (`toBeVisible`, `toHaveText`, `toContainText`). The tests don't use fixed sleeps.
- **Data-driven testing.** A JSON file controls which test cases run.
- **BDD with Cucumber.** Gherkin scenarios run on the same page objects as the Playwright tests.
- **File handling.** The Excel test downloads a file, edits it with ExcelJS and uploads it again.
- **Credentials kept out of the code.** The login is stored in a gitignored data file, not in the tests or the feature file.
- **CI.** A GitHub Actions workflow runs the Playwright suite on every push and pull request and uploads the HTML report.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- A free account on [rahulshettyacademy.com/client](https://rahulshettyacademy.com/client/)

### Setup

```bash
npm install
npx playwright install
```

Make your local test data file from the template and fill in your own login:

```bash
cp utils/clientAPPJSON.example.json utils/clientAPPJSON.json
```

```json
[
    { "Email": "your-email@example.com", "password": "your-password", "productName": "ZARA COAT 3" },
    { "Email": "your-email@example.com", "password": "your-password", "productName": "ADIDAS ORIGINAL" }
]
```

> `utils/clientAPPJSON.json` is in `.gitignore`, so your login never gets committed.

### Running the tests

```bash
# All Playwright tests (headless)
npx playwright test

# Watch the browser while the tests run
npx playwright test --headed

# Open the HTML report after a run
npx playwright show-report

# Cucumber BDD scenario
npx cucumber-js

# Excel reader script (optionally pass a path to an .xlsx file)
node excelDemo.js "path/to/file.xlsx"
```

> Note: the purchase tests place real orders on the demo shop each time they run.

## Tech stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation and test runner |
| [Cucumber.js](https://github.com/cucumber/cucumber-js) | BDD scenarios in Gherkin |
| [ExcelJS](https://github.com/exceljs/exceljs) | Reading and writing Excel files |
| GitHub Actions | Continuous integration |
