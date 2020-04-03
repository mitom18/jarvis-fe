import Vue from 'vue'

const NOTIFICATION_GROUP = 'app';

const NotificationService = {
    init() {
        this.createSuccessNotification();
        this.createErrorNotification();
        this.createInfoNotification();
    },
    createSuccessNotification() {
        Vue.prototype.$successMsg = function (text) {
            Vue.prototype.$notify({
                text,
                group: NOTIFICATION_GROUP,
                type: "success",
                title: "Success",
            })
        }
    },
    createErrorNotification() {
        Vue.prototype.$errorMsg = function (text) {
            Vue.prototype.$notify({
                text,
                group: NOTIFICATION_GROUP,
                type: "danger",
                title: "Error",
            })
        }
    },
    createInfoNotification() {
        Vue.prototype.$infoMsg = function (text) {
            Vue.prototype.$notify({
                text,
                group: NOTIFICATION_GROUP,
                type: "primary",
                title: "Info",
            })
        }
    }
};

export default NotificationService
export {NOTIFICATION_GROUP}