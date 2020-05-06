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
                    <b-badge variant="danger"
                             class="cursorPointer ml-2">
                        Remove option
                    </b-badge>
                </li>
            </ol>
            <b-badge variant="primary"
                     class="cursorPointer ml-2">
                Add option
            </b-badge>
        </b-card-body>
    </b-card>
</template>

<script>
    import {mapGetters} from "vuex";
    import ApiService from "../services/api.service";

    export default {
        name: "PollVotes",
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
                        .then(response => {
                            console.log(response);
                            this.$successMsg('You successfully finished poll ' + poll.name + '.');
                            this.$emit('refreshPolls');
                        })
                        .catch(err => {
                            console.log(err);
                            this.$errorMsg(err);
                        })
                }
            },
            vote(poll, pollOption) {
                ApiService.post('/polls/' + poll.id + '/votes', pollOption)
                    .then(response => {
                        console.log(response);
                        this.$successMsg('You successfully voted in poll ' + poll.name + ' for option ' + pollOption.name + '.');
                        this.$emit('refreshPolls');
                    })
                    .catch(err => {
                        console.log(err);
                        this.$errorMsg(err);
                    })
            },
            changeVote(poll, pollOption) {
                if (confirm(`Do you really want to change your vote to option ${pollOption.name}?`)) {
                    ApiService.put('/polls/' + poll.id + '/votes', pollOption)
                        .then(response => {
                            console.log(response);
                            this.$successMsg('You successfully changed your vote in poll ' + poll.name + ' to option ' + pollOption.name + '.');
                            this.$emit('refreshPolls');
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
    .cursorPointer:hover {
        cursor: pointer;
    }
</style>