/**
 * Application-specific constants.
 * Add your application's repeated string values here.
 *
 * @example
 * ```ts
 * import { Messages, ApiEndpoints } from '../../enums/app/app';
 *
 * await expect(page.getByText(Messages.LOGIN_SUCCESS)).toBeVisible();
 * ```
 */

/** Common UI messages */
export enum Messages {
    LOGIN_SUCCESS = 'Successfully logged in',
    LOGIN_FAILED = 'Invalid credentials',
    LOGIN_ERROR = 'Invalid email or password',
    LOGOUT_SUCCESS = 'You have been logged out',
    SESSION_EXPIRED = 'Your session has expired',
    REQUIRED_FIELD = 'This field is required',
    EMAIL_FORMAT_INVALID = 'Email format is invalid',
    EMAIL_REQUIRED = 'Email is required',
    PASSWORD_REQUIRED = 'Password is required',
    PRODUCT_ADDED_TO_CART = 'Product added to shopping cart.',
    PAYMENT_SUCCESS = 'Payment was successful',
}

/** Checkout payment methods (values match the payment-method select options) */
export enum PaymentMethods {
    BANK_TRANSFER = 'Bank Transfer',
    CASH_ON_DELIVERY = 'Cash on Delivery',
    CREDIT_CARD = 'Credit Card',
    BUY_NOW_PAY_LATER = 'Buy Now Pay Later',
    GIFT_CARD = 'Gift Card',
}

/** API endpoint paths */
export enum ApiEndpoints {
    LOGIN = '/users/login',
    LOGOUT = '/users/logout',
    CURRENT_USER = '/users/me',
    REGISTER = '/users/register',
    BRANDS = '/brands',
    PRODUCTS = '/products',
}

/** Storage state file paths */
export enum StorageStatePaths {
    APP = '.auth/app/appStorageState.json',
    ADMIN_APP = '.auth/app/adminAppStorageState.json',
}
