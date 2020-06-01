import axios from 'axios'
import {TokenService} from './storage.service'
import store from '../store'

const ApiService = {

    // Stores the 401 interceptor position so that it can be later ejected when needed
    _401interceptor: null,

    init(baseURL) {
        axios.defaults.baseURL = baseURL;
        axios.defaults.withCredentials = true;
    },

    setHeader() {
        axios.defaults.headers.common["Authorization"] = `Bearer ${TokenService.getToken()}`
    },

    removeHeader() {
        axios.defaults.headers.common = {}
    },

    get(resource) {
        return axios.get(resource)
    },

    getWithParams(resource, data) {
        return axios.get(resource, data)
    },

    post(resource, data) {
        return axios.post(resource, data)
    },

    put(resource, data) {
        return axios.put(resource, data)
    },

    delete(resource) {
        return axios.delete(resource)
    },

    /**
     * Perform a custom Axios request.
     *
     * data is an object containing the following properties:
     *  - method
     *  - url
     *  - data ... request payload
     *  - other optional parameters
     *
     *  @see https://github.com/axios/axios#request-config
     **/
    customRequest(data) {
        return axios(data)
    },

    mount401Interceptor() {
        this._401interceptor = axios.interceptors.response.use(
            (response) => {
                return response
            },
            async (error) => {
                if (error.request.status === 401) {
                    // Logout if error code was 401
                    await store.dispatch('auth/logout');
                } else {
                    // If error was not 401 just reject as is
                    throw error
                }
            }
        )
    },

    unmount401Interceptor() {
        // Eject the interceptor
        axios.interceptors.response.eject(this._401interceptor)
    }
};

export default ApiService