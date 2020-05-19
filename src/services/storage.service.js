const TOKEN_KEY = 'access_token';
const REDIRECT_AFTER_LOGIN_URI = 'login_redirect_uri';

/**
 * Manage how Access Tokens are being stored and retrieved from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instance.
 **/
const TokenService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },

    saveToken(accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken)
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    }

};


/**
 * Manage how login redirect URIs are being stored and retrieved from storage.
 **/
const RedirectService = {
    getUri() {
        return localStorage.getItem(REDIRECT_AFTER_LOGIN_URI)
    },

    saveUri(uri) {
        localStorage.setItem(REDIRECT_AFTER_LOGIN_URI, uri)
    },

    removeUri() {
        localStorage.removeItem(REDIRECT_AFTER_LOGIN_URI)
    }

};


export {TokenService, RedirectService}