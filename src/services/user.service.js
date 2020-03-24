import ApiService from './api.service'
import {TokenService} from './storage.service'

class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.errorCode = errorCode;
    }
}

const UserService = {
    /**
     * Authorize the user with their Discord account.
     **/
    authorize() {
        window.location.href = process.env.VUE_APP_AUTHORIZATION_API;
    },

    /**
     * Login the user and store the JSESSIONID as token to TokenService.
     *
     * @return access_token
     **/
    login: async function (sessionId) {
        TokenService.saveToken(sessionId);
        ApiService.setHeader();
        ApiService.mount401Interceptor();
        return sessionId;
    },

    /**
     * Logout the current user by removing the token from storage.
     *
     * Will also remove `Authorization Bearer <token>` header from future requests.
     **/
    logout() {
        // Remove the token and remove Authorization header from Api Service as well
        TokenService.removeToken();
        ApiService.removeHeader();
        ApiService.unmount401Interceptor();
    },

    getUserInfo: async function () {
        return await ApiService.get('/users/current');
    }
};
export {UserService, AuthenticationError}