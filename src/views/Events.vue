<template>
    <div>
        <Navbar/>
        <b-container class="pt-4">
            <b-list-group v-if="events.length">
                <b-list-group-item v-bind:key="event.index" v-for="event in events" class="flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">{{event.name}}</h5>
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
                        {{event.description}}
                    </p>

                    <small>{{new Date(event.timeCreated).toLocaleDateString()}}</small>
                </b-list-group-item>
            </b-list-group>
            <div v-else-if="loading" class="d-flex justify-content-center">
                <b-spinner label="Loading..."></b-spinner>
            </div>
            <b-alert v-else variant="secondary" show="true">No events found.</b-alert>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import ApiService from "../services/api.service";

    export default {
        name: "Events",
        components: {
            Navbar
        },
        data() {
            return {
                loading: true,
                events: []
            };
        },
        mounted() {
            ApiService.get('/events')
                .then(response => {
                    this.events = response.data;
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => this.loading = false);
        }
    }
</script>

<style scoped>

</style>