<template>
    <div>
        <notifications :group="notificationGroup">
            <template slot="body" slot-scope="props">
                <b-toast :id="props.item.key"
                         :variant="props.item.type"
                         :title="props.item.title"
                         class="m-2"
                         static
                         solid
                         visible>
                    {{props.item.text}}
                </b-toast>
            </template>
        </notifications>
        <router-view></router-view>
    </div>
</template>
<script>
    import {NOTIFICATION_GROUP} from "./services/notification.service";

    export default {
        data() {
            return {
                notificationGroup: NOTIFICATION_GROUP
            }
        }
    }
</script>
<style>
    label.required::after {
        content: "*";
        color: red;
    }
</style>