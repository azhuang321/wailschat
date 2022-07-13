<script>
import { mapState, mapGetters, useStore } from 'vuex';
import AccountCard from '@/components/user/AccountCard.vue';
import LeftAside from './LeftAside.vue';
import { ServeFindFriendApplyNum } from '@/api/contacts';

export default {
    name: 'MainLayout',
    components: {
        AccountCard,
        LeftAside
        // RewardModule,
        // AbsModule
    },
    props: {
        idx: {
            type: Number,
            default: 0
        }
    },
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
</script>

<template>
    <!-- 整个页面-->
    <div class="body-bag" :class="themeBagImg">
        <el-container class="main-layout" :class="{ 'full-mode': themeMode }">
            <!-- 左侧导航栏-->
            <el-aside width="70px" class="side-edge">
                <LeftAside />
            </el-aside>
            <!-- 右侧聊天相关-->
            <el-main class="no-padding" style="background: white">
                <slot name="container"></slot>
            </el-main>
        </el-container>

        <!-- 语音消息提示 -->
        <audio id="audio" preload="auto">
            <source src="@/assets/image/1701.mp3" type="audio/mp3" />
        </audio>
    </div>
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
