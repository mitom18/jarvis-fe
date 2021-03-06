<template>
    <b-card body-class="p-0">
        <b-card-header header-class="pt-1 pb-1 d-flex justify-content-between">
            <span><b-icon-list-task/> Poll options</span>
            <b-button v-if="user !== null && user.id === poll.author.id && !poll.finished"
                      @click="finish(poll)"
                      size="sm"
                      variant="success"
                      v-b-tooltip="'Finish poll'"
            >
                <b-icon-check/>
            </b-button>
        </b-card-header>
        <b-card-body body-class="pt-3 pb-3">
            <ol>
                <li v-bind:key="pollOption.id" v-for="pollOption in poll.pollOptions">
                    {{pollOption.name}} <i>&ndash; votes: {{pollOption.votes.length}} (
                    <span v-for="vote in pollOption.votes" :key="vote.id">
                            {{vote.voter.username}}
                        </span>
                    )</i>
                    <b-badge v-if="!poll.finished && !userHasVoted(poll)"
                             @click="vote(poll, pollOption)"
                             class="cursorPointer ml-2">
                        Vote
                    </b-badge>
                    <b-badge v-else-if="!poll.finished && !userHasVotedForOption(pollOption)"
                             @click="changeVote(poll, pollOption)"
                             variant="warning"
                             class="cursorPointer ml-2">
                        Change vote
                    </b-badge>
                    <b-badge
                            v-if="!poll.finished && poll.pollOptions.length > 1 && user !== null && user.id === poll.author.id"
                            @click="removeOption(poll, pollOption)"
                            variant="danger"
                            class="cursorPointer ml-2">
                        Remove option
                    </b-badge>
                </li>
            </ol>
            <PollOptionForm v-if="!poll.finished" :poll="poll" @refreshPolls="$emit('refreshPolls')"/>
        </b-card-body>
    </b-card>
</template>

<script>
    import {mapGetters} from "vuex";
    import ApiService from "../services/api.service";
    import PollOptionForm from "./PollOptionForm";

    export default {
        name: "PollVotes",
        components: {PollOptionForm},
        props: ['poll'],
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
            userHasVoted(poll) {
                if (this.user === null) return true;
                return poll.pollOptions.some(pollOption => {
                    return pollOption.votes.some(vote => {
                        return vote.voter.id === this.user.id;
                    });
                });
            },
            userHasVotedForOption(pollOption) {
                if (this.user === null) return true;
                return pollOption.votes.some(vote => {
                    return vote.voter.id === this.user.id;
                });
            },
            finish(poll) {
                if (confirm('Do you really want to finish poll "' + poll.name + '"?')) {
                    ApiService.delete('/polls/' + poll.id + '/finish')
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('You successfully finished poll ' + poll.name + '.');
                            this.$emit('refreshPolls');
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            },
            vote(poll, pollOption) {
                ApiService.post('/polls/' + poll.id + '/votes', pollOption)
                    // eslint-disable-next-line no-unused-vars
                    .then(response => {
                        this.$successMsg('You successfully voted in poll ' + poll.name + ' for option ' + pollOption.name + '.');
                        this.$emit('refreshPolls');
                    })
                    .catch(err => {
                        console.error(err);
                        this.$errorMsg(err);
                    })
            },
            changeVote(poll, pollOption) {
                if (confirm(`Do you really want to change your vote to option ${pollOption.name}?`)) {
                    ApiService.put('/polls/' + poll.id + '/votes', pollOption)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg('You successfully changed your vote in poll ' + poll.name + ' to option ' + pollOption.name + '.');
                            this.$emit('refreshPolls');
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            },
            removeOption(poll, pollOption) {
                if (confirm(`Do you really want to remove poll option ${pollOption.name} from poll ${poll.name}?`)) {
                    if (poll.pollOptions.length <= 1) {
                        this.$errorMsg('Poll has to have at least 1 option.');
                        return;
                    }
                    ApiService.delete(`/polls/${poll.id}/poll_options/${pollOption.id}`)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            this.$successMsg(`You successfully deleted poll option '${pollOption.name}' in poll '${poll.name}'.`);
                            this.$emit('refreshPolls');
                        })
                        .catch(err => {
                            console.error(err);
                            this.$errorMsg(err);
                        })
                }
            }
        }
    }
</script>

<style scoped>
    .cursorPointer:hover {
        cursor: pointer;
    }
</style>