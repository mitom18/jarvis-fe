<template>
    <b-list-group v-if="!loading && notes.length">
        <!-- TODO add filters from BE part of application -->
        <b-list-group-item>
            <b-form-select v-model="selectedSort"
                           :options="sortOptions"
                           size="sm"
                           class="w-25"
                           @change="loadNotes"
            ></b-form-select>
        </b-list-group-item>
        <b-list-group-item v-bind:key="note.name" v-for="note in notes" class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{note.name}}</h5>
                <b-button-group size="sm" class="mr-1">
                    <b-button size="sm" variant="warning" v-b-modal="'edit-' + note.name">
                        <b-icon-pencil/>
                    </b-button>
                    <b-button size="sm" variant="danger" @click="deleteNote(note.name)">
                        <b-icon-trash/>
                    </b-button>
                </b-button-group>
            </div>

            <b-modal :id="'edit-' + note.name" centered :title="note.name" hide-footer>
                <NoteForm :note="note" @refreshNotes="handleRefresh('edit-' + note.name)"/>
            </b-modal>

            <p class="mb-2">
                {{note.description}}
            </p>

            <small>{{new Date(note.timeCreated).toLocaleDateString()}}</small>
        </b-list-group-item>
    </b-list-group>
    <div v-else-if="loading" class="d-flex justify-content-center">
        <b-spinner label="Loading..."></b-spinner>
    </div>
    <b-alert v-else variant="secondary" show="true">No notes found.</b-alert>
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
                notes: [],
                selectedSort: 'desc',
                sortOptions: [
                    { value: 'desc', text: 'Newest first'},
                    { value: 'asc', text: 'Oldest first' }
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
            this.loadNotes();
        },
        methods: {
            handleRefresh(modalId) {
                this.loadNotes();
                this.$bvModal.hide(modalId);
            },

            loadNotes() {
                this.loading = true;
                ApiService.get('/notes')
                    .then(response => {
                        this.notes = response.data;
                        this.notes.sort(this.sortFunctions[this.selectedSort]);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => this.loading = false);
            },

            deleteNote(noteName) {
                if (confirm('Do you really want to delete note ' + noteName + '?')) {
                    ApiService.delete('/notes/' + noteName)
                        .then(response => {
                            console.log(response);
                            this.$successMsg('Note ' + noteName + ' was successfully deleted.');
                            this.loadNotes();
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