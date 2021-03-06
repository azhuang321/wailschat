<script setup>
const usercard = ref(null);

const store = useStore();
const { ChatDotRound, UserFilled, Tools } = useIconEffect();

const socketStatus = computed(() => store.getters.connectStatus);

const { CONNECT_STATUS_ENUM, notifyFunc, watchFunc } = useInitEffect(socketStatus);

store.dispatch({
    type: CONNECT_NOTIFICATION,
    notification: notifyFunc()
});

watchEffect(watchFunc);

const props = defineProps({
    tabName: {
        type: String,
        default: 'message'
    }
});

const tabName = props.tabName;
</script>
<script>
import { mapGetters, mapState, useStore } from 'vuex';
import {
    CONNECT_NOTIFICATION,
    CONNECT_STATUS,
    CONNECT_STATUS_ENUM
} from '@/store/modules/nim/constants';
import { isConnect } from '@/utils/nim/callback';
import { ChatDotRound, UserFilled, Tools } from '@element-plus/icons-vue';
import { ServeFindFriendApplyNum } from '@/api/contacts';

import AccountCard from '@/components/user/AccountCard.vue';

export default {
    name: 'LeftAside',
    components: [AccountCard],
    computed: {
        ...mapState({
            userAvatar: state => state.user.avatar,
            detaultAvatar: state => state.detaultAvatar,
            applyNum: state => state.notify.applyNum,
            notifyCueTone: state => state.settings.notifyCueTone,
            themeMode: state => state.settings.themeMode,
            themeBagImg: state => state.settings.themeBagImg
        }),
        ...mapGetters(['unreadNum'])
    },
    watch: {
        unreadNum(n, o) {
            if (n > 0 && n > o && this.notifyCueTone) {
                this.play();
            }
        }
    },
    created() {
        this.setApplyNum();
    },
    methods: {
        play() {
            document.querySelector('#audio').play();
        },
        logout() {
            this.$store.dispatch('ACT_USER_LOGOUT');
        },
        setApplyNum() {
            ServeFindFriendApplyNum().then(res => {
                if (res.code == 200 && res.data.unread_num > 0) {
                    this.$store.commit('INCR_APPLY_NUM');
                }
            });
        }
    }
};

//使用图标
const useIconEffect = () => {
    return {
        ChatDotRound: markRaw(ChatDotRound),
        UserFilled: markRaw(UserFilled),
        Tools: markRaw(Tools)
    };
};

// socket 状态监听
const useInitEffect = socketStatus => {
    const store = useStore();

    const notifyFunc = () => {
        if (socketStatus.value === CONNECT_STATUS_ENUM.connected) {
            return;
        }
        if (typeof store.state.nim.connectNotification === 'object') {
            return store.state.nim.connectNotification;
        }

        return ElNotification.error({
            message: '断开连接，正在尝试重新连接',
            duration: 0,
            showClose: false
        });
    };

    const watchFunc = () => {
        if (isConnect.value === true) {
            if (typeof store.state.nim.connectNotification === 'object') {
                store.state.nim.connectNotification.close();
            }
            store.dispatch({
                type: CONNECT_STATUS,
                status: CONNECT_STATUS_ENUM.connected
            });
        } else {
            store.dispatch({
                type: CONNECT_NOTIFICATION,
                notification: notifyFunc()
            });
            store.dispatch({
                type: CONNECT_STATUS,
                status: CONNECT_STATUS_ENUM.disconnect
            });
        }
    };

    return {
        CONNECT_STATUS_ENUM,
        notifyFunc,
        watchFunc
    };
};
</script>
<template>
    <el-container class="full-height">
        <el-header height="100px" class="logo-header">
            <div ref="usercard" class="userlogo">
                <img :src="userAvatar" :onerror="detaultAvatar" />
            </div>
            <!-- 用户卡片 -->
            <el-popover
                :virtual-ref="usercard"
                virtual-triggering
                trigger="hover"
                placement="right-start"
                popper-class="no-padding"
            >
                <AccountCard />
            </el-popover>

            <p class="user-status">
                <span
