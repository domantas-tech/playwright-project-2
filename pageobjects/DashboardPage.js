const { expect } = require("@playwright/test");

const COUNTRY_SEARCH_TEXT = "ind";
const COUNTRY_NAME = "India";
const ORDER_CONFIRMATION_TEXT = " Thankyou for the order. ";

class DashboardPage {
    constructor(page) {
        this.page = page;

        // Product catalogue
        this.productCards = page.locator(".card-body");
        this.cartButton = page.locator("[routerlink*='cart']");
        this.cartItems = page.locator("div li");

        // Checkout
        this.checkoutButton = page.locator("text=Checkout");
        this.countryInput = page.locator("[placeholder*='Country']");
        this.countryResults = page.locator(".ta-results");
        this.shippingEmailLabel = page.locator(".user__name [type='text']").first();
        this.placeOrderButton = page.locator(".action__submit");

        // Order confirmation and history
        this.orderConfirmationHeading = page.locator(".hero-primary");
        this.confirmedOrderId = page.locator(".em-spacer-1 .ng-star-inserted");
        this.myOrdersButton = page.locator(".btn.btn-custom[routerlink='/dashboard/myorders']");
        this.orderHistoryRows = page.locator("tbody tr");
        this.orderDetailsId = page.locator(".col-text");
    }

    async addProductToCart(productName) {
        const productTitle = this.page.locator("b").getByText(productName, { exact: true });
        const matchingProductCard = this.productCards.filter({ has: productTitle });
        await matchingProductCard.locator("text= Add To Cart").click();
    }

    async navigateToCart() {
        await this.cartButton.click();
        await this.cartItems.first().waitFor();
    }

    async validateProductInCart(productName) {
        const cartProductTitle = this.page.locator("h3", { hasText: productName });
        await expect(cartProductTitle).toBeVisible();
    }

    async checkoutProduct(expectedEmail) {
        await this.checkoutButton.click();
        await this.countryInput.pressSequentially(COUNTRY_SEARCH_TEXT, { delay: 100 });
        await this.countryResults.waitFor();
        const countryOption = this.countryResults
            .locator("button")
            .filter({ hasText: new RegExp(`^\\s*${COUNTRY_NAME}\\s*$`) });
        await countryOption.click();

        await expect(this.shippingEmailLabel).toHaveText(expectedEmail);
        await this.placeOrderButton.click();
    }

    async verifyOrderInHistory() {
        await expect(this.orderConfirmationHeading).toHaveText(ORDER_CONFIRMATION_TEXT);
        const rawOrderId = await this.confirmedOrderId.textContent();
        const orderId = rawOrderId.replace(/[|\s]/g, "");

        await this.myOrdersButton.click();
        await this.orderHistoryRows.first().waitFor();

        const orderRow = this.orderHistoryRows.filter({ hasText: orderId });
        await orderRow.locator('button:has-text("View")').click();

        const orderIdOnDetailsPage = await this.orderDetailsId.textContent();
        expect(orderId).toContain(orderIdOnDetailsPage.trim());
    }
}

module.exports = { DashboardPage };
