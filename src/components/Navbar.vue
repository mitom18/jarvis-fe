<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="secondary">
            <b-container>
                <router-link :to="'/'" tag="b-navbar-brand">J.A.R.V.I.S.</router-link>
                <Clock/>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto white-links">
                        <router-link to="/notes" tag="b-nav-item">Notes</router-link>
                        <router-link to="/events" tag="b-nav-item">Events</router-link>
                        <router-link to="/polls" tag="b-nav-item">Polls</router-link>
                        <router-link v-if="this.user !== null && this.user.role === ADMIN_ROLE"
                                     to="/registrations" tag="b-nav-item">Registrations
                        </router-link>
                        <router-link to="/picture2ascii" tag="b-nav-item">Picture2ASCII</router-link>
                        <b-nav-item-dropdown right>
                            <!-- Using 'button-content' slot -->
                            <template slot="button-content">{{user ? user.username : ""}}</template>
                            <router-link to="/profile" tag="b-dropdown-item">Profile</router-link>
                            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
    import {UserService} from '../services/user.service';
    import {mapActions, mapGetters} from "vuex";
    import Clock from "./Clock";

    export default {
        components: {
            Clock
        },
        data() {
            return {
                user: null,
                ADMIN_ROLE: UserService.ADMIN_ROLE
            }
        },
        computed: {
            ...mapGetters('auth', [
                'userInfo'
            ])
        },
        mounted() {
            this.userInfo.then(response => {
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

    .navbar-brand {
        font-weight: normal;
        cursor: pointer;
    }

    @media screen and (max-width: 992px) {
        a.navbar-brand {
            margin-right: 0;
        }
    }
</style>