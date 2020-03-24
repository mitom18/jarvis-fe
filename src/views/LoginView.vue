<template>
    <div>
        <h1>Login</h1>
        <b-button v-on:click="authorize">Login</b-button>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "login",

        mounted: function () {
            const sessionId = this.$route.query.id;
            if (sessionId) {
                this.$store.dispatch('auth/login', sessionId);
            }
        },

        computed: {
            ...mapGetters('auth', [
                'authenticating',
                'authenticationError',
                'authenticationErrorCode'
            ])
        },

        methods: {
            ...mapActions('auth', [
                'authorize',
                'login'
            ])
        }
    };
</script>

<style scoped>

</style>