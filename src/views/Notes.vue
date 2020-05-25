<template>
    <div>
        <Navbar/>
        <b-container class="pt-4 pb-4">
            <div class="mb-2">
                <b-button size="sm" variant="primary" v-b-toggle.new-note-form>
                    <b-icon-plus/>
                    New note
                </b-button>
                <b-collapse id="new-note-form" class="mt-2">
                    <b-card>
                        <NoteForm @refreshNotes="handleRefresh"/>
                    </b-card>
                </b-collapse>
            </div>
            <NotesList :key="renderKey"/>
        </b-container>
    </div>
</template>

<script>
    import Navbar from "../components/Navbar";
    import NotesList from "../components/NotesList";
    import NoteForm from "../components/NoteForm";

    export default {
        name: "Notes",
        components: {
            Navbar,
            NotesList,
            NoteForm
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