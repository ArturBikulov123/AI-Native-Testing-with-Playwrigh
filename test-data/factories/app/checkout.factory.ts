import { faker } from '@faker-js/faker';

/** Billing address entered during checkout. */
export interface BillingAddress {
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly country: string;
    readonly postalCode: string;
    readonly houseNumber: string;
}

/**
 * Generate a valid billing address for the checkout flow. `country` must equal
 * one of the billing-form select option labels, so it defaults to a known-valid
 * option rather than a random Faker country.
 *
 * @param overrides - Partial fields to override the Faker-generated defaults.
 * @returns A billing address object.
 */
export const generateBillingAddress = (
    overrides?: Partial<BillingAddress>
): BillingAddress => {
    return {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: 'United States of America (the)',
        postalCode: faker.location.zipCode(),
        houseNumber: String(faker.number.int({ min: 1, max: 999 })),
        ...overrides,
    };
};
