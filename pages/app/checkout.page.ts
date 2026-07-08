import { Locator, Page } from '@playwright/test';
import { Messages, PaymentMethods } from '../../enums/app/app';
import { NavigationComponent } from '../components/navigation.component';
import { BillingAddress } from '../../test-data/factories/app/checkout.factory';

/**
 * Page Object for the multi-step checkout wizard at /checkout.
 * Steps: 1) Cart, 2) Sign in, 3) Billing Address, 4) Payment.
 *
 * The step "Proceed to checkout" buttons are disambiguated by their
 * data-test attributes (`proceed-1`..`proceed-3`) because all three share the
 * same accessible name.
 */
export class CheckoutPage {
    /** Navigation component for header/nav interactions */
    readonly nav: NavigationComponent;

    constructor(private readonly page: Page) {
        this.nav = new NavigationComponent(page);
    }

    // ==================== Locators ====================

    // --- Step 1: Cart ---
    get proceedFromCartButton(): Locator {
        return this.page.getByTestId('proceed-1');
    }

    /**
     * Cart line-item cell for a given product name.
     *
     * @param {string} productName - The exact product name.
     * @returns {Locator} The matching table cell.
     */
    cartItem(productName: string): Locator {
        return this.page.getByRole('cell', { name: productName, exact: true });
    }

    // --- Step 2: Sign in (already authenticated) ---
    get proceedFromSignInButton(): Locator {
        return this.page.getByTestId('proceed-2');
    }

    // --- Step 3: Billing Address ---
    get countrySelect(): Locator {
        return this.page.getByLabel('Country');
    }

    get postalCodeInput(): Locator {
        return this.page.getByLabel('Postal code');
    }

    get houseNumberInput(): Locator {
        return this.page.getByLabel('House number');
    }

    get streetInput(): Locator {
        return this.page.getByLabel('Street');
    }

    get cityInput(): Locator {
        return this.page.getByLabel('City');
    }

    get stateInput(): Locator {
        return this.page.getByLabel('State');
    }

    get proceedFromBillingButton(): Locator {
        return this.page.getByTestId('proceed-3');
    }

    // --- Step 4: Payment ---
    get paymentMethodSelect(): Locator {
        return this.page.getByLabel('Payment Method');
    }

    get confirmButton(): Locator {
        return this.page.getByRole('button', { name: 'Confirm' });
    }

    get paymentSuccessMessage(): Locator {
        return this.page.getByText(Messages.PAYMENT_SUCCESS);
    }

    // ==================== Actions ====================

    /**
     * Advances from the Cart step to the Sign in step.
     *
     * @returns {Promise<void>}
     */
    async proceedFromCart(): Promise<void> {
        await this.proceedFromCartButton.click();
    }

    /**
     * Advances from the Sign in step to Billing (user already authenticated).
     *
     * @returns {Promise<void>}
     */
    async proceedFromSignIn(): Promise<void> {
        await this.proceedFromSignInButton.click();
    }

    /**
     * Fills the billing-address form and advances to the Payment step.
     *
     * @param {BillingAddress} address - The billing address to enter.
     * @returns {Promise<void>}
     */
    async fillBillingAddressAndProceed(address: BillingAddress): Promise<void> {
        await this.streetInput.fill(address.street);
        await this.cityInput.fill(address.city);
        await this.stateInput.fill(address.state);
        await this.postalCodeInput.fill(address.postalCode);
        await this.houseNumberInput.fill(address.houseNumber);
        await this.countrySelect.selectOption({ label: address.country });
        await this.proceedFromBillingButton.click();
    }

    /**
     * Selects a payment method and confirms the order.
     *
     * @param {PaymentMethods} method - The payment method to use.
     * @returns {Promise<void>}
     */
    async payAndConfirm(method: PaymentMethods): Promise<void> {
        await this.paymentMethodSelect.selectOption({ label: method });
        await this.confirmButton.click();
    }
}
