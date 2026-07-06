import { Messages } from '../../../enums/app/app';
import { expect, test } from '../../../fixtures/pom/test-options';
import { INVALID_LOGIN_ATTEMPTS } from '../../../test-data/static/app/invalidCredentials';

/**
 * Expected UI error per invalid-login scenario, keyed by its `description`.
 * The app rejects invalid input two ways:
 * - Server rejection (a login request is sent) -> {@link Messages.LOGIN_ERROR}.
 * - Client-side field validation (no request is sent) for malformed / empty
 *   email -> {@link Messages.EMAIL_FORMAT_INVALID} / {@link Messages.EMAIL_REQUIRED}.
 */
const EXPECTED_ERROR_BY_DESCRIPTION: Record<string, Messages> = {
    'valid email with wrong password': Messages.LOGIN_ERROR,
    'valid email with incorrect password': Messages.LOGIN_ERROR,
    'invalid email format with valid password': Messages.EMAIL_FORMAT_INVALID,
    'missing local part in email with valid password':
        Messages.EMAIL_FORMAT_INVALID,
    'empty email and password': Messages.EMAIL_REQUIRED,
    'invalid email format with short password': Messages.EMAIL_FORMAT_INVALID,
    'incomplete email domain with short password': Messages.LOGIN_ERROR,
};

/**
 * Example functional test suite for login functionality.
 * Replace this with your actual login tests.
 */
test.describe('functional login', () => {
    test.beforeEach(async ({ resetStorageState, loginPage }) => {
        await resetStorageState();
        await loginPage.open();
    });

    test(
        'should login successfully with valid credentials',
        { tag: '@smoke' },
        async ({ loginPage }) => {
            await test.step('WHEN user enters valid credentials', async () => {
                await loginPage.login(
                    process.env.USER_EMAIL!,
                    process.env.USER_PASSWORD!
                );
            });

            await test.step('THEN user should see username displayed', async () => {
                await expect(loginPage.nav.userMenuButton).toBeVisible();
            });
        }
    );

    for (const { description, email, password } of INVALID_LOGIN_ATTEMPTS) {
        test(
            `should show error for invalid credentials - ${description}`,
            { tag: '@regression' },
            async ({ loginPage }) => {
                await test.step(`WHEN user enters invalid credentials - email: ${email}`, async () => {
                    await loginPage.login(email, password);
                });

                await test.step('THEN error message should be displayed', async () => {
                    await expect(
                        loginPage.errorByText(
                            EXPECTED_ERROR_BY_DESCRIPTION[description]
                        )
                    ).toBeVisible();
                });
            }
        );
    }
});
