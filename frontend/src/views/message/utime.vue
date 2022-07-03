<template>
    <div>{{ time }}</div>
</template>

<script>
import { beautifyTime } from '@/utils/functions';

export default {
    components: {},
    props: {
        value: {
            type: String
        }
    },
    data() {
        return {
            time: '',
            timeout: null
        };
    },
    watch: {
        value() {
            this.setTime();
        }
    },
    created() {
        this.setTime();
    },
    unmounted() {
        clearInterval(this.timeout);
    },
    methods: {
        setTime() {
            this.time = beautifyTime(this.value);

            const time = new Date().getTime();
            const inTime = new Date(this.value.replace(/-/g, '/')).getTime();

            clearInterval(this.timeout);

            if (time - inTime > 35 * 60 * 1000) {
                return;
            }

            this.timeout = setTimeout(() => {
                this.setTime();
            }, 60 * 1000);
        }
    }
};
</script>