v-if="socketStatus === CONNECT_STATUS_ENUM.connected" class="online"
                    >在线</span
                >
                <span v-else>连接中...</span>
            </p>
        </el-header>

        <el-main class="sidebar-menu">
            <el-tooltip content="我的消息" placement="right" :show-arrow="false">
                <router-link to="/message">
                    <div class="menu-items" :class="{ active: tabName === 'message' }">
                        <ChatDotRound />
                        <span v-show="unreadNum" class="notify"></span>
                    </div>
                </router-link>
            </el-tooltip>

            <el-tooltip content="我的联系人" placement="right" :show-arrow="false">
                <router-link to="/contacts">
                    <div class="menu-items" :class="{ active: tabName == 1 }">
                        <UserFilled />
                        <span v-show="applyNum" class="notify"></span>
                    </div>
                </router-link>
            </el-tooltip>
            <el-tooltip content="我的设置" placement="right" :show-arrow="false">
                <router-link to="/settings">
                    <div class="menu-items" :class="{ active: tabName == 3 }">
                        <Tools />
                    </div>
                </router-link>
            </el-tooltip>
        </el-main>

        <el-footer height="60px" class="fixed-sidebar">
            <div class="menu-items" @click="logout">
                <span class="logout">退出</span>
            </div>
        </el-footer>
    </el-container>
</template>

<style lang="scss" scoped>
// todo 优化 css
.el-main {
    padding: 0;
}

//控制 聊天大小
.main-layout {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    overflow: hidden;
    transition: ease 0.5s;
    border-radius: 10px;

    //&.full-mode {
    //    width: 100%;
    //    height: 100%;
    //    border-radius: 0;
    //}

    .el-container {
        height: 100%;

        .el-header {
            flex: 0.5;
        }

        .el-main {
            flex: 9;
        }

        .el-footer {
            flex: 1;
        }
    }

    .side-edge {
        user-select: none;
        background-color: #202225;

        .logo-header {
            padding: 0;

            .userlogo {
                width: 50px;
                height: 50px;
                margin: 10px auto 0;
                border-radius: 50%;
                position: relative;
                cursor: pointer;
                overflow: hidden;
                transition: ease-in 3s;

                img {
                    width: 100%;
                    height: 100%;
                }

                &:hover {
                    transform: rotate(360deg);
                }
            }

            .user-status {
                text-align: center;
                margin-top: 10px;
                color: #ccc9c9;
                font-size: 13px;
                font-weight: 300;

                .online {
                    color: #0d710d;
                }
            }
        }
    }

    .sidebar-menu {
        width: 60px;
        margin: 0 auto;
        text-align: center;
        padding: 0;
        overflow: hidden;

        a {
            text-decoration: none;
        }

        .menu-items {
            cursor: pointer;
            color: #706d6d;
            position: relative;
            width: 45px;
            height: 45px;
            margin: 6px auto 0;
            line-height: 45px;
            text-align: center;

            svg {
                width: 40%;
                height: 40%;

                &:hover {
                    transform: scale(1.3);
                }
            }

            .notify {
                width: 5px;
                height: 5px;
                background: #ff1e1e;
                display: inline-block;
                border-radius: 5px;
                position: absolute;
                right: 5px;
                top: 9px;
                animation: notifymove 3s infinite;
                animation-direction: alternate;
                -webkit-animation: notifymove 3s infinite;
            }

            &.active {
                color: #416641 !important;
            }
        }
    }
}

.fixed-sidebar {
    padding: 0;

    .menu-items {
        height: 25px;
        line-height: 25px;
        padding: 10px 5px;
        cursor: pointer;
        box-shadow: 0 0 0 0 #ccc9c9;
        text-align: center;
        color: #afabab;

        i {
            font-size: 20px;
        }

        .logout {
            font-weight: 300;
            font-size: 15px;
            color: #9e9e9e;
            transition: ease 0.5;

            &:hover {
                font-size: 16px;
            }
        }
    }
}

/* 主题背景图片 */
.body-bag {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    background-color: #121212;
    transition: ease-in 0.5s;

    &.bag001 {
        background: url(@/assets/image/background/001.jpg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    &.bag002 {
        background: url(@/assets/image/background/002.jpg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    &.bag003 {
        background: url(@/assets/image/background/003.jpg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    &.bag004 {
        background: url(@/assets/image/background/005.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
}

@keyframes notifymove {
    0% {
        background: #ff1e1e;
    }

    25% {
        background: #2e3238;
    }

    50% {
        background: #ff1e1e;
    }

    75% {
        background: #2e3238;
    }

    100% {
        background: #ff1e1e;
    }
}

@-webkit-keyframes notifymove {
    0% {
        background: #ff1e1e;
    }

    25% {
        background: #2e3238;
    }

    50% {
        background: #ff1e1e;
    }

    75% {
        background: #2e3238;
    }

    100% {
        background: #ff1e1e;
    }
}

@media screen and (max-width: 1000px) {
    .main-layout {
        width: 100%;
        height: 100%;
        border-radius: 0;
    }
}
</style>
