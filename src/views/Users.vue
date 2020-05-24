<template>
    <div>
        <Navbar/>
        <b-container class="pt-4 pb-4">
            <UsersList/>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import UsersList from "../components/UsersList";

    export default {
        name: "Users",
        components: {
            Navbar,
            UsersList
        }
    }
</script>