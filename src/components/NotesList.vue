<template>
    <div>
        <b-form inline
                class="mt-4 mb-4 justify-content-between"
                @submit.stop.prevent>
            <b-form-row inline
                        class="m-0">
                <datetime type="date"
                          input-class="form-control mr-2"
                          v-model="fromInput"
                          placeholder="From"
                          @input="loadNotes"
                ></datetime>
                <datetime type="date"
                          input-class="form-control"
                          v-model="toInput"
                          placeholder="To"
                          @input="loadNotes"
                ></datetime>
            </b-form-row>

            <b-form-input v-model="searchInput"
                          placeholder="Search by note name"
                          type="search"
                          @input="loadNotes"
            ></b-form-input>
        </b-form>
        <b-list-group v-if="!loading && notes.length">
            <b-list-group-item v-bind:key="note.name" v-for="note in notes" class="flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{note.name}}</h5>
                    <b-button-group size="sm" class="mr-1">
                        <b-button size="sm"
                                  variant="warning"
                                  v-b-modal="'edit-' + note.name"
                                  v-b-tooltip="'Edit note'">
                            <b-icon-pencil/>
                        </b-button>
                        <b-button size="sm"
                                  variant="danger"
                                  @click="deleteNote(note.name)"
                                  v-b-tooltip="'Delete note'">
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
        <b-alert v-else variant="secondary" :show="true">No notes found.</b-alert>
    </div>
</template>

<script>
    import ApiService from "../services/api.service";
    import NoteForm from "./NoteForm";
    import {DateTime} from "luxon";

    export default {
        components: {
            NoteForm
        },
        data() {
            return {
                loading: true,
                searchInput: '',
                fromInput: DateTime.local().toISO(),
                toInput: '',
                notes: []
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
                        if (this.fromInput !== '') {
                            this.notes = this.notes.filter(note => {
                                const noteTime = DateTime.fromISO(note.timeCreated);
                                const fromDiff = noteTime.diff(DateTime.fromISO(this.fromInput));
                                return Math.floor(fromDiff.as('days')) >= 0;
                            });
                        }
                        if (this.toInput !== '') {
                            this.notes = this.notes.filter(note => {
                                const noteTime = DateTime.fromISO(note.timeCreated);
                                const toDiff = noteTime.diff(DateTime.fromISO(this.toInput));
                                return Math.floor(toDiff.as('days')) <= 0;
                            });
                        }
                        this.notes = this.notes.filter(note => {
                            return note.name.indexOf(this.searchInput) !== -1;
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        this.$errorMsg(err);
                    })
                    .finally(() => this.loading = false);
            },

            deleteNote(noteName) {
                if (confirm('Do you really want to delete note "' + noteName + '"?')) {
                    ApiService.delete('/notes/' + noteName)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('Note ' + noteName + ' was successfully deleted.');
                            this.loadNotes();
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