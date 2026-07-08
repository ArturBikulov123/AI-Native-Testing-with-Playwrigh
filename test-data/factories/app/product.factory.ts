import { faker } from '@faker-js/faker';
import {
    ProductRequest,
    ProductRequestSchema,
} from '../../../fixtures/api/schemas/app/productSchema';

/**
 * Generate a valid ProductRequest payload for POST/PUT/PATCH tests.
 *
 * The foreign-key ULIDs (`category_id`, `brand_id`, `product_image_id`) default
 * to freshly generated ULIDs, which are NOT valid references -- callers writing
 * happy-path create/update tests MUST override them with real ids harvested from
 * an existing product (see products.spec.ts `beforeAll`).
 *
 * @param overrides - Partial fields to override the Faker-generated defaults.
 * @returns A schema-validated ProductRequest object.
 */
export const generateProduct = (
    overrides?: Partial<ProductRequest>
): ProductRequest => {
    const defaultProduct: ProductRequest = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 1, max: 999 })),
        category_id: faker.string.ulid(),
        brand_id: faker.string.ulid(),
        product_image_id: faker.string.ulid(),
        is_location_offer: faker.datatype.boolean(),
        is_rental: faker.datatype.boolean(),
        co2_rating: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
    };

    const mergedProduct = { ...defaultProduct, ...overrides };

    return ProductRequestSchema.parse(mergedProduct);
};
