export const ERROR_CODES = {
    ACCOUNT_ALREADY_EXISTS: 'auth/account-exists-with-different-credential',
    EMAIL_NOT_VERIFIED: 'auth/email-not-verified',
    ACCOUNT_ALREADY_IN_USE: 'auth/email-already-in-use',
    INVALID_CREDENTIALS: 'auth/invalid-credential',
    OPERATION_NOT_ENABLED: 'auth/operation-not-allowed',
    USER_DISABLED: 'auth/user-disabled',
    USER_NOT_FOUND: 'auth/user-not-found',
    WRONG_PASSWORD: 'auth/wrong-password',
    INVALID_EMAIL: 'auth/invalid-email',
    WEAK_PASSWORD: 'auth/weak-password',
    RE_LOGIN: 'auth/requires-recent-login',

    USER_CANCELLED_LOGIN: 'userCancelledLogin',
    UNABLE_TO_GET_ACCESS_TOKEN: 'unableToGetAccessToken',
};

export default class AuthenticationError extends Error {
    constructor(message, errorCode, credentials) {
        super(message);

        this.errorCode = errorCode;
        this.credentials = credentials;
    }
}
