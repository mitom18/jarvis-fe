<template>
    <b-form @submit.stop.prevent="onSubmit">
        <b-form-group v-if="!editing" id="input-group-1" label="Name:" label-for="name" label-class="required">
            <b-form-input
                    id="name"
                    v-model="$v.form.name.$model"
                    :state="validateState('name')"
                    aria-describedby="name-feedback"
                    placeholder="Enter name"
            ></b-form-input>
            <b-form-invalid-feedback id="name-feedback">
                This is a required field.
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Description:" label-for="description" label-class="required">
            <b-form-input
                    id="description"
                    v-model="$v.form.description.$model"
                    :state="validateState('description')"
                    aria-describedby="description-feedback"
                    placeholder="Enter description"
            ></b-form-input>
            <b-form-invalid-feedback id="description-feedback">
                This is a required field.
            </b-form-invalid-feedback>
        </b-form-group>

        <b-button size="sm" variant="primary" type="submit">Save</b-button>
    </b-form>
</template>

<script>
    import {required} from "vuelidate/lib/validators";
    import ApiService from "../services/api.service";
    import {mapGetters} from "vuex";

    export default {
        name: "NoteForm",
        props: ['note'],
        data() {
            console.log(this.note);
            if (this.note) {
                return {
                    user: null,
                    editing: true,
                    form: {
                        name: this.note.name,
                        description: this.note.description
                    }
                }
            }
            return {
                user: null,
                editing: false,
                form: {
                    name: '',
                    description: ''
                }
            }
        },
        computed: {
            ...mapGetters('auth', [
                'userInfo'
            ])
        },
        mounted() {
            this.userInfo.then(response => {
                this.user = response.data;
            })
        },
        validations: {
            form: {
                name: {
                    required
                },
                description: {
                    required
                }
            }
        },
        methods: {
            validateState(name) {
                const {$dirty, $error} = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            resetForm() {
                this.form = {
                    name: '',
                    description: ''
                };

                this.$nextTick(() => {
                    this.$v.$reset();
                });
            },
            onSubmit() {
                this.$v.form.$touch();
                if (this.$v.form.$anyError || this.user === null) {
                    return;
                }

                if (!this.editing) {
                    this.createNote();
                } else {
                    this.editNote();
                }
            },
            createNote() {
                ApiService.post('/notes', {
                    name: this.form.name,
                    description: this.form.description,
                    timeCreated: new Date(),
                    author: this.user
                }).then(response => {
                    console.log(response);
                    this.$successMsg('Note successfully created.');
                    this.resetForm();
                    this.$emit('refreshNotes');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                })
            },
            editNote() {
                ApiService.put('/notes/' + this.form.name, this.form.description)
                    .then(response => {
                        console.log(response);
                        this.$successMsg('Note ' + this.form.name + ' successfully edited.');
                        this.resetForm();
                        this.$emit('refreshNotes');
                    }).catch(err => {
                        console.error(err);
                        this.$errorMsg(err);
                    });
            }
        }
    }
</script>