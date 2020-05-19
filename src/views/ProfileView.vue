<template>
    <div>
        <Navbar/>
        <b-container class="pt-4">
            <b-card v-if="user">
                <b-media>
                    <template v-slot:aside>
                        <b-avatar width="64"></b-avatar>
                    </template>

                    <table class="w-100">
                        <tr>
                            <th class="w-25">Username:</th>
                            <td>{{user.username}}</td>
                        </tr>
                        <tr>
                            <th class="w-25">Discord ID:</th>
                            <td>{{user.discordId}}</td>
                        </tr>
                        <tr>
                            <th class="w-25">Role</th>
                            <td>
                                <b-badge v-if="user.admin" variant="primary">Administrator</b-badge>
                                <b-badge v-else>User</b-badge>
                            </td>
                        </tr>
                    </table>
                </b-media>
            </b-card>
            <b-alert v-else-if="error" variant="danger" show="true">
                Nepodařilo se načíst data o uživateli. Přihlaste se prosím a zkuste to znovu.
            </b-alert>
            <div v-else class="d-flex justify-content-center">
                <b-spinner label="Loading..."></b-spinner>
            </div>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import {mapGetters} from "vuex";

    export default {
        name: "ProfileView",
        components: {
            Navbar
        },
        data() {
            return {
                error: false,
                user: null
            };
        },
        computed: {
            ...mapGetters('auth', [
                'userInfo'
            ])
        },
        mounted() {
            this.userInfo.then(response => {
                this.user = response.data;
            }).catch(error => {
                this.error = true;
                console.error(error);
            });
        }
    }
</script>

<style scoped>

</style>