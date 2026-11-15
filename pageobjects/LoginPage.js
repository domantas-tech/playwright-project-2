const LOGIN_URL = "https://rahulshettyacademy.com/client/";

class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator("#userEmail");
        this.passwordInput = page.locator("#userPassword");
        this.signInButton = page.locator("[value='Login']");
    }

    async goTo() {
        await this.page.goto(LOGIN_URL);
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}

module.exports = { LoginPage };
