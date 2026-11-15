const { test } = require("@playwright/test");
const { POManager } = require("../pageobjects/POManager");
const testDataSet = require("../utils/clientAPPJSON.json");

// All data sets share one account and therefore one cart, so they must not run in parallel.
test.describe.configure({ mode: "default" });

for (const testData of testDataSet) {
    test(`Client app test for ${testData.productName}`, async ({ page }) => {
        const { Email: email, password, productName } = testData;
        const poManager = new POManager(page);

        const loginPage = poManager.getLoginPage();
        await loginPage.goTo();
        await loginPage.login(email, password);

        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.addProductToCart(productName);
        await dashboardPage.navigateToCart();
        await dashboardPage.validateProductInCart(productName);
        await dashboardPage.checkoutProduct(email);
        await dashboardPage.verifyOrderInHistory();
    });
}
