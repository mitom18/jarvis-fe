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

        <b-form-group v-bind:key="index" v-for="(v, index) in $v.form.options.$each.$iter" :id="'input-group-'+index"
                      :label="'Poll option '+index+':'" :label-for="'option'+index" label-class="required">
            <b-form-input
                    :id="'option'+index"
                    v-model="v.name.$model"
                    :state="validateState(index, true)"
                    :aria-describedby="'option'+index+'-feedback'"
                    :placeholder="'Enter option '+index"
            ></b-form-input>
            <b-form-invalid-feedback :id="'option'+index+'-feedback'">
                This is a required field.
            </b-form-invalid-feedback>
        </b-form-group>

        <b-button size="sm" variant="primary" type="submit">Save</b-button>
    </b-form>
</template>

<script>
    import {required, minLength} from "vuelidate/lib/validators";
    import ApiService from "../services/api.service";
    import {mapGetters} from "vuex";

    export default {
        name: "PollForm",
        props: ['poll'],
        data() {
            if (this.poll) {
                return {
                    user: null,
                    editing: true,
                    form: {
                        id: this.poll.id,
                        name: this.poll.name,
                        description: this.poll.description,
                        options: this.poll.options
                    }
                }
            }
            return {
                user: null,
                editing: false,
                form: {
                    id: null,
                    name: '',
                    description: '',
                    options: [{
                        name: '',
                        icon: '',
                        votes: []
                    }]
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
            });
            this.resetValidators();
        },
        validations: {
            form: {
                name: {
                    required
                },
                description: {
                    required
                },
                options: {
                    required,
                    minLength: minLength(1),
                    $each: {
                        name: {
                            required
                        },
                        icon: {
                            required
                        }
                    }
                }
            }
        },
        methods: {
            validateState(name, isOption = false) {
                // TODO change validation for options
                const input = isOption ? name : this.$v.form[name];
                if (input === undefined) return null;
                const {$dirty, $error} = input;
                return $dirty ? !$error : null;
            },
            resetForm() {
                this.form = {
                    name: '',
                    description: '',
                    options: [{
                        name: '',
                        icon: '',
                        votes: []
                    }]
                };

                this.resetValidators();
            },
            resetValidators() {
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
                    this.createPoll();
                } else {
                    this.editPoll();
                }
            },
            createPoll() {
                ApiService.post('/polls', {
                    name: this.form.name,
                    description: this.form.description,
                    author: this.user,
                    pollOptions: this.form.options,
                    finished: false
                }).then(response => {
                    console.log(response);
                    this.$successMsg('Poll successfully created.');
                    this.resetForm();
                    this.$emit('refreshPolls');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                })
            },
            editPoll() {
                ApiService.put('/polls/' + this.form.id, {
                    name: this.form.name,
                    description: this.form.description,
                    author: this.user,
                    pollOptions: this.form.options,
                    finished: false
                }).then(response => {
                    console.log(response);
                    this.$successMsg('Poll ' + this.form.name + ' successfully edited.');
                    this.resetForm();
                    this.$emit('refreshPolls');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                });
            }
        }
    }
</script>