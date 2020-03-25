<template>
    <div>
        <Navbar/>
        <b-container>
            <b-list-group v-if="notes.length" class="pt-4">
                <b-list-group-item v-bind:key="note.index" v-for="note in notes" class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">{{note.name}}</h5>
                        <b-button-group size="sm" class="mr-1">
                            <b-button size="sm" variant="warning">
                                <b-icon-pencil></b-icon-pencil>
                            </b-button>
                            <b-button size="sm" variant="danger">
                                <b-icon-trash></b-icon-trash>
                            </b-button>
                        </b-button-group>
                    </div>

                    <p class="mb-2">
                        {{note.description}}
                    </p>

                    <small>{{new Date(note.timeCreated).toLocaleDateString()}}</small>
                </b-list-group-item>
            </b-list-group>
            <div v-else class="d-flex justify-content-center mt-5">
                <b-spinner label="Loading..."></b-spinner>
            </div>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import ApiService from "../services/api.service";

    export default {
        name: "Notes",
        components: {
            Navbar
        },
        data() {
            return {
                notes: []
            };
        },
        mounted() {
            ApiService.get('/notes')
                .then(response => {
                    this.notes = response.data;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
</script>

<style scoped>

</style>