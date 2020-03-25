<template>
    <main class="min-vh-100">
        <Navbar/>
        <b-jumbotron fluid>
            <template v-slot:header>Welcome!</template>

            <template v-slot:lead>
                How are you today?
            </template>
        </b-jumbotron>
    </main>
</template>

<script>
    import Navbar from "../components/Navbar";

    export default {
        name: "Home",

        components: {
            Navbar
        }
    }
</script>

<style scoped>
    main {
        background-color: #e9ecef;
    }
</style>