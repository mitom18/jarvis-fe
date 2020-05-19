import {UserService, AuthenticationError} from '../services/user.service'
import {TokenService, RedirectService} from '../services/storage.service'
import router from '../router'


const state = {
    authenticating: false,
    accessToken: TokenService.getToken(),
    authenticationErrorCode: 0,
    authenticationError: ''
};

const getters = {
    loggedIn: (state) => {
        return !!state.accessToken;
    },

    userInfo: (state) => {
        return state.accessToken ? UserService.getUserInfo() : null;
    },

    authenticationErrorCode: (state) => {
        return state.authenticationErrorCode
    },

    authenticationError: (state) => {
        return state.authenticationError
    },

    authenticating: (state) => {
        return state.authenticating
    }
};

const actions = {
    authorize() {
        UserService.authorize();
    },

    async login({commit}, sessionId) {
        commit('loginRequest');

        try {
            const token = await UserService.login(sessionId);
            commit('loginSuccess', token);

            // Redirect the user to the page he first tried to visit or to the home view
            const loginRedirectUri = RedirectService.getUri();
            RedirectService.removeUri();
            await router.push(loginRedirectUri || '/');

            return true
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('loginError', {errorCode: e.errorCode, errorMessage: e.message})
            }

            return false
        }
    },

    logout({commit}) {
        UserService.logout();
        commit('logoutSuccess');
        router.push('/login');
    }
};

const mutations = {
    loginRequest(state) {
        state.authenticating = true;
        state.authenticationError = '';
        state.authenticationErrorCode = 0
    },

    loginSuccess(state, accessToken) {
        state.accessToken = accessToken;
        state.authenticating = false;
    },

    loginError(state, {errorCode, errorMessage}) {
        state.authenticating = false;
        state.authenticationErrorCode = errorCode;
        state.authenticationError = errorMessage
    },

    logoutSuccess(state) {
        state.accessToken = ''
    }
};

export const auth = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};