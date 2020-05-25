<template>
    <div>
        <b-form inline
                class="mt-4 mb-4 justify-content-between"
                @submit.stop.prevent>
            <b-form-row inline
                        class="m-0">
                <datetime type="datetime"
                          input-class="form-control mr-2"
                          v-model="fromInput"
                          placeholder="From"
                          @input="loadEvents"
                ></datetime>
                <datetime type="datetime"
                          input-class="form-control"
                          v-model="toInput"
                          placeholder="To"
                          @input="loadEvents"
                ></datetime>
            </b-form-row>

            <b-form-input v-model="searchInput"
                          placeholder="Search by event name"
                          type="search"
                          @input="loadEvents"
            ></b-form-input>
        </b-form>
        <b-list-group v-if="!loading && events.length">
            <b-list-group-item v-bind:key="event.id" v-for="event in events" class="flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{event.name}}</h5>
                    <b-button-group size="sm" class="mr-1">
                        <b-button v-if="user !== null && event.author.id === user.id"
                                  size="sm"
                                  variant="warning"
                                  v-b-modal="'edit-' + event.name"
                                  v-b-tooltip="'Edit event'"
                        >
                            <b-icon-pencil/>
                        </b-button>
                        <b-button v-if="user !== null && event.author.id === user.id"
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

                <b-modal v-if="user !== null && event.author.id === user.id" :id="'edit-' + event.name" centered
                         :title="event.name" hide-footer>
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
    </div>
</template>

<script>
    import ApiService from "../services/api.service";
    import EventForm from "./EventForm";
    import {mapGetters} from "vuex";
    import EventParticipants from "./EventParticipants";
    import {DateTime} from "luxon";

    export default {
        components: {
            EventParticipants,
            EventForm
        },
        data() {
            return {
                user: null,
                loading: true,
                searchInput: '',
                fromInput: DateTime.local().toISO(),
                toInput: '',
                events: []
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
                        if (this.fromInput !== '') {
                            this.events = this.events.filter(event => {
                                const eventTo = DateTime.fromFormat(event.endTime, "dd.MM.yyyy HH:mm");
                                const toFromDiff = eventTo.diff(DateTime.fromISO(this.fromInput));
                                return Math.floor(toFromDiff.as('minutes')) >= 0;
                            });
                        }
                        if (this.toInput !== '') {
                            this.events = this.events.filter(event => {
                                const eventFrom = DateTime.fromFormat(event.startTime, "dd.MM.yyyy HH:mm");
                                const fromToDiff = eventFrom.diff(DateTime.fromISO(this.toInput));
                                return Math.floor(fromToDiff.as('minutes')) <= 0;
                            });
                        }
                        this.events = this.events.filter(event => {
                            return event.name.indexOf(this.searchInput) !== -1;
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.$errorMsg(err)
                    })
                    .finally(() => this.loading = false);
            },

            deleteEvent(event) {
                if (confirm('Do you really want to cancel event "' + event.name + '"?')) {
                    ApiService.delete('/events/' + event.id)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('Event ' + event.name + ' was successfully canceled.');
                            this.loadEvents();
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

<style scoped>
    .time-table {
        font-weight: bold;
    }
</style>