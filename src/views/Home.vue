<template>
    <main class="min-vh-100">
        <Navbar/>
        <b-jumbotron fluid>
            <template v-slot:header>{{greetings}}</template>

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
            const hours = (new Date()).getHours();
            let greetings = 'Greetings!';
            if (hours > 6 && hours <= 12) {
                greetings = 'Good morning!';
            } else if (hours > 12 && hours <= 17) {
                greetings = 'Good afternoon!';
            } else if (hours > 17 && hours <= 20) {
                greetings = 'Good evening!';
            } else {
                greetings = 'Good night!';
            }
            return {
                joke: '',
                greetings
            }
        },
        mounted() {
            fetch('https://sv443.net/jokeapi/v2/joke/Programming?format=txt&type=single')
                .then(response => response.text())
                .then(data => {
                    this.joke = data;
                })
                .catch(error => {
                    console.error(error);
                    this.joke = '// This line doesn\'t actually do anything, but the code stops working when I delete it.';
                })
        }
    }
</script>

<style scoped>
    main {
        background-color: #e9ecef;
    }
</style>