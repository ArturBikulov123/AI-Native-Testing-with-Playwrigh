import { expect, Locator, Page } from '@playwright/test';
import { Messages } from '../../enums/app/app';
import { NavigationComponent } from '../components/navigation.component';
import { TestUser } from '../../config/app';

/**
 * Page Object for the login page at /auth/login.
 * Contains locators and methods for interacting with the login form.
 */
export class LoginPage {
    /** Navigation component for header/nav interactions */
    readonly nav: NavigationComponent;

    constructor(private readonly page: Page) {
        this.nav = new NavigationComponent(page);
    }

    // ==================== Locators ====================

    get emailInput(): Locator {
        return this.page.getByLabel('Email address');
    }

    get passwordInput(): Locator {
        return this.page.getByPlaceholder('Your password');
    }

    get loginButton(): Locator {
        return this.page.getByRole('button', { name: 'Login' });
    }

    get errorMessage(): Locator {
        return this.page.getByText(Messages.LOGIN_ERROR);
    }

    /**
     * Returns a locator for a specific error or validation message by text.
     * Covers both the server rejection message and client-side field
     * validation (which fires before any login request is sent).
     *
     * @param {string} message - The expected error text.
     * @returns {Locator} Locator for the message.
     */
    errorByText(message: string): Locator {
        return this.page.getByText(message);
    }

    get registerLink(): Locator {
        return this.page.getByRole('link', { name: 'Register your account' });
    }

    get forgotPasswordLink(): Locator {
        return this.page.getByRole('link', { name: 'Forgot your Password?' });
    }

    // ==================== Actions ====================

    /**
     * Navigates to the login page.
     * Waits for the page to reach DOM content loaded state.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async open(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL!}/auth/login`, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Fills the credentials and submits the login form.
     *
     * Does not wait for a login response: client-side field validation
     * (malformed or empty email) rejects the form before any request is
     * sent. Callers assert the resulting state with a web-first assertion.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<void>} Resolves once the form is submitted.
     */
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);

        await this.loginButton.click();
    }

    /**
     * Performs login and verifies successful login by checking user menu visibility.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<void>} Resolves when login is verified successful.
     */
    async loginAndVerify(user: TestUser): Promise<void> {
        await this.login(user.email, user.password);
        await expect(this.page.getByText(user.name)).toBeVisible();
    }
}
