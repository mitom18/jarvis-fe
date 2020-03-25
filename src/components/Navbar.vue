<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-container>
                <b-navbar-brand href="/">J.A.R.V.I.S.</b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto white-links">
                        <router-link to="/notes" tag="b-nav-item">Notes</router-link>
                        <router-link to="/" tag="b-nav-item">Events</router-link>
                        <router-link to="/" tag="b-nav-item">Polls</router-link>
                        <b-nav-item-dropdown right>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">{{user ? user.username : ""}}</template>
                            <b-dropdown-item href="#">Profile</b-dropdown-item>
                            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
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
    .white-links >>> a.nav-link {
        color: white !important;
    }

    .router-link-exact-active {
        font-weight: bold;
    }
</style>