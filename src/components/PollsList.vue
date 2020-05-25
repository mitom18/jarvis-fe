<template>
    <div>
        <b-form inline
                class="mt-4 mb-4 justify-content-between"
                @submit.stop.prevent>
            <b-checkbox switch
                        v-model="finishedChecked"
                        @input="loadPolls"
            >
                {{finishedChecked ? 'Finished' : 'Active'}}
            </b-checkbox>

            <b-form-input v-model="searchInput"
                          placeholder="Search by poll name"
                          type="search"
                          @input="loadPolls"
            ></b-form-input>
        </b-form>
        <b-list-group v-if="!loading && polls.length">
            <b-list-group-item v-bind:key="poll.id" v-for="poll in polls" class="flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{poll.name}}</h5>
                    <b-button-group size="sm" class="mr-1">
                        <b-button v-if="user !== null && poll.author.id === user.id && !poll.finished"
                                  size="sm"
                                  variant="warning"
                                  v-b-modal="'edit-' + poll.id"
                                  v-b-tooltip="'Edit poll'">
                            <b-icon-pencil/>
                        </b-button>
                        <b-button v-if="user !== null && user.admin && !poll.finished"
                                  size="sm"
                                  variant="danger"
                                  @click="deletePoll(poll)"
                                  v-b-tooltip="'Delete poll'">
                            <b-icon-trash/>
                        </b-button>
                    </b-button-group>
                </div>

                <b-modal v-if="user !== null && poll.author.id === user.id && !poll.finished" :id="'edit-' + poll.id"
                         centered :title="poll.name" hide-footer>
                    <PollForm :poll="poll" @refreshPolls="handleRefresh('edit-' + poll.id)"/>
                </b-modal>

                <p class="mb-2">
                    {{poll.description}}
                </p>

                <PollVotes :poll="poll" @refreshPolls="handleRefresh()"/>
            </b-list-group-item>
        </b-list-group>
        <div v-else-if="loading" class="d-flex justify-content-center">
            <b-spinner label="Loading..."></b-spinner>
        </div>
        <b-alert v-else variant="secondary" :show="true">No polls found.</b-alert>
    </div>
</template>

<script>
    import ApiService from "../services/api.service";
    import PollForm from "./PollForm";
    import {mapGetters} from "vuex";
    import PollVotes from "./PollVotes";

    export default {
        components: {
            PollVotes,
            PollForm
        },
        data() {
            return {
                user: null,
                loading: true,
                polls: [],
                finishedChecked: false,
                searchInput: ''
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
                ApiService.get(`/polls${this.finishedChecked ? '/finished' : ''}`)
                    .then(response => {
                        this.polls = response.data;
                        this.polls = this.polls.filter(poll => {
                            return poll.name.indexOf(this.searchInput) !== -1;
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    })
                    .finally(() => this.loading = false);
            },

            deletePoll(poll) {
                if (confirm('Do you really want to delete poll "' + poll.name + '"?')) {
                    ApiService.delete('/polls/' + poll.id)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('Poll ' + poll.name + ' was successfully deleted.');
                            this.loadPolls();
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