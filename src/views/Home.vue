<template>
    <main class="min-vh-100">
        <Navbar/>
        <b-jumbotron fluid>
            <template v-slot:header>Welcome!</template>

            <template v-slot:lead>
                {{joke}}
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
        },
        data() {
            return {
                joke: ''
            }
        },
        mounted() {
            fetch('https://geek-jokes.sameerkumar.website/api')
                .then(response => response.json())
                .then(data => {
                    this.joke = data;
                })
                .catch(error => {
                    console.error(error);
                    this.joke = 'How are you today?';
                })
        }
    }
</script>

<style scoped>
    main {
        background-color: #e9ecef;
    }
</style>