<template>
    <div>
        <h1>Hello world</h1>
        <p v-if="user !== null">{{user.username}}</p>
        <b-button v-on:click="logout">Logout</b-button>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Home",

        data() {
            return {
                user: null
            }
        },
        computed: {
            ...mapGetters('auth', [
                'userInfo'
            ])
        },
        mounted: async function () {
            await this.userInfo.then(response => {
                this.user = response.data;
            })
        },
        methods: {
            ...mapActions('auth', [
                'logout'
            ])
        }
    }
</script>

<style scoped>

</style>