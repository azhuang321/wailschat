<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {
                session_type: '',
                session_name: '',
                receiver_id: 0
            };
        }
    },
    online: {
        type: Boolean,
        default: false
    },
    keyboard: {
        type: [Boolean, Number],
        default: false
    }
});

const params = computed(() => props.data);
</script>
<script>
export default {
    data() {
        return {
            isOnline: false,
            isKeyboard: false,
            groupNum: 0
        };
    },
    watch: {
        data(value) {
            this.setParamsData(value);
        },
        online(value) {
            this.setOnlineStatus(value);
        },
        keyboard(value) {
            this.isKeyboard = value;
            setTimeout(() => {
                this.isKeyboard = false;
            }, 2000);
        }
    },
    created() {
        this.setParamsData(this.data);
        this.setOnlineStatus(this.online);
    },
    methods: {
        setOnlineStatus(value) {
            this.isOnline = value;
        },
        setParamsData(object) {
            Object.assign(this.params, object);
        },
        setGroupNum(value) {
            this.groupNum = value;
        },
        triggerEvent(event_name) {
            this.$emit('event', event_name);
        }
    }
};
</script>
<template>
    <el-header id="panel-header">
        <div class="module left-module">
            <span
                v-show="params.is_robot == 0"
                class="icon-badge"
                :class="{ 'red-color': params.session_type === 'p2p' }"
            >
                {{ params.session_type === 'p2p' ? '好友' : '群组' }}
            </span>

            <span class="nickname">{{ params.session_name }}</span>
            <span v-show="params.session_type === 'team'" class="num">({{ groupNum }})</span>
        </div>

        <div
            v-show="params.session_type === 'p2p' && params.is_robot == 0"
            class="module center-module"
        >
            <p class="online">
                <span v-show="isOnline" class="online-status"></span>
                <span>{{ isOnline ? '在线' : '离线' }}</span>
            </p>
            <p v-show="isKeyboard" class="keyboard-status">对方正在输入 ...</p>
        </div>

        <div class="module right-module">
            <el-tooltip content="历史消息" placement="top">
                <p v-show="params.is_robot == 0">
                    <i class="el-icon-time" @click="triggerEvent('history')"></i>
                </p>
            </el-tooltip>
            <el-tooltip content="群公告" placement="top">
                <p v-show="params.session_type === 'team'">
                    <i class="iconfont icon-gonggao2" @click="triggerEvent('notice')"></i>
                </p>
            </el-tooltip>
            <el-tooltip content="群设置" placement="top">
                <p v-show="params.session_type === 'team'">
                    <i class="el-icon-setting" @click="triggerEvent('setting')"></i>
                </p>
            </el-tooltip>
        </div>
    </el-header>
</template>
<style lang="scss" scoped>
#panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 1px solid #f5eeee;

    .module {
        width: 100%/3;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .left-module {
        padding-right: 5px;

        .icon-badge {
            background: rgb(81 139 254);
            height: 18px;
            line-height: 18px;
            padding: 1px 3px;
            font-size: 10px;
            color: white;
            border-radius: 3px;
            margin-right: 8px;
            flex-shrink: 0;

            &.red-color {
                background: #f97348;
            }
        }

        .nickname {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .center-module {
        flex-direction: column;
        justify-content: center;

        .online {
            color: #cccccc;
            font-weight: 300;
            font-size: 15px;

            &.color {
                color: #1890ff;
            }

            .online-status {
                position: relative;
                top: -1px;
                display: inline-block;
                width: 6px;
                height: 6px;
                vertical-align: middle;
                border-radius: 50%;
                position: relative;
                background-color: #1890ff;
                margin-right: 5px;

                &:after {
                    position: absolute;
                    top: -1px;
                    left: -1px;
                    width: 100%;
                    height: 100%;
                    border: 1px solid #1890ff;
                    border-radius: 50%;
                    -webkit-animation: antStatusProcessing 1.2s ease-in-out infinite;
                    animation: antStatusProcessing 1.2s ease-in-out infinite;
                    content: '';
                }
            }
        }

        .keyboard-status {
            height: 20px;
            line-height: 18px;
            font-size: 10px;
            animation: inputfade 600ms infinite;
            -webkit-animation: inputfade 600ms infinite;
        }
    }

    .right-module {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        p {
            cursor: pointer;
            margin: 0 8px;
            font-size: 20px;
            color: #828f95;
            &:active i {
                font-size: 26px;
                transform: scale(1.3);
                transition: ease 0.5s;
                color: red;
            }
        }
    }
}

/* css 动画 */
@keyframes inputfade {
    from {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    to {
        opacity: 1;
    }
}

@-webkit-keyframes inputfade {
    from {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    to {
        opacity: 1;
    }
}

@-webkit-keyframes antStatusProcessing {
    0% {
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
        opacity: 0.5;
    }

    to {
        -webkit-transform: scale(2.4);
        transform: scale(2.4);
        opacity: 0;
    }
}

@keyframes antStatusProcessing {
    0% {
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
        opacity: 0.5;
    }

    to {
        -webkit-transform: scale(2.4);
        transform: scale(2.4);
        opacity: 0;
    }
}
</style>
