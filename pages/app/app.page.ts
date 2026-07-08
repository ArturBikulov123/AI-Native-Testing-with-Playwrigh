import { Locator, Page } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';

/**
 * Page Object for the application home page (product listing).
 * Contains locators and methods for the main landing page.
 *
 * This also demonstrates the component composition pattern where reusable
 * UI components (like NavigationComponent) are composed into page objects.
 */
export class AppPage {
    /** Navigation component for header/nav interactions */
    readonly nav: NavigationComponent;

    constructor(private readonly page: Page) {
        this.nav = new NavigationComponent(page);
    }

    // ==================== Locators ====================

    get searchInput(): Locator {
        return this.page.getByPlaceholder('Search');
    }

    get searchButton(): Locator {
        return this.page.getByRole('button', { name: 'Search' });
    }

    get sortDropdown(): Locator {
        return this.page.getByRole('combobox', { name: 'sort' });
    }

    get productCards(): Locator {
        // Product cards carry a dynamic data-test="product-<id>"; a prefix
        // attribute selector is required because getByTestId needs an exact id.
        // eslint-disable-next-line playwright/no-raw-locators -- dynamic data-test id prefix
        return this.page.locator('[data-test^="product-"]');
    }

    get firstAvailableProduct(): Locator {
        // Any in-stock product satisfies the purchase flow; take the first.
        // eslint-disable-next-line playwright/no-nth-methods -- first in-stock card is sufficient
        return this.productCards.filter({ hasNotText: 'Out of stock' }).first();
    }

    // ==================== Actions ====================

    /**
     * Opens the first in-stock product on the listing by clicking its card.
     *
     * @returns {Promise<void>} Resolves once navigation to the product detail
     * page has been triggered.
     */
    async openFirstAvailableProduct(): Promise<void> {
        await this.firstAvailableProduct.click();
    }

    /**
     * Navigates to the application home page using the configured APP_URL.
     * Waits for the page to reach DOM content loaded state.
     *
     * @returns {Promise<void>} Resolves when navigation is complete.
     */
    async openHomePage(): Promise<void> {
        await this.page.goto(process.env.APP_URL!, {
            waitUntil: 'domcontentloaded',
        });
    }
}
