import { z } from 'zod/v4';
import type { output as zOutput } from 'zod/v4';

/**
 * Schema for 400 Bad Request responses.
 */
export const BadRequestResponseSchema = z.strictObject({
    message: z.union([z.string(), z.array(z.string())]),
    error: z.literal('Bad Request'),
    statusCode: z.literal(400),
});

/**
 * Schema for 401 Unauthorized responses.
 */
export const UnauthorizedResponseSchema = z.strictObject({
    error: z.enum(['Unauthorized', 'Invalid login request']),
});

/**
 * Schema for 403 Forbidden responses.
 */
export const ForbiddenResponseSchema = z.strictObject({
    message: z.string(),
    error: z.literal('Forbidden'),
    statusCode: z.literal(403),
});

/**
 * Schema for 404 Not Found responses.
 */
export const NotFoundResponseSchema = z.strictObject({
    message: z.string(),
    error: z.literal('Not Found'),
    statusCode: z.literal(404),
});

/**
 * Schema for 404 Resource Not Found responses (OpenAPI `ResourceNotFoundResponse`).
 * This API returns a bare `{ message }` body -- distinct from the NestJS-style
 * `NotFoundResponseSchema` above.
 */
export const ResourceNotFoundResponseSchema = z.strictObject({
    message: z.string(),
});

/**
 * Schema for 405 Method Not Allowed responses (OpenAPI `MethodNotAllowedResponse`).
 */
export const MethodNotAllowedResponseSchema = z.strictObject({
    message: z.string(),
});

/**
 * Schema for 404 Item Not Found responses (OpenAPI `ItemNotFoundResponse`).
 * Bare `{ message }` body -- used by the /products routes.
 */
export const ItemNotFoundResponseSchema = z.strictObject({
    message: z.string(),
});

/**
 * Schema for 200 update responses (OpenAPI `UpdateResponse`) returned by
 * PUT/PATCH routes.
 */
export const UpdateResponseSchema = z.strictObject({
    success: z.boolean(),
});

/**
 * Schema for 422 validation-error bodies. The OpenAPI `UnprocessableEntityResponse`
 * documents no body, but the live API returns a Laravel MessageBag: an object
 * keyed by field name whose values are arrays of human-readable messages.
 */
export const ValidationErrorResponseSchema = z.record(
    z.string(),
    z.array(z.string())
);

// Type exports
export type BadRequestResponse = zOutput<typeof BadRequestResponseSchema>;
export type UnauthorizedResponse = zOutput<typeof UnauthorizedResponseSchema>;
export type ForbiddenResponse = zOutput<typeof ForbiddenResponseSchema>;
export type NotFoundResponse = zOutput<typeof NotFoundResponseSchema>;
export type ResourceNotFoundResponse = zOutput<
    typeof ResourceNotFoundResponseSchema
>;
export type MethodNotAllowedResponse = zOutput<
    typeof MethodNotAllowedResponseSchema
>;
export type ItemNotFoundResponse = zOutput<typeof ItemNotFoundResponseSchema>;
export type UpdateResponse = zOutput<typeof UpdateResponseSchema>;
export type ValidationErrorResponse = zOutput<
    typeof ValidationErrorResponseSchema
>;
