<template>
    <main class="min-vh-100">
        <b-jumbotron fluid class="main-header">
            <template v-slot:header>J.A.R.V.I.S.</template>

            <template v-slot:lead>
                Sign in to use my service, please.
            </template>

            <hr class="my-4">

            <b-button v-on:click="authorize">Sign in</b-button>
        </b-jumbotron>
    </main>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

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
    main {
        background-color: #e9ecef;
    }

    .main-header h1 {
        letter-spacing: .7rem;
    }

    @media (max-width: 500px) {
        .main-header h1 {
            font-size: 2.5rem;
        }
    }
</style>