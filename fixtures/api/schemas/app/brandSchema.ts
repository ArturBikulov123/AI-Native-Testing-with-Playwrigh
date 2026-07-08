import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

/**
 * Schema for a single brand (GET /brands array item, POST /brands response).
 * Mirrors the OpenAPI `BrandResponse` component. `id` is a plain string in the
 * contract (no uuid format), so it is validated as `z.string()`.
 */
export const BrandResponseSchema = z.strictObject({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
});

/**
 * Schema for the GET /brands response body -- an array of brands.
 */
export const BrandsResponseSchema = z.array(BrandResponseSchema);

// Type exports
export type BrandResponse = zOutput<typeof BrandResponseSchema>;
export type BrandsResponse = zOutput<typeof BrandsResponseSchema>;
