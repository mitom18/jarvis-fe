<template>
    <b-container>
        <div v-if="notes.length">
            <b-row>
                <div v-bind:key="data.index" v-for="data in notes">
                    <b-col l="4">
                        <b-card
                                v-bind:title="data.name"
                                tag="article"
                                style="max-width: 20rem;"
                                class="mb-2 mt-2">
                            <b-card-text>{{ `${data.description.slice(0,100)}...` }}</b-card-text>
                            <b-button href="#" variant="secondary">View food</b-button>
                        </b-card>
                    </b-col>
                </div>
            </b-row>
        </div>
        <div v-else>
            <h5>No items available yet 😢</h5>
        </div>
    </b-container>
</template>

<script>
    import ApiService from "../services/api.service";

    export default {
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
    };
</script>