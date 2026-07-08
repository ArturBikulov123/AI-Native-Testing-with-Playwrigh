import { Locator, Page } from '@playwright/test';
import { Messages } from '../../enums/app/app';
import { NavigationComponent } from '../components/navigation.component';

/**
 * Page Object for the product detail page at /product/{id}.
 * Covers the product information and the add-to-cart interaction.
 */
export class ProductDetailPage {
    /** Navigation component for header/nav interactions */
    readonly nav: NavigationComponent;

    constructor(private readonly page: Page) {
        this.nav = new NavigationComponent(page);
    }

    // ==================== Locators ====================

    get productName(): Locator {
        return this.page.getByTestId('product-name');
    }

    get unitPrice(): Locator {
        return this.page.getByTestId('unit-price');
    }

    get quantityInput(): Locator {
        return this.page.getByTestId('quantity');
    }

    get addToCartButton(): Locator {
        return this.page.getByRole('button', { name: 'Add to cart' });
    }

    get addedToCartConfirmation(): Locator {
        return this.page.getByText(Messages.PRODUCT_ADDED_TO_CART);
    }

    // ==================== Actions ====================

    /**
     * Adds the current product to the shopping cart and waits for the
     * confirmation toast to appear.
     *
     * @returns {Promise<void>} Resolves once the item is added.
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }
}
