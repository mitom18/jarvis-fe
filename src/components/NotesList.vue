<template>
    <b-list-group v-if="!loading && notes.length">
        <!-- TODO add filters from BE part of application -->
        <b-list-group-item>
            <b-form inline>
                <label class="mr-sm-2" for="month-select">Month:</label>
                <b-select id="month-select"
                          :options="months"
                          v-model="selectedMonth"
                          class="mr-sm-2"
                ></b-select>
                <label class="mr-sm-2" for="year-select">Year:</label>
                <b-select id="year-select"
                          :options="years"
                          v-model="selectedYear"
                          class="mr-sm-2"
                ></b-select>
                <b-button type="submit" @click="filterNotes">Filter</b-button>
            </b-form>
            <b-form inline class="d-flex justify-content-end">
                <label class="mr-sm-2" for="sort-select">Sort:</label>
                <b-select id="sort-select"
                          v-model="selectedSort"
                          :options="sortOptions"
                          size="sm"
                          @change="loadNotes"
                ></b-select>
            </b-form>
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
    <b-alert v-else variant="secondary" :show="true">No notes found.</b-alert>
</template>

<script>
    import ApiService from "../services/api.service";
    import NoteForm from "./NoteForm";

    export default {
        components: {
            NoteForm
        },
        data() {
            const date = new Date();
            return {
                loading: true,
                selectedYear: date.getFullYear(),
                years: [
                    {value: null, text: 'All'},
                    {value: 2016, text: '2016'},
                    {value: 2017, text: '2017'},
                    {value: 2018, text: '2018'},
                    {value: 2019, text: '2019'},
                    {value: 2020, text: '2020'}
                ],
                selectedMonth: date.getMonth() + 1,
                months: [
                    {value: null, text: 'All'},
                    {value: 1, text: 'January'},
                    {value: 2, text: 'February'},
                    {value: 3, text: 'March'},
                    {value: 4, text: 'April'},
                    {value: 5, text: 'May'},
                    {value: 6, text: 'June'},
                    {value: 7, text: 'July'},
                    {value: 8, text: 'August'},
                    {value: 9, text: 'September'},
                    {value: 10, text: 'October'},
                    {value: 11, text: 'November'},
                    {value: 12, text: 'December'}
                ],
                notes: [],
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
            this.loadNotes();
        },
        methods: {
            handleRefresh(modalId) {
                this.loadNotes();
                this.$bvModal.hide(modalId);
            },

            filterNotes() {
                if (this.selectedMonth == null || this.selectedYear == null) {
                    this.loadNotes();
                    return;
                }

                this.loading = true;
                // TODO fix filtering
                ApiService.getWithParams('/notes/date', {
                    year: this.selectedYear,
                    month: this.selectedMonth
                })
                    .then(response => {
                        this.notes = response.data;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => this.loading = false);
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
                if (confirm('Do you really want to delete note "' + noteName + '"?')) {
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