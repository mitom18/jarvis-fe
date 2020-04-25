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

        <b-form-row>
            <b-form-group id="input-group-3"
                          class="col-sm-6"
                          label="Start time:"
                          label-for="start-time"
                          label-class="required">
                <datetime type="datetime"
                          v-bind:input-class="{
                                'form-control': true,
                                'is-invalid': validateState('startTime') === false,
                                'is-valid': validateState('startTime') === true,
                          }"
                          id="start-time"
                          v-model="$v.form.startTime.$model"
                          placeholder="Enter start time"
                ></datetime>
                <b-form-invalid-feedback v-if="validateState('startTime') === false" force-show>
                    This is a required field.
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="input-group-4"
                          class="col-sm-6"
                          label="End time:"
                          label-for="end-time"
                          label-class="required">
                <datetime type="datetime"
                          v-bind:input-class="{
                                'form-control': true,
                                'is-invalid': validateState('endTime') === false,
                                'is-valid': validateState('endTime') === true,
                          }"
                          id="end-time"
                          v-model="$v.form.endTime.$model"
                          placeholder="Enter end time"
                ></datetime>
                <b-form-invalid-feedback v-if="validateState('endTime') === false" force-show>
                    This is a required field.
                </b-form-invalid-feedback>
            </b-form-group>
        </b-form-row>

        <b-button size="sm" variant="primary" type="submit">Save</b-button>
    </b-form>
</template>

<script>
    import {required} from "vuelidate/lib/validators";
    import ApiService from "../services/api.service";
    import {mapGetters} from "vuex";
    import {DateTime} from 'luxon';

    export default {
        name: "EventForm",
        props: ['event'],
        data() {
            if (this.event) {
                return {
                    user: null,
                    editing: true,
                    form: {
                        id: this.event.id,
                        name: this.event.name,
                        description: this.event.description,
                        startTime: DateTime.fromFormat(this.event.startTime, "dd.MM.yyyy HH:mm").toISO(),
                        endTime: DateTime.fromFormat(this.event.endTime, "dd.MM.yyyy HH:mm").toISO()
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
                    startTime: '',
                    endTime: ''
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
                startTime: {
                    required
                },
                endTime: {
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
                    description: '',
                    startTime: '',
                    endTime: ''
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
                    this.createEvent();
                } else {
                    this.editEvent();
                }
            },
            createEvent() {
                ApiService.post('/events', {
                    name: this.form.name,
                    description: this.form.description,
                    startTime: DateTime.fromISO(this.form.startTime).toFormat("dd.MM.yyyy HH:mm"),
                    endTime: DateTime.fromISO(this.form.endTime).toFormat("dd.MM.yyyy HH:mm"),
                    author: this.user,
                    canceled: false
                }).then(response => {
                    console.log(response);
                    this.$successMsg('Event successfully created.');
                    this.resetForm();
                    this.$emit('refreshEvents');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                })
            },
            editEvent() {
                ApiService.put('/events/' + this.form.id, {
                    name: this.form.name,
                    description: this.form.description,
                    startTime: DateTime.fromISO(this.form.startTime).toFormat("dd.MM.yyyy HH:mm"),
                    endTime: DateTime.fromISO(this.form.endTime).toFormat("dd.MM.yyyy HH:mm"),
                    author: this.user,
                    canceled: false
                }).then(response => {
                    console.log(response);
                    this.$successMsg('Event ' + this.form.name + ' successfully edited.');
                    this.resetForm();
                    this.$emit('refreshEvents');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                });
            }
        }
    }
</script>