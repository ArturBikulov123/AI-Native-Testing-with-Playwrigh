import { ApiEndpoints } from '../../../enums/app/app';
import {
    BrandsResponse,
    BrandsResponseSchema,
} from '../../../fixtures/api/schemas/app/brandSchema';
import {
    MethodNotAllowedResponse,
    MethodNotAllowedResponseSchema,
    ResourceNotFoundResponse,
    ResourceNotFoundResponseSchema,
} from '../../../fixtures/api/schemas/util/errorResponseSchema';
import { expect, test } from '../../../fixtures/pom/test-options';

/** HTTP methods not defined for the /brands collection route -- expected 405. */
const UNSUPPORTED_METHODS = ['PUT', 'PATCH', 'DELETE'] as const;

test.describe('get /brands', () => {
    test(
        'should return 200 and an array of brands',
        { tag: '@api' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest<BrandsResponse>({
                method: 'GET',
                url: ApiEndpoints.BRANDS,
                baseUrl: process.env.API_URL,
                headers: process.env.USER_ACCESS_TOKEN,
            });

            expect(status).toBe(200);
            expect(BrandsResponseSchema.parse(body)).toBeTruthy();
        }
    );

    for (const method of UNSUPPORTED_METHODS) {
        test(
            `should return 405 when calling /brands with unsupported method ${method}`,
            { tag: '@api' },
            async ({ apiRequest }) => {
                const { status, body } =
                    await apiRequest<MethodNotAllowedResponse>({
                        method,
                        url: ApiEndpoints.BRANDS,
                        baseUrl: process.env.API_URL,
                        headers: process.env.USER_ACCESS_TOKEN,
                    });

                expect(status).toBe(405);
                expect(MethodNotAllowedResponseSchema.parse(body)).toBeTruthy();
            }
        );
    }

    /* eslint-disable playwright/no-skipped-test */
    // FIXME: GET /brands is a static collection route and cannot be forced to
    // return 404. The OpenAPI spec documents a 404 ResourceNotFoundResponse,
    // so the test is kept (documenting the contract) but skipped until a
    // reproducible trigger exists.
    test.skip(
        'should return 404 when the brands resource is not found',
        { tag: '@api' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest<ResourceNotFoundResponse>(
                {
                    method: 'GET',
                    url: ApiEndpoints.BRANDS,
                    baseUrl: process.env.API_URL,
                    headers: process.env.USER_ACCESS_TOKEN,
                }
            );

            expect(status).toBe(404);
            expect(ResourceNotFoundResponseSchema.parse(body)).toBeTruthy();
        }
    );
    /* eslint-enable playwright/no-skipped-test */
});
