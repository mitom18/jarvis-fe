<template>
    <div>
        <Navbar/>
        <b-container class="pt-4">
            <div class="mb-2">
                <b-button size="sm" variant="primary" v-b-toggle.new-note-form><b-icon-plus/> New event</b-button>
                <b-collapse id="new-note-form" class="mt-2">
                    <b-card>
                        <EventForm @refreshEvents="handleRefresh"/>
                    </b-card>
                </b-collapse>
            </div>
            <EventsList :key="renderKey"/>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import EventsList from "../components/EventsList";
    import EventForm from "../components/EventForm";

    export default {
        name: "Events",
        components: {
            Navbar,
            EventsList,
            EventForm
        },
        data() {
            return {
                renderKey: 0
            };
        },
        methods: {
            handleRefresh() {
                this.renderKey++;
                this.$root.$emit('bv::toggle::collapse', 'new-note-form');
            }
        }
    }
</script>

<style scoped>

</style>