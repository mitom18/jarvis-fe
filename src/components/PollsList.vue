<template>
    <b-list-group v-if="!loading && polls.length">
        <b-list-group-item v-bind:key="poll.id" v-for="poll in polls" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{poll.name}}</h5>
                <b-button-group size="sm" class="mr-1">
                    <b-button v-if="poll.author.id === user.id"
                              size="sm"
                              variant="warning"
                              v-b-modal="'edit-' + poll.id"
                              v-b-tooltip="'Edit poll'">
                        <b-icon-pencil/>
                    </b-button>
                    <b-button v-if="user.admin && !poll.finished"
                              size="sm"
                              variant="danger"
                              @click="deletePoll(poll)"
                              v-b-tooltip="'Delete poll'">
                        <b-icon-trash/>
                    </b-button>
                </b-button-group>
            </div>

            <b-modal :id="'edit-' + poll.id" centered :title="poll.name" hide-footer>
                <PollForm :poll="poll" @refreshPolls="handleRefresh('edit-' + poll.id)"/>
            </b-modal>

            <p class="mb-2">
                {{poll.description}}
            </p>

<!--            TODO poll voting <EventParticipants :event="event" @refreshEvents="handleRefresh()"/>-->
        </b-list-group-item>
    </b-list-group>
    <div v-else-if="loading" class="d-flex justify-content-center">
        <b-spinner label="Loading..."></b-spinner>
    </div>
    <b-alert v-else variant="secondary" :show="true">No polls found.</b-alert>
</template>

<script>
    import ApiService from "../services/api.service";
    import PollForm from "./PollForm";
    import {mapGetters} from "vuex";

    export default {
        components: {
            PollForm
        },
        data() {
            return {
                user: null,
                loading: true,
                polls: [],
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
            this.loadPolls();
        },
        methods: {
            handleRefresh(modalId) {
                this.loadPolls();
                this.$bvModal.hide(modalId);
            },

            loadPolls() {
                this.loading = true;
                ApiService.get('/polls')
                    .then(response => {
                        this.polls = response.data;
                        this.polls.sort(this.sortFunctions[this.selectedSort]);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => this.loading = false);
            },

            deletePoll(poll) {
                if (confirm('Do you really want to delete poll "' + poll.name + '"?')) {
                    ApiService.delete('/polls/' + poll.id)
                        .then(response => {
                            console.log(response);
                            this.$successMsg('Poll ' + poll.name + ' was successfully deleted.');
                            this.loadPolls();
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