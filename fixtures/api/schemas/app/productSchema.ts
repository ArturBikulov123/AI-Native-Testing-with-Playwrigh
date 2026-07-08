import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

/*
 * NOTE ON CONTRACT DRIFT (source of truth = live API, discrepancies flagged):
 * The documented OpenAPI `ProductResponse` / `BrandResponse` / `CategoryResponse`
 * do NOT match what the live API returns, and the nested shape differs per
 * endpoint. Schemas below mirror the ACTUAL responses; each // FIXME marks a
 * field the documentation promises but the API omits (or adds).
 *
 *   brand:    list & by-id -> { id, name }            (doc also promises `slug`)
 *             POST create  -> { id, name, slug }
 *   category: list         -> { id, name, slug }      (doc also promises parent_id + sub_categories)
 *             by-id & POST -> { id, name, slug, parent_id }
 *             sub_categories -> never returned by any endpoint
 *   product:  by-id adds an undocumented `specs` field
 */

/** Brand as returned in list/by-id product payloads. */
// FIXME: OpenAPI BrandResponse documents `slug`, but list/by-id omit it.
export const BrandSummarySchema = z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
});

/** Brand as returned in the POST create response (includes `slug`). */
export const BrandCreatedSchema = z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
});

/** Category as returned in the list payload. */
// FIXME: OpenAPI CategoryResponse documents `parent_id` + `sub_categories`; the
// list endpoint returns neither.
export const CategorySummarySchema = z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
});

/** Category as returned in by-id / POST payloads (adds nullable `parent_id`). */
// FIXME: OpenAPI documents `sub_categories`; no endpoint returns it.
export const CategoryDetailSchema = z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    parent_id: z.string().nullable(),
});

/** Product image (OpenAPI `ImageResponse`) -- matches the contract. */
export const ImageResponseSchema = z.strictObject({
    by_name: z.string(),
    by_url: z.string(),
    source_name: z.string(),
    source_url: z.string(),
    file_name: z.string(),
    title: z.string(),
    id: z.string().min(1),
});

/** Scalar product fields shared by every product response shape. */
const productBaseShape = {
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    price: z.number(),
    is_location_offer: z.boolean(),
    is_rental: z.boolean(),
    in_stock: z.boolean(),
    co2_rating: z.string(),
    is_eco_friendly: z.boolean(),
};

/** A product item inside the GET /products (and QUERY) paginated list. */
export const ProductListItemSchema = z.strictObject({
    ...productBaseShape,
    brand: BrandSummarySchema,
    category: CategorySummarySchema,
    product_image: ImageResponseSchema,
});

/** A product returned by GET /products/{id} (adds undocumented `specs`). */
// FIXME: `specs` is returned by the API but absent from the OpenAPI ProductResponse.
export const ProductByIdSchema = z.strictObject({
    ...productBaseShape,
    brand: BrandSummarySchema,
    category: CategoryDetailSchema,
    product_image: ImageResponseSchema,
    specs: z.unknown(),
});

/** A product returned by POST /products (brand carries `slug`). */
export const ProductCreatedSchema = z.strictObject({
    ...productBaseShape,
    brand: BrandCreatedSchema,
    category: CategoryDetailSchema,
    product_image: ImageResponseSchema,
});

/**
 * GET /products (and QUERY /products) response -- Laravel paginator wrapping the
 * product list (OpenAPI `PaginatedProductResponse`).
 */
export const PaginatedProductResponseSchema = z.strictObject({
    current_page: z.int(),
    data: z.array(ProductListItemSchema),
    from: z.int().nullable(),
    last_page: z.int(),
    per_page: z.int(),
    to: z.int().nullable(),
    total: z.int(),
});

/**
 * POST/PUT/PATCH request body (OpenAPI `ProductRequest`). `description` and
 * `co2_rating` are optional -- the API does not require them (confirmed live).
 */
export const ProductRequestSchema = z.strictObject({
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    price: z.number().positive(),
    category_id: z.string().min(1),
    brand_id: z.string().min(1),
    product_image_id: z.string().min(1),
    is_location_offer: z.boolean(),
    is_rental: z.boolean(),
    co2_rating: z.string().min(1).optional(),
});

// Type exports
export type BrandSummary = zOutput<typeof BrandSummarySchema>;
export type BrandCreated = zOutput<typeof BrandCreatedSchema>;
export type CategorySummary = zOutput<typeof CategorySummarySchema>;
export type CategoryDetail = zOutput<typeof CategoryDetailSchema>;
export type ImageResponse = zOutput<typeof ImageResponseSchema>;
export type ProductListItem = zOutput<typeof ProductListItemSchema>;
export type ProductById = zOutput<typeof ProductByIdSchema>;
export type ProductCreated = zOutput<typeof ProductCreatedSchema>;
export type PaginatedProductResponse = zOutput<
    typeof PaginatedProductResponseSchema
>;
export type ProductRequest = zOutput<typeof ProductRequestSchema>;
