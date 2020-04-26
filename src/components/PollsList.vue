<template>
    <b-list-group v-if="!loading && polls.length">
        <b-list-group-item v-bind:key="poll.name" v-for="poll in polls" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{poll.name}}</h5>
                <b-button-group size="sm" class="mr-1">
                    <b-button size="sm" variant="warning" v-b-modal="'edit-' + poll.name">
                        <b-icon-pencil/>
                    </b-button>
                    <b-button size="sm" variant="danger">
                        <b-icon-trash/>
                    </b-button>
                </b-button-group>
            </div>

            <b-modal :id="'edit-' + poll.name" centered :title="poll.name" hide-footer>
                <NoteForm :note="poll" @refreshNotes="handleRefresh('edit-' + poll.name)"/>
            </b-modal>

            <p class="mb-2">
                {{poll.description}}
            </p>
        </b-list-group-item>
    </b-list-group>
    <div v-else-if="loading" class="d-flex justify-content-center">
        <b-spinner label="Loading..."></b-spinner>
    </div>
    <b-alert v-else variant="secondary" :show="true">No polls found.</b-alert>
</template>

<script>
    import ApiService from "../services/api.service";
    import NoteForm from "./NoteForm";

    export default {
        components: {
            NoteForm
        },
        data() {
            return {
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
        mounted() {
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
            }
        }
    };
</script>