<template>
    <div>
        <b-badge v-b-modal="'addPollOptions-' + poll.id"
                 variant="primary"
                 class="cursorPointer ml-2">
            Add options
        </b-badge>
        <b-modal :id="'addPollOptions-' + poll.id" centered :title="poll.name" hide-footer>
            <b-form @submit.stop.prevent="onSubmit('addPollOptions-' + poll.id)">
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
                                :disabled="index < poll.pollOptions.length"
                        ></b-form-input>
                        <b-input-group-append v-if="index >= poll.pollOptions.length">
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

                <b-button size="sm"
                          variant="secondary"
                          class="mr-1"
                          @click="addPollOption"
                          v-b-tooltip="'Add poll option'">
                    <b-icon-plus/>
                </b-button>
                <b-button size="sm" variant="primary" type="submit">Save</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
    import {required} from "vuelidate/lib/validators";
    import ApiService from "../services/api.service";
    import {mapGetters} from "vuex";

    export default {
        name: "PollOptionForm",
        props: ['poll'],
        data() {
            return {
                user: null,
                form: {
                    options: [...this.poll.pollOptions]
                },
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
                options: {
                    required,
                    $each: {
                        name: {
                            required,
                            isUnique(value) {
                                if (value === '') return true;
                                return this.$v.form.options.$model.filter(item => {
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
                    options: [...this.poll.pollOptions]
                };

                this.resetValidators();
            },
            resetValidators() {
                this.$nextTick(() => {
                    this.$v.$reset();
                });
            },
            onSubmit(modalId) {
                this.$v.form.$touch();
                if (this.$v.form.$anyError || this.user === null) {
                    return;
                }

                this.addPollOptions(modalId);
            },
            async addPollOptions(modalId) {
                await this.giveEmojisToOptions();
                const newPollOptions = this.form.options.filter(o => {
                    return this.poll.pollOptions.filter(oo => o.name === oo.name).length === 0;
                });
                const promises = [];
                newPollOptions.forEach(o => {
                    promises.push(
                        ApiService.post(`/polls/${this.poll.id}/poll_options`, o)
                    );
                })
                Promise.all(
                    promises
                ).then(response => {
                    console.log(response);
                    this.$successMsg('Poll options successfully added.');
                    this.resetForm();
                    this.$bvModal.hide(modalId);
                    this.$emit('refreshPolls');
                }).catch(err => {
                    console.error(err);
                    this.$errorMsg(err);
                });
            },
            async giveEmojisToOptions() {
                let emojis = (await ApiService.get('/discord_api/emojis')).data;
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

<style scoped>
    .cursorPointer:hover {
        cursor: pointer;
    }
</style>