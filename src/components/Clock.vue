<template>
    <div class="clock">
        <span class="hours">{{hours}}</span>
        <span class="minutes">{{minutes}}</span>
        <span class="seconds">{{seconds}}</span>
    </div>
</template>

<script>
    export default {
        name: "Clock",
        data() {
            const d = new Date();
            return {
                hours: this.zeroPad(d.getHours(), 2),
                minutes: this.zeroPad(d.getMinutes(), 2),
                seconds: this.zeroPad(d.getSeconds(), 2)
            }
        },
        mounted() {
            this.interval = setInterval(() => this.clockTick(), 1000);
        },
        methods: {
            zeroPad(num, places) {
                return String(num).padStart(places, '0');
            },
            clockTick() {
                const d = new Date();
                this.hours = this.zeroPad(d.getHours(), 2);
                this.minutes = this.zeroPad(d.getMinutes(), 2);
                this.seconds = this.zeroPad(d.getSeconds(), 2);
            }
        }
    }
</script>

<style scoped>
    .clock {
        position: relative;
        color: white;
        pointer-events: none;
    }

    .hours, .minutes, .seconds {
        background: black;
        padding: .2rem .4rem;
        margin: .1rem;

        -webkit-box-shadow: 2px 7px 5px 0 rgba(0, 0, 0, 0.5);
        -moz-box-shadow: 2px 7px 5px 0 rgba(0, 0, 0, 0.5);
        box-shadow: 2px 7px 5px 0 rgba(0, 0, 0, 0.5);
    }
</style>