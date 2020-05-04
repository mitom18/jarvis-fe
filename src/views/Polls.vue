<template>
    <div>
        <Navbar/>
        <b-container class="pt-4">
            <div class="mb-2">
                <b-button size="sm" variant="primary" v-b-toggle.new-poll-form>
                    <b-icon-plus/>
                    New poll
                </b-button>
                <b-collapse id="new-poll-form" class="mt-2">
                    <b-card>
                        <PollForm @refreshPolls="handleRefresh"/>
                    </b-card>
                </b-collapse>
            </div>
            <PollsList :key="renderKey"/>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import PollsList from "../components/PollsList";
    import PollForm from "../components/PollForm";

    export default {
        name: "Polls",
        components: {
            PollForm,
            Navbar,
            PollsList
        },
        data() {
            return {
                renderKey: 0
            };
        },
        methods: {
            handleRefresh() {
                this.renderKey++;
                this.$root.$emit('bv::toggle::collapse', 'new-poll-form');
            }
        }
    }
</script>

<style scoped>

</style>