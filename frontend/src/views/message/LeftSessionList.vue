<script setup>
// todo 查看双向绑定数据

const store = useStore();
const emit = defineEmits(['clickSession']);

// 置顶聊天
const topSessionList = computed(() => store.state.nim.topSessionList);
const { handleTopSessionRightClick, getTopSession } = useTopSessionListEffect();
getTopSession();

//会话列表
const sessionList = computed(() => store.state.nim.sessionList);
const { sessionId, getSession, handleClickSession, handleSessionRightClick } =
    useSessionListEffect(emit);
getSession();

//todo 去掉
let index_name = ref('');
let params = ref({});
</script>
<script>
//获取对话列表
import { mapGetters, mapState, useStore } from 'vuex';
import { ElNotification } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';

//https://github.com/xfy520/vue3-menus
import { menusEvent } from 'vue3-menus';

import { getSessionList, getTopSessionList } from '@/utils/nim/user';
import {
    CURRENT_SESSION_LIST,
    SESSION_LIST,
    TOP_SESSION_LIST
} from '@/store/modules/nim/constants';
import UTime from '@/views/message/utime.vue';
import { findTalkIndex, getCacheIndexName } from '@/utils/talk';
import { beautifyTime } from '@/utils/functions';
import { ServeDeleteTalkList, ServeSetNotDisturb, ServeTopTalkList } from '@/api/chat';
import { ServeDeleteContact, ServeEditContactRemark } from '@/api/contacts';
import { ServeSecedeGroup } from '@/api/group';
import { addStickTopSession, deleteStickTopSession } from '@/utils/nim';

//置顶列表
const useTopSessionListEffect = () => {
    const store = useStore();
    // addStickTopSession('team-5555897456');
    // addStickTopSession('p2p-azhuang1');
    //获取列表
    const getTopSession = () => {
        getTopSessionList()
            .then(res => {
                store.dispatch({
                    type: TOP_SESSION_LIST,
                    topSessionList: res
                });
            })
            .catch(err => {
                ElNotification.error({
                    message: '获取置顶列表失败'
                });
            });
    };
    //置顶列表右击
    const menus = shallowRef({
        menus: [
            {
                label: '取消置顶',
                icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M544 805.888V168a32 32 0 1 0-64 0v637.888L246.656 557.952a30.72 30.72 0 0 0-45.312 0 35.52 35.52 0 0 0 0 48.064l288 306.048a30.72 30.72 0 0 0 45.312 0l288-306.048a35.52 35.52 0 0 0 0-48 30.72 30.72 0 0 0-45.312 0L544 805.824z"></path></svg>',
                click: (event, item) => {
                    deleteStickTopSession(item.id)
                        .then(res => {
                            store.dispatch({
                                type: TOP_SESSION_LIST,
                                action: 'remove',
                                topSessionList: [toRaw(item)]
                            });
                        })
                        .catch(err => {
                            ElNotification.error({ message: '取消置顶会话失败' });
                        });
                }
            },
            {
                label: '点击不关闭菜单',
                click: () => {
                    return false;
                }
            }
        ]
    });
    const handleTopSessionRightClick = (event, item) => {
        menusEvent(event, menus.value, item);
        event.preventDefault();
    };
    return {
        getTopSession,
        handleTopSessionRightClick
    };
};

