const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { chromium } = require("@playwright/test");
const { POManager } = require("../../pageobjects/POManager");
const [defaultUser] = require("../../utils/clientAPPJSON.json");

Before(async function () {
    this.browser = await chromium.launch({ headless: false });
    const browserContext = await this.browser.newContext();
    const page = await browserContext.newPage();

    const poManager = new POManager(page);
    this.loginPage = poManager.getLoginPage();
    this.dashboardPage = poManager.getDashboardPage();
});

After({ timeout: 60000 }, async function () {
    if (this.browser) {
        await this.browser.close();
    }
});

Given("I login to Ecommerce application with valid credentials", async function () {
    this.email = defaultUser.Email;
    await this.loginPage.goTo();
    await this.loginPage.login(this.email, defaultUser.password);
});

When("Add {string} to the cart", async function (productName) {
    await this.dashboardPage.addProductToCart(productName);
    await this.dashboardPage.navigateToCart();
});

Then("Verify {string} is displayed in the cart", async function (productName) {
    await this.dashboardPage.validateProductInCart(productName);
});

When("Enter valid details and place the order", async function () {
    await this.dashboardPage.checkoutProduct(this.email);
});

Then("verify order is present in the OrderHistory page", async function () {
    await this.dashboardPage.verifyOrderInHistory();
});
