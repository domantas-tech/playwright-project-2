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

    /*
     * locator.fill() puts the typed text into the report step title (`Fill "<value>"`),
     * and reports from CI are downloadable from the public repo. Setting the value
     * through evaluate() keeps it out of reports/traces; the input/change events
     * let the site's form pick up the value exactly as if it were typed.
     */
    async fillHidden(locator, value) {
        await locator.evaluate((element, text) => {
            element.focus();
            element.value = text;
            element.dispatchEvent(new Event("input", { bubbles: true }));
            element.dispatchEvent(new Event("change", { bubbles: true }));
            element.dispatchEvent(new Event("blur", { bubbles: true }));
        }, value);
    }

    async login(email, password) {
        await this.fillHidden(this.emailInput, email);
        await this.fillHidden(this.passwordInput, password);
        await this.signInButton.click();
        await this.page.waitForLoadState("networkidle");
    }
}

module.exports = { LoginPage };
