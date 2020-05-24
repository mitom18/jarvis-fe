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
                          @change="loadRegApplications"
                ></b-select>
            </b-form-group>
        </b-form>
        <b-list-group v-if="!loading && regApplications.length">
            <b-list-group-item v-bind:key="regApp.id" v-for="regApp in regApplications"
                               class="flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{regApp.username}}</h5>
                    <b-button-group size="sm" class="mr-1">
                        <b-button v-if="user !== null && regApp.state === 'WAITING'"
                                  size="sm"
                                  variant="success"
                                  @click="approveRegApplication(regApp)"
                                  v-b-tooltip="'Approve'"
                        >
                            <b-icon-check/>
                        </b-button>
                        <b-button v-if="user !== null && regApp.state === 'WAITING'"
                                  size="sm"
                                  variant="danger"
                                  @click="rejectRegApplication(regApp)"
                                  v-b-tooltip="'Reject'"
                        >
                            <b-icon-x/>
                        </b-button>
                    </b-button-group>
                </div>

                <table class="time-table mt-2 mb-3">
                    <tr>
                        <td class="pr-3">
                            <b-icon-person/>
                            Discord ID:
                        </td>
                        <td>{{regApp.discordId}}</td>
                    </tr>
                    <tr>
                        <td class="pr-3">
                            <b-icon-clock/>
                            Created:
                        </td>
                        <td>{{(new Date(regApp.timeCreated)).toLocaleString()}}</td>
                    </tr>
                    <tr v-if="regApp.timeAssessed !== undefined">
                        <td class="pr-3">
                            <b-icon-clock/>
                            Assessed:
                        </td>
                        <td>{{(new Date(regApp.timeAssessed)).toLocaleString()}}</td>
                    </tr>
                    <tr v-if="regApp.timeAssessed !== undefined">
                        <td class="pr-3">
                            <b-icon-info-circle/>
                            State:
                        </td>
                        <td>{{regApp.state}}</td>
                    </tr>
                </table>
            </b-list-group-item>
        </b-list-group>
        <div v-else-if="loading" class="d-flex justify-content-center">
            <b-spinner label="Loading..."></b-spinner>
        </div>
        <b-alert v-else variant="secondary" :show="true">No {{selectedState}} registration applications found.</b-alert>
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
                regApplications: [],
                selectedState: 'waiting',
                states: [
                    {value: 'waiting', text: 'Waiting'},
                    {value: 'approved', text: 'Approved'},
                    {value: 'rejected', text: 'Rejected'}
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
            this.loadRegApplications();
        },
        methods: {
            loadRegApplications() {
                this.loading = true;
                ApiService.get(`/registration_applications/${this.selectedState}`)
                    .then(response => {
                        this.regApplications = response.data;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => this.loading = false);
            },

            approveRegApplication(regApp) {
                if (confirm('Do you really want to approve registration application for user "' + regApp.username + '"?')) {
                    ApiService.put('/registration_applications/' + regApp.id)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('User ' + regApp.username + ' was successfully registered.');
                            this.loadRegApplications();
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            },

            rejectRegApplication(regApp) {
                if (confirm('Do you really want to reject registration application for user "' + regApp.username + '"?')) {
                    ApiService.delete('/registration_applications/' + regApp.id)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('Registration application for user ' + regApp.username + ' was rejected.');
                            this.loadRegApplications();
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