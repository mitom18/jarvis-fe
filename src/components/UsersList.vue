<template>
    <div>
        <b-form inline class="mb-4">
            <b-form-group label="State:"
                          label-for="state-select"
                          label-class="mr-2">
                <b-select id="state-select"
                          :options="states"
                          v-model="selectedState"
                          class="mr-sm-2"
                          @change="loadUsers"
                ></b-select>
            </b-form-group>
        </b-form>
        <b-list-group v-if="!loading && users.length">
            <b-list-group-item v-bind:key="userEntity.id" v-for="userEntity in users"
                               class="flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{userEntity.username}}</h5>
                    <b-button-group size="sm" class="mr-1">
                        <b-button v-if="user !== null && userEntity.id !== user.id"
                                  size="sm"
                                  variant="primary"
                                  @click="promoteUser(userEntity)"
                        >
                            Promote
                        </b-button>
                        <b-button v-if="user !== null && userEntity.id !== user.id"
                                  size="sm"
                                  variant="success"
                                  @click="unbanUser(userEntity)"
                        >
                            Unban
                        </b-button>
                        <b-button v-if="user !== null && userEntity.id !== user.id"
                                  size="sm"
                                  variant="danger"
                                  @click="banUser(userEntity)"
                        >
                            Ban
                        </b-button>
                    </b-button-group>
                </div>

                <table class="time-table mt-2 mb-3">
                    <tr>
                        <td class="pr-3">
                            <b-icon-person/>
                            Discord ID:
                        </td>
                        <td>{{userEntity.discordId}}</td>
                    </tr>
                    <tr>
                        <td class="pr-3">
                            <b-icon-info-circle/>
                            Role:
                        </td>
                        <td>
                            <b-badge v-if="userEntity.admin" variant="primary">Administrator</b-badge>
                            <b-badge v-else>User</b-badge>
                        </td>
                    </tr>
                </table>
            </b-list-group-item>
        </b-list-group>
        <div v-else-if="loading" class="d-flex justify-content-center">
            <b-spinner label="Loading..."></b-spinner>
        </div>
        <b-alert v-else variant="secondary" :show="true">No {{selectedState}} users found.</b-alert>
    </div>
</template>

<script>
    import ApiService from "../services/api.service";
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                user: null,
                loading: true,
                users: [],
                selectedState: 'active',
                states: [
                    {value: 'active', text: 'Active'},
                    {value: 'banned', text: 'Banned'}
                ]
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
            });
            this.loadUsers();
        },
        methods: {
            loadUsers() {
                this.loading = true;
                ApiService.get('/users')
                    .then(response => {
                        this.users = response.data.filter((item) => {
                            if (this.selectedState === 'active') {
                                return item.banned === false;
                            }
                            return item.banned === true;
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.$errorMsg(err);
                    })
                    .finally(() => this.loading = false);
            },

            promoteUser(userEntity) {
                if (confirm('Do you really want to promote user "' + userEntity.username + '" to admin?')) {
                    ApiService.put(`/users/${userEntity.username}/promotion`)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('User ' + userEntity.username + ' was successfully promoted to admin.');
                            this.loadUsers();
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            },

            banUser(userEntity) {
                if (confirm('Do you really want to ban user "' + userEntity.username + '"?')) {
                    ApiService.delete('/users/' + userEntity.username)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('User ' + userEntity.username + ' was successfully banned.');
                            this.loadUsers();
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            },

            unbanUser(userEntity) {
                if (confirm('Do you really want to unban user "' + userEntity.username + '"?')) {
                    ApiService.put('/users/' + userEntity.username)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('User ' + userEntity.username + ' was successfully unbanned.');
                            this.loadUsers();
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            }
        }
    };
</script>