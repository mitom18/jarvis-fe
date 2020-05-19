<template>
    <div>
        <Navbar/>
        <b-container class="pt-4 pb-4">
            <RegistrationApplicationsList :key="renderKey"/>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import RegistrationApplicationsList from "../components/RegistrationApplicationsList";

    export default {
        name: "RegistrationApplications",
        components: {
            Navbar,
            RegistrationApplicationsList
        },
        data() {
            return {
                renderKey: 0
            };
        },
        methods: {
            handleRefresh() {
                this.renderKey++;
            }
        }
    }
</script>

<style scoped>

</style>