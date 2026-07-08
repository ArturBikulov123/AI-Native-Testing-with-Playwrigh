import { PaymentMethods } from '../../../enums/app/app';
import { generateBillingAddress } from '../../../test-data/factories/app/checkout.factory';
import { expect, test } from '../../../fixtures/pom/test-options';

/**
 * End-to-end test for the most important user flow of the Toolshop app:
 * discovering a product and completing a purchase. Runs pre-authenticated as
 * the `user` (Bob Smith) via the shared storage state from auth.setup.ts.
 */
test.describe('e2e checkout flow', () => {
    test.beforeEach(async ({ appPage }) => {
        await appPage.openHomePage();
    });

    test(
        'should complete a purchase from product selection to order confirmation',
        { tag: '@e2e' },
        async ({ appPage, productDetailPage, checkoutPage }) => {
            const billingAddress = generateBillingAddress();
            let productName = '';

            await test.step('GIVEN the user opens the first available product', async () => {
                await appPage.openFirstAvailableProduct();
                await expect(productDetailPage.productName).toBeVisible();
                productName =
                    (
                        await productDetailPage.productName.textContent()
                    )?.trim() ?? '';
                expect(productName).not.toBe('');
            });

            await test.step('WHEN the user adds the product to the cart', async () => {
                await productDetailPage.addToCart();
                await expect(
                    productDetailPage.addedToCartConfirmation
                ).toBeVisible();
                await expect(appPage.nav.cartQuantity).toBeVisible();
            });

            await test.step('AND opens the cart containing that product', async () => {
                await productDetailPage.nav.openCart();
                await expect(checkoutPage.cartItem(productName)).toBeVisible();
            });

            await test.step('AND proceeds through the sign-in and billing steps', async () => {
                await checkoutPage.proceedFromCart();
                await expect(
                    checkoutPage.proceedFromSignInButton
                ).toBeVisible();
                await checkoutPage.proceedFromSignIn();
                await checkoutPage.fillBillingAddressAndProceed(billingAddress);
            });

            await test.step('AND pays with cash on delivery', async () => {
                await expect(checkoutPage.paymentMethodSelect).toBeVisible();
                await checkoutPage.payAndConfirm(
                    PaymentMethods.CASH_ON_DELIVERY
                );
            });

            await test.step('THEN the order is confirmed successfully', async () => {
                await expect(checkoutPage.paymentSuccessMessage).toBeVisible();
            });
        }
    );
});