//获取左侧会话列表
const useSessionListEffect = emit => {
    const store = useStore();
    const sessionId = ref('');
    //获取列表
    const getSession = () => {
        getSessionList()
            .then(res => {
                store.dispatch({
                    type: SESSION_LIST,
                    session: res
                });
            })
            .catch(err => {
                ElNotification({
                    type: 'error',
                    message: '获取对话列表失败'
                });
            });
    };

    //切换聊天栏目 子组件向父级传值
    const handleClickSession = sessionInfo => {
        const { id, name, sessionType } = sessionInfo;
        sessionId.value = id;

        // todo 多个聊天
        // store.dispatch({
        //     type: CURRENT_SESSION_LIST,
        //     currentSession: {
        //         talk_type: 1,
        //         receiver_id: id,
        //         is_robot: 0
        //     }
        // });

        store.commit('UPDATE_DIALOGUE_MESSAGE', {
            talk_type: 1,
            receiver_id: id,
            is_robot: 0
        });
        // 触发上级,函数 对话面板的传递参数
        emit('clickSession', {
            sessionType: sessionType,
            receiverId: id,
            sessionName: name
        });
    };

    //右键
    //置顶列表右击
    const menus = shallowRef({
        menus: [
            {
                label: '置顶聊天',
                icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M572.235 205.282v600.365a30.118 30.118 0 1 1-60.235 0V205.282L292.382 438.633a28.913 28.913 0 0 1-42.646 0 33.43 33.43 0 0 1 0-45.236l271.058-288.045a28.913 28.913 0 0 1 42.647 0L834.5 393.397a33.43 33.43 0 0 1 0 45.176 28.913 28.913 0 0 1-42.647 0l-219.618-233.23z"></path></svg>',
                click: (event, item) => {
                    addStickTopSession(item.id)
                        .then(res => {
                            store.dispatch({
                                type: TOP_SESSION_LIST,
                                action: 'add',
                                topSessionList: [item]
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            ElNotification.error({ message: '置顶聊天失败' });
                        });
                }
            }
            // {
            //     label: '好友信息',
            //     icon: 'el-icon-user',
            //     disabled: item.talk_type == 2 || item.is_robot == 1,
            //     onClick: () => {
            //         this.$user(item.receiver_id);
            //     }
            // },
            // {
            //     label: '修改备注',
            //     icon: 'el-icon-edit-outline',
            //     disabled: item.talk_type == 2 || item.is_robot == 1,
            //     onClick: () => {
            //         this.editFriendRemarks(item);
            //     }
            // },
            // {
            //     label: item.is_top == 0 ? '会话置顶' : '取消置顶',
            //     icon: 'el-icon-top',
            //     onClick: () => {
            //         this.topChatItem(item);
            //     }
            // },
            // {
            //     label: item.is_disturb == 0 ? '消息免打扰' : '开启消息提示',
            //     icon: item.is_disturb == 0 ? 'el-icon-close-notification' : 'el-icon-bell',
            //     disabled: item.is_robot == 1,
            //     onClick: () => {
            //         this.setNotDisturb(item);
            //     }
            // },
            // {
            //     label: '移除会话',
            //     icon: 'el-icon-remove-outline',
            //     divided: true,
            //     onClick: () => {
            //         this.delChatItem(item);
            //     }
            // },
            // {
            //     label: item.talk_type == 1 ? '删除好友' : '退出群聊',
            //     icon: 'el-icon-delete',
            //     disabled: item.is_robot == 1,
            //     onClick: () => {
            //         const title = item.talk_type == 1 ? '删除好友' : '退出群聊';
            //         this.$confirm(
            //             `此操作将 <span style="color:red;font-size:16px;">${title}</span>, 是否继续?`,
            //             '提示',
            //             {
            //                 confirmButtonText: '确定',
            //                 cancelButtonText: '取消',
            //                 type: 'warning',
            //                 center: true,
            //                 dangerouslyUseHTMLString: true
            //             }
            //         ).then(() => {
            //             if (item.talk_type == 1) {
            //                 this.removeFriend(item);
            //             } else {
            //                 this.removeGroup(item);
            //             }
            //         });
            //     }
            // }
        ]
    });
    const handleSessionRightClick = (event, item) => {
        menusEvent(event, menus.value, item);
        event.preventDefault();
    };

    return {
        sessionId,
        getSession,
        handleClickSession,
        handleSessionRightClick
    };
};

const title = document.title;

export default {
    name: 'LeftSessionList',
    components: {
        UTime
    },

    beforeRouteUpdate(to, from, next) {
        const index_name = getCacheIndexName();

        if (index_name) {
            this.clickTab(index_name);
        }

        next();
    },
    data() {
        return {
            Plus: markRaw(Plus),
            Search: markRaw(Search),
            subHeaderShadow: false,
            launchGroupShow: false,

            // 查询关键词
            input: '',

            // header 工具菜单
            subMenu: false,

            // 消息未读数计时器
            interval: null,
            talkItems: [{ index_name: '123', remark_name: '123' }]
        };
    },
    computed: {
        ...mapGetters(['topItems', 'unreadNum', 'talkNum']),
        // ...mapGetters(['topItems', 'talkItems', 'unreadNum', 'talkNum']),
        ...mapState({
            loadStatus: state => state.talks.loadStatus,
            talks: state => state.talks.items
            // index_name: state => state.dialogue.index_name
        }),
        // 计算置顶栏目的高度
        subHeaderPx() {
            const n = 7; // 一排能显示的用户数
            const num = this.topItems.length;
            let len = 60;

            if (num > n) {
                len = (Math.floor(num / n) + (num % n > 0 ? 1 : 0)) * len;
            }

            return `${len}px`;
        },
        // 当前对话好友在线状态
        isFriendOnline() {
            // const index = findTalkIndex(this.index_name);
            // return index >= 0 && this.talks[index].is_online == 1;
        }
    },
    watch: {
        unreadNum(value) {
            clearInterval(this.interval);

            if (value > 0) {
                this.interval = setInterval(() => {
                    document.title = document.title == title ? `【新消息】${title}` : title;
                }, 2000);
            } else {
                document.title = title;
            }
        }
    },
    created() {
        const index_name = getCacheIndexName();

        if (index_name) {
            this.clickTab(index_name);
        }
    },
    mounted() {
        this.scrollEvent();
    },
    unmounted() {
        document.title = title;
        clearInterval(this.interval);
        this.clearTalk();
    },
    methods: {
        // 美化时间格式
        beautifyTime,

        // header 功能栏隐藏事件
        closeSubMenu() {
            this.subMenu = false;
        },

        // 清除当前对话
        clearTalk() {
            this.params = {
                talk_type: 0,
                receiver_id: 0,
                nickname: ''
            };

            this.$store.commit('UPDATE_DIALOGUE_MESSAGE', {
                talk_type: 0,
                receiver_id: 0,
                is_robot: 0
            });
        },

        // 工具栏事件
        triggerSubMenu(type) {
            this.closeSubMenu();

            if (type == 1) {
                this.launchGroupShow = true;
            } else {
                this.$refs.searchUsers.open();
            }
        },

        // 监听自定义滚动条事件
        scrollEvent() {
            // const scrollbarEl = this.$refs.menusScrollbar.wrap;
            // scrollbarEl.onscroll = () => {
            //     this.subHeaderShadow = scrollbarEl.scrollTop > 0;
            // };
        },

        // 发起群聊成功后回调方法
        groupChatSuccess(data) {
            this.launchGroupShow = false;
            sessionStorage.setItem('send_message_index_name', `2_${data.group_id}`);
            this.$store.dispatch('LOAD_TALK_ITEMS');
        },

        // 修改当前对话
        changeTalk(index_name) {
            sessionStorage.setItem('send_message_index_name', index_name);
            this.$store.dispatch('LOAD_TALK_ITEMS');
        },

        // 关闭当前对话及刷新对话列表
        closeTalk() {
            this.$store.commit('UPDATE_DIALOGUE_MESSAGE', {
                talk_type: 0,
                receiver_id: 0,
                is_robot: 0
            });

            this.$store.dispatch('LOAD_TALK_ITEMS');
        },
        // 会话列表置顶
        topChatItem(item) {
            ServeTopTalkList({
                list_id: item.id,
                type: item.is_top == 0 ? 1 : 2
            }).then(({ code }) => {
                if (code == 200) {
                    this.$store.commit('UPDATE_TALK_ITEM', {
                        index_name: item.index_name,
                        is_top: item.is_top == 0 ? 1 : 0
                    });
                }
            });
        },

        // 设置消息免打扰
        setNotDisturb(item) {
            ServeSetNotDisturb({
                talk_type: item.talk_type,
                receiver_id: item.receiver_id,
                is_disturb: item.is_disturb == 0 ? 1 : 0
            }).then(({ code }) => {
                if (code == 200) {
                    this.$store.commit('UPDATE_TALK_ITEM', {
                        index_name: item.index_name,
                        is_disturb: item.is_disturb == 0 ? 1 : 0
                    });
                }
            });
        },

        // 移除会话列表
        delChatItem(item) {
            ServeDeleteTalkList({
                list_id: item.id
            }).then(({ code }) => {
                if (code == 200) {
                    this.clearTalk();
                    this.$store.commit('REMOVE_TALK_ITEM', item.index_name);
                }
            });
        },

        // 解除好友关系
        removeFriend(item) {
            ServeDeleteContact({
                friend_id: item.receiver_id
            }).then(({ code }) => {
                if (code == 200) {
                    // if (this.index_name == item.index_name) {
                    //     this.clearTalk();
                    // }

                    this.$store.commit('REMOVE_TALK_ITEM', item.index_name);
                }
            });
        },

        // 退出群聊
        removeGroup(item) {
            ServeSecedeGroup({
                group_id: item.receiver_id
            }).then(({ code }) => {
                if (code == 200) {
                    // if (this.index_name == item.index_name) {
                    //     this.clearTalk();
                    // }

                    this.$store.commit('REMOVE_TALK_ITEM', item.index_name);
                }
            });
        },

        // 修改好友备注信息
        editFriendRemarks(item) {
            let title = `您正在设置【${item.name}】好友的备注信息`;

            if (item.remark_name) {
                title += `，当前备注为【${item.remark_name}】`;
            }

            this.$prompt(title, '修改备注', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'border-radius0',
                inputPlaceholder: '请设置好友备注信息',
                inputValue: item.remark_name ? item.remark_name : item.name,
                inputValidator(val) {
                    return val == null || val == '' ? '好友备注不能为空' : true;
                }
            })
                .then(({ value }) => {
                    if (value == item.remark_name) {
                        return false;
                    }

                    ServeEditContactRemark({
                        friend_id: item.receiver_id,
                        remarks: value
                    }).then(res => {
                        if (res.code == 200) {
                            this.$store.commit('UPDATE_TALK_ITEM', {
                                index_name: item.index_name,
                                remark_name: value
                            });

                            this.$notify({
                                title: '成功',
                                message: '好友备注修改成功...',
                                type: 'success'
                            });
                        } else {
                            this.$notify({
                                title: '消息',
                                message: '好友备注修改失败，请稍后再试...',
                                type: 'warning'
                            });
                        }
                    });
                })
                .catch(() => {});
        }
    }
};
</script>
<template>
    <el-container class="full-height" direction="vertical">
        <!-- 搜索栏 -->
        <el-header height="60px" class="header">
            <div class="from-search">
                <el-input
                    v-model="input"
                    :prefix-icon="Search"
                    placeholder="搜索聊天 / 好友 / 群组"
                />
            </div>

            <!-- 工具栏 -->
            <div v-outside="closeSubMenu" class="tools">
                <el-button circle plain :icon="Plus" @click="subMenu = !subMenu" />
                <transition name="el-zoom-in-top">
                    <div v-show="subMenu" class="tools-menu">
                        <div class="menu-item" @click="triggerSubMenu(1)">创建群组</div>
                        <div class="menu-item" @click="triggerSubMenu(2)">添加好友</div>
                    </div>
                </transition>
            </div>
        </el-header>

        <el-main class="no-padding">
            <!-- 置顶栏 -->
            <header v-show="topSessionList.length !== 0" class="subheader">
                <span class="subheader-title">置顶聊天</span>
                <div
                    v-for="item in topSessionList"
                    :key="item.id"
                    class="top-item"
                    @click.stop="clickTab(item.index_name)"
                    @contextmenu.prevent="handleTopSessionRightClick($event, item)"
                >
                    <el-tooltip
                        effect="dark"
                        placement="top-start"
                        :content="item?.sessionInfo?.name"
                    >
                        <div class="avatar">
                            <span v-show="!item.sessionInfo.avatar">
                                {{ item.sessionInfo.name.substr(0, 1) }}
                            </span>
                            <img
                                v-show="item.sessionInfo.avatar"
                                v-lazyImg="{ src: item.sessionInfo.avatar }"
                            />
                        </div>
                    </el-tooltip>

                    <div class="name" :class="{ active: params.nickname == item.index_name }">
                        {{ item?.sessionInfo?.name }}
                    </div>
                </div>
            </header>

            <!-- 对话列表栏 -->
            <el-scrollbar ref="menusScrollbar" tag="section" class="full-height" :native="false">
                <span class="session-title">会话列表({{ sessionList.length }})</span>
                <el-main class="main">
                    <p v-show="loadStatus == 2" class="empty-data">
                        <i class="el-icon-loading"></i> 数据加载中...
                    </p>

                    <p v-show="loadStatus == 3 && talkNum == 0" class="empty-data">暂无聊天消息</p>

                    <p v-show="loadStatus == 3 && talkNum > 0" class="main-menu">
                        <span class="title">消息记录 ({{ talkNum }})</span>
                    </p>

                    <p v-show="loadStatus == 4" style="text-align: center">
                        数据加载失败，请点击重试！
                    </p>

                    <!-- 对话列表 -->
                    <template v-if="loadStatus != 3">
                        <div
                            v-for="item in sessionList"
                            :key="item.id"
                            class="talk-item pointer"
                            :class="{ active: sessionId === item.id }"
                            @click="handleClickSession(item)"
                            @contextmenu.prevent="handleSessionRightClick($event, item)"
                        >
                            <div class="avatar-box">
                                <span v-show="!item.sessionInfo.avatar">
                                    {{ item.sessionInfo.name.substr(0, 1) }}
                                </span>
                                <img
                                    v-show="item.sessionInfo.avatar"
                                    v-lazyImg="{ src: item.sessionInfo.avatar }"
                                />
                                <div
                                    v-show="item.is_top == 0"
                                    class="top-mask"
                                    @click.stop="topChatItem(item)"
                                >
                                    <i class="el-icon-top"></i>
                                </div>
                            </div>
                            <div class="card-box">
                                <div class="title">
                                    <div class="card-name">
                                        <p class="nickname">
                                            {{ item?.sessionInfo?.name }}
                                        </p>
                                        <div v-show="item.unread_num" class="larkc-tag">
                                            {{ item.unread_num }}条未读
                                        </div>
                                        <div v-show="item.is_top" class="larkc-tag top">TOP</div>

                                        <div v-show="item.is_robot" class="larkc-tag top">BOT</div>

                                        <div
                                            v-show="item.sessionType == 'team'"
                                            class="larkc-tag group"
                                        >
                                            群组
                                        </div>
                                        <div v-show="item.is_disturb" class="larkc-tag disturb">
                                            <i class="iconfont icon-xiaoximiandarao"></i>
                                        </div>
                                    </div>
                                    <div class="card-time">
                                        <u-time
                                            :value="String(Math.ceil(item.updateTime / 1000))"
                                        />
                                    </div>
                                </div>
                                <div class="content">
                                    <template
                                        v-if="index_name != item.index_name && item.draft_text"
                                    >
                                        <span class="draft-color">[草稿]</span>
                                        <span>{{ item.draft_text }}</span>
                                    </template>
                                    <template v-else>
                                        <template v-if="item.is_robot == 0">
                                            <span
                                                v-if="item.talk_type == 1"
                                                :class="{
                                                    'online-color': item.is_online == 1
                                                }"
                                            >
                                                [{{ item.is_online == 1 ? '在线' : '离线' }}]
                                            </span>
                                            <span v-else>[群消息]</span>
                                        </template>

                                        <span>{{ item?.lastMsg.text }}</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-main>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
}

