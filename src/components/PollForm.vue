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

        <div v-if="!editing">
            <b-form-group v-bind:key="index" v-for="(v, index) in $v.form.options.$each.$iter"
                          :id="'input-group-'+index"
                          :label="'Poll option '+(Number.parseInt(index)+1)+':'" :label-for="'option'+index"
                          label-class="required">
                <b-input-group>
                    <b-form-input
                            :id="'option'+index"
                            v-model="v.name.$model"
                            :state="validateState(v.name, true)"
                            :aria-describedby="'option'+index+'-feedback'"
                            :placeholder="'Enter option '+(Number.parseInt(index)+1)"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-button size="sm"
                                  variant="danger"
                                  @click="removePollOption(index)"
                                  v-b-tooltip="'Remove poll option'">
                            <b-icon-x/>
                        </b-button>
                    </b-input-group-append>
                    <b-form-invalid-feedback :id="'option'+index+'-feedback'">
                        This is a required field and all poll options must be unique.
                    </b-form-invalid-feedback>
                </b-input-group>

            </b-form-group>
        </div>

        <b-button v-if="!editing"
                  size="sm"
                  variant="secondary"
                  class="mr-1"
                  @click="addPollOption"
                  v-b-tooltip="'Add poll option'">
            <b-icon-plus/>
        </b-button>
        <b-button size="sm" variant="primary" type="submit">Save</b-button>
    </b-form>
</template>

<script>
    import {required} from "vuelidate/lib/validators";
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
                        options: this.poll.pollOptions
                    },
                    minOptions: 1,
                    maxOptions: 3,
                    originalOptions: this.poll.pollOptions
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
                },
                minOptions: 1,
                maxOptions: 3
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
            ApiService.get('/discord_api/emojis').then(response => {
                this.maxOptions = response.data.length;
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
                    $each: {
                        name: {
                            required,
                            isUnique(value) {
                                if (value === '') return true;
                                console.log(value);
                                return this.$v.form.options.$model.filter(item => {
                                    console.log(item.name === value)
                                    return item.name === value;
                                }).length <= 1;
                            }
                        }
                    }
                }
            }
        },
        methods: {
            addPollOption() {
                if (this.form.options.length >= this.maxOptions) {
                    alert(`Poll can have max ${this.maxOptions} options!`);
                    return;
                }
                this.form.options.push({
                    name: '',
                    icon: '',
                    votes: []
                });
            },
            removePollOption(index) {
                if (this.form.options.length <= this.minOptions) {
                    alert(`Poll must have at least ${this.minOptions} options!`);
                    return;
                }
                this.form.options = this.form.options.filter((item, i) => {
                    return i !== Number.parseInt(index);
                });
            },
            validateState(element, isOption = false) {
                const input = isOption ? element : this.$v.form[element];
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
            async createPoll() {
                await this.giveEmojisToOptions();
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
            async editPoll() {
                await this.giveEmojisToOptions();
                ApiService.put('/polls/' + this.form.id, {
                    ...this.poll,
                    description: this.form.description,
                    pollOptions: this.form.options
                }).then(response => {
                    console.log(response);
                    this.$successMsg('Description of poll ' + this.form.name + ' successfully edited.');
                    this.resetForm();
                    this.$emit('refreshPolls');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                });
            },
            async giveEmojisToOptions() {
                let emojis = (await ApiService.get('/discord_api/emojis')).data;
                console.log(emojis)
                this.form.options = this.form.options.map(option => {
                    return {
                        ...option,
                        icon: emojis.pop()
                    }
                });
            }
        }
    }
</script>