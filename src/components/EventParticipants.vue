<template>
    <b-card body-class="p-0">
        <b-card-header header-class="pt-1 pb-1 d-flex justify-content-between">
            <span><b-icon-people/> Participants</span>
            <b-button v-if="!userIsRolled(event)"
                      @click="roll(event)"
                      size="sm"
                      variant="primary"
                      v-b-tooltip="'Roll for event'"
            >
                <b-icon-person-plus/>
            </b-button>
            <b-button v-if="userIsRolled(event)"
                      @click="unroll(event)"
                      size="sm"
                      variant="danger"
                      v-b-tooltip="'Unroll from event'"
            >
                <b-icon-person-dash/>
            </b-button>
        </b-card-header>
        <b-card-body body-class="pt-3 pb-3">
                    <span v-bind:key="participant.id" v-for="participant in event.participants"
                          class="mr-3 text-nowrap">
                        <b-avatar size="sm" variant="secondary"></b-avatar> {{participant.username}}
                    </span>
            <span v-if="event.participants.length === 0">
                        Event has no participants. Want to be the first one?
                        Click the <b-badge variant="primary"><b-icon-person-plus/></b-badge> button.
                    </span>
        </b-card-body>
    </b-card>
</template>

<script>
    import {mapGetters} from "vuex";
    import ApiService from "../services/api.service";

    export default {
        name: "EventParticipants",
        props: ['event'],
        data() {
            return {
                user: null
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
        methods: {
            userIsRolled(event) {
                return event.participants.some((rolledUser) => {
                    if (this.user === null) return false;
                    return rolledUser.id === this.user.id;
                });
            },

            roll(event) {
                ApiService.put('/events/' + event.id + '/participants', this.user)
                    .then(response => {
                        console.log(response);
                        this.$successMsg('You were successfully rolled for event ' + event.name + '.');
                        this.$emit('refreshEvents');
                    })
                    .catch(err => {
                        console.log(err);
                        this.$errorMsg(err);
                    })
            },

            unroll(event) {
                if (confirm('Do you really want to unroll from event "' + event.name + '"?')) {
                    ApiService.delete('/events/' + event.id + '/participants/' + encodeURIComponent(this.user.username))
                        .then(response => {
                            console.log(response);
                            this.$successMsg('You were successfully unrolled from event ' + event.name + '.');
                            this.$emit('refreshEvents');
                        })
                        .catch(err => {
                            console.log(err);
                            this.$errorMsg(err);
                        })
                }
            }
        }
    }
</script>

<style scoped>

</style>