.splitpanes.default-theme .splitpanes__pane {
    background-color: white;
}
.el-scrollbar__view {
    .session-title {
        width: 100%;
        padding: 5px 10px;
        margin: 8px 0 0;
        display: block;
        font-size: 14px;
        font-weight: 600;
    }
}

.aside-box {
    position: relative;
    border-right: 1px solid rgb(245, 245, 245);
    overflow: hidden;
    padding: 0;
    transition: width 0.3s;

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 15px;

        .from-search {
            :deep(.el-input .el-input__wrapper) {
                border-radius: 20px;
                font-size: 12px;
                padding: 1px 0;
            }
            :deep(.el-input__prefix) {
                padding-left: 8px;
                font-size: 20px;
            }
        }

        .tools {
            flex-basis: 32px;
            flex-shrink: 0;
            height: 32px;
            margin-left: 15px;
            cursor: pointer;
            text-align: center;
            position: relative;
            user-select: none;

            .tools-menu {
                position: absolute;
                right: 0;
                top: 38px;
                width: 100px;
                min-height: 80px;
                box-sizing: border-box;
                background-color: rgba(31, 35, 41, 0.9);
                border-radius: 5px;
                z-index: 1;
                padding: 3px 0;

                .menu-item {
                    height: 40px;
                    line-height: 40px;
                    color: white;
                    font-size: 14px;

                    &:hover {
                        background-color: rgba(70, 72, 73, 0.9);
                    }
                }
            }
        }
    }

    .subheader {
        display: flex;
        flex-flow: row wrap;
        padding: 5px 8px;
        overflow: hidden;
        flex-shrink: 0;
        justify-content: space-between;
        background: aliceblue;
        //todo 间距不对齐
        &::after {
            content: '';
            flex: auto;
        }
        &-title {
            width: 100%;
            padding: 5px 5px;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 600;
        }

        .top-item {
            flex-basis: 41px;
            flex-shrink: 0;
            height: 50px;
            margin: 3px 2px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;

            .avatar {
                flex-basis: 32px;
                width: 32px;
                height: 32px;
                background-color: #508afe;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 10px;
                color: white;
                flex-shrink: 0;
                overflow: hidden;
                user-select: none;

                img {
                    width: 100%;
                    height: 100%;
                    background-color: white;
                }
            }

            .name {
                font-size: 12px;
                text-align: center;
                color: #8f959e;
                transform: scale(0.84);
                text-align: center;
                line-height: 20px;
                word-break: break-all;
                overflow: hidden;

                &.active {
                    color: #508afe;
                }
            }
        }

        &.shadow {
            box-shadow: 0 2px 6px 0 rgba(31, 35, 41, 0.05);
        }
    }
}

.aside-box .main {
    overflow: hidden;
    padding: 0;

    .empty-data {
        text-align: center;
        padding-top: 40px;
        color: #ccc;
    }

    .main-menu {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 6px 10px 6px 10px;
        align-items: center;
        user-select: none;

        .title {
            font-size: 12px;
            font-weight: 600;
            color: #1f2329;
        }

        .icon {
            cursor: pointer;
        }
    }

    .talk-item {
        padding: 8px 10px;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-left: 3px solid transparent;
        transition: 0.2s ease-in;

        .avatar-box {
            height: 35px;
            width: 35px;
            flex-shrink: 0;
            background-color: #508afe;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: white;
            user-select: none;
            transition: ease 1s;
            position: relative;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                background-color: white;
                border-radius: 3px;
            }

            .top-mask {
                width: 100%;
                height: 100%;
                background-color: rgba(22, 25, 29, 0.6);
                position: absolute;
                top: 0;
                left: 0;
                color: white;
                display: none;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            &:hover .top-mask {
                display: flex;
            }
        }

        .card-box {
            height: 40px;
            display: flex;
            align-content: center;
            flex-direction: column;
            flex: 1 1;
            margin-left: 10px;
            overflow: hidden;

            .title {
                width: 100%;
                height: 20px;
                display: flex;
                align-items: center;

                .card-name {
                    color: #1f2329;
                    font-size: 14px;
                    line-height: 20px;
                    flex: 1 1;
                    display: -webkit-flex;
                    display: -ms-flexbox;
                    display: flex;
                    align-items: center;
                    overflow: hidden;

                    .nickname {
                        font-weight: 400;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 3px;
                    }

                    .top {
                        color: #dc9b04 !important;
                        background-color: #faf1d1 !important;
                    }

                    .group {
                        color: #3370ff !important;
                        background-color: #e1eaff !important;
                        font-size: 13px;
                    }

                    .disturb {
                        color: #98999c !important;
                        background-color: #ecedf1 !important;

                        i {
                            font-size: 12px;
                        }
                    }
                }
            }

            .card-time {
                color: #8f959e;
                font-size: 12px;
                margin-left: 10px;
                user-select: none;
            }

            .content {
                font-size: 13px;
                line-height: 18px;
                color: #8f959e;
                margin-top: 3px;
                font-weight: 300;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                span:first-child {
                    margin-right: 5px;
                }

                .online-color {
                    color: #4aa71c;
                    font-weight: 300;
                }

                .draft-color {
                    color: red;
                    font-weight: 300;
                }
            }
        }

        &:hover {
            background-color: #eff0f1;
        }

        &.active {
            .avatar-box {
                border-radius: 5px;
            }

            background-color: #eff0f1;
        }
    }
}

//@media screen and (max-width: 800px) {
//    .aside-box {
//        .subheader {
//            display: none;
//        }
//
//        .card-box .larkc-tag {
//            display: none;
//        }
//    }
//}

//todo 改为全局css
:global(.v3-menus .v3-menus-body .v3-menus-item) {
    line-height: 0.14rem;
    font-size: 0.14rem;
    padding: 0.08rem 0.1rem;
}

:global(.v3-menus .v3-menus-body .v3-menus-item .v3-menus-icon) {
    width: 0.14rem;
    margin-right: 0.05rem;
}
:global(.v3-menus .v3-menus-body .v3-menus-item .v3-menus-icon svg) {
    display: flex;
    align-items: center;
    width: 0.14rem;
}
</style>
