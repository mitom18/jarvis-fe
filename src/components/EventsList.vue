<template>
    <b-list-group v-if="!loading && events.length">
        <b-list-group-item v-bind:key="event.name" v-for="event in events" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{event.name}}</h5>
                <b-button-group size="sm" class="mr-1">
                    <b-button v-if="event.author.id === user.id"
                              size="sm"
                              variant="warning"
                              v-b-modal="'edit-' + event.name"
                              v-b-tooltip="'Edit event'"
                    >
                        <b-icon-pencil/>
                    </b-button>
                    <b-button v-if="event.author.id === user.id"
                              size="sm"
                              variant="danger"
                              @click="deleteEvent(event)"
                              v-b-tooltip="'Delete event'"
                    >
                        <b-icon-trash/>
                    </b-button>
                </b-button-group>
            </div>

            <table class="time-table mt-2 mb-3">
                <tr>
                    <td class="pr-3">
                        <b-icon-clock/>
                        From:
                    </td>
                    <td>{{event.startTime}}</td>
                </tr>
                <tr>
                    <td class="pr-3">
                        <b-icon-clock/>
                        To:
                    </td>
                    <td>{{event.endTime}}</td>
                </tr>
            </table>

            <b-modal v-if="event.author.id === user.id" :id="'edit-' + event.name" centered :title="event.name"
                     hide-footer>
                <EventForm :event="event" @refreshEvents="handleRefresh('edit-' + event.name)"/>
            </b-modal>

            <p class="mb-3">
                {{event.description}}
            </p>

            <EventParticipants :event="event" @refreshEvents="handleRefresh()"/>
        </b-list-group-item>
    </b-list-group>
    <div v-else-if="loading" class="d-flex justify-content-center">
        <b-spinner label="Loading..."></b-spinner>
    </div>
    <b-alert v-else variant="secondary" :show="true">No events found.</b-alert>
</template>

<script>
    import ApiService from "../services/api.service";
    import EventForm from "./EventForm";
    import {mapGetters} from "vuex";
    import EventParticipants from "./EventParticipants";

    export default {
        components: {
            EventParticipants,
            EventForm
        },
        data() {
            return {
                user: null,
                loading: true,
                events: [],
                selectedSort: 'desc',
                sortOptions: [
                    {value: 'desc', text: 'Newest first'},
                    {value: 'asc', text: 'Oldest first'}
                ],
                sortFunctions: {
                    desc: (a, b) => {
                        if (a === b) return 0;
                        if (a < b) return 1;
                        return -1;
                    },
                    asc: (a, b) => {
                        if (a === b) return 0;
                        if (a < b) return -1;
                        return 1;
                    },
                }
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
            this.loadEvents();
        },
        methods: {
            handleRefresh(modalId = null) {
                this.loadEvents();
                if (modalId !== null) this.$bvModal.hide(modalId);
            },

            loadEvents() {
                this.loading = true;
                ApiService.get('/events')
                    .then(response => {
                        this.events = response.data;
                        this.events.sort(this.sortFunctions[this.selectedSort]);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => this.loading = false);
            },

            deleteEvent(event) {
                if (confirm('Do you really want to cancel event "' + event.name + '"?')) {
                    ApiService.delete('/events/' + event.id)
                        .then(response => {
                            console.log(response);
                            this.$successMsg('Event ' + event.name + ' was successfully canceled.');
                            this.loadEvents();
                        })
                        .catch(err => {
                            console.log(err);
                            this.$errorMsg(err);
                        })
                }
            }
        }
    };
</script>

<style scoped>
    .time-table {
        font-weight: bold;
    }
</style>