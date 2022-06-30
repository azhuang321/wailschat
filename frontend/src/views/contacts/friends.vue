<template>
    <div class="panel">
        <el-container class="full-height">
            <el-header height="60px" class="header no-select border">
                <p>我的好友({{ friendsList.length }})</p>
            </el-header>
            <el-main class="panel-body no-padding lum-scrollbar">
                <template v-if="friendsListStatue === 0">
                    <Loading/>
                </template>
                <template v-else-if="friendsListStatue === 1 && friendsList.length === 0">
                    <Empty text="暂无好友"/>
                </template>

                <template v-if="friendsListStatue === 1">
                    <div
                        v-for="(item, index) in friendsList"
                        :key="item.account"
                        class="data-item"
                        @click="showCardFunc(item, index)"
                    >
                        <el-avatar
                            class="avatar"
                            shape="square"
                            :size="35"
                            :src="item.avatar ? item.avatar : defaultAvatar"
                        >
                            {{ item.account.substr(0, 1) }}
                        </el-avatar>
                        <div class="card">
                            <div class="title">
                                <span class="name">
                                  {{ item.account ? item.account : item.nick }} <span class="alias" v-if="item.alias">备注:{{ item.alias }}</span>
                                </span>
                                <div v-show="item.online == 1" class="larkc-tag agree">
                                    在线
                                </div>
                            </div>
                            <div class="content">
                                [个性签名] 「{{ item.sign ? item.sign : '未设置' }}」
                            </div>
                        </div>

                        <div class="apply-from" @click.prevent.stop>
                            <el-button
                                size="small"
                                type="primary"
                                icon="el-icon-s-promotion"
                                @click="toTalk(1, item.id)"
                            >发送消息
                            </el-button>
                            <el-button
                                size="small"
                                type="danger"
                                icon="el-icon-delete"
                                @click="deleteFriend(item, index)"
                            >删除好友
                            </el-button>
                        </div>
                    </div>
                </template>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Empty from '@/components/global/Empty.vue';
import Loading from '@/components/global/Loading.vue';
import { toTalk } from '@/utils/talk';
import { getFriends } from '@/utils/nim/user';

import defaultAvatar from '@/assets/image/detault-avatar.jpg';
import { ElNotification } from 'element-plus';

const useFriendsListEffect = () => {
    const friendsList = reactive([]);
    const friendsListStatue = ref(0);
    const getFriendsListFunc = () => {
        getFriends().then((friends) => {
            friendsList.length = 0;
            friendsList.push(...friends);
        }).catch((err) => {
            ElNotification({
                type: 'error',
                message: '获取好友列表失败'
            });
        }).finally(() => {
            friendsListStatue.value = 1;
        });
    };
    return {
        defaultAvatar,
        friendsListStatue,
        friendsList,
        getFriendsListFunc
    };
};

// 查看用户名片
const useShowUserInfoEffect = () => {
    const showCard = inject('ShowUserCardFunc');
    const showCardFunc = (item, index) => {
        showCard(item);
    };
    return {
        showCardFunc
    };
};

export default {
    components: {
        Empty,
        Loading
    },
    data () {
        return {
            // friendsList: [],
            status: 1
        };
    },
    methods: {
        //
        // // 删除好友
        // deleteFriend (item, index) {
        //     const nickname = item.friend_remark || item.nickname;
        //     this.$alert(`您确定要删除【${nickname}】好友吗？`, '温馨提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         showCancelButton: true,
        //         closeOnClickModal: true,
        //         callback: action => {
        //             if (action != 'confirm') {
        //                 return false;
        //             }
        //
        //             const friend_id = item.id;
        //             ServeDeleteContact({
        //                 friend_id
        //             }).then(res => {
        //                 if (res.code == 200) {
        //                     this.$delete(this.items, index);
        //                     this.$message({
        //                         message: `好友 【${nickname}】已删除 ...`,
        //                         type: 'success'
        //                     });
        //                 } else {
        //                     this.$message({
        //                         message: `好友 【${nickname}】删除失败 ...`,
        //                         type: 'info'
        //                     });
        //                 }
        //             });
        //         }
        //     });
        // },
        //
        //
        // // 跳转聊天页面
        // toTalk (talk_type, receiver_id) {
        //     toTalk(talk_type, receiver_id);
        // }
    }
};
</script>

<script setup>
import {ElNotification} from "element-plus";

const { defaultAvatar, friendsListStatue, friendsList, getFriendsListFunc } = useFriendsListEffect();
const { showCardFunc } = useShowUserInfoEffect();
onActivated(getFriendsListFunc);

</script>
<style lang="scss" scoped>
.aside-box {
    position: relative;
    background-color: white;
    border-right: 1px solid rgb(245, 245, 245);
    overflow: hidden;
    padding: 0;

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 15px;

        .from {
            flex: 1 1;
            flex-shrink: 0;

            :deep(.el-input .el-input__inner) {
                border-radius: 20px;
                width: 175px;
            }
        }

        .tools {
            flex-basis: 32px;
            flex-shrink: 0;
            height: 32px;
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

                .menu1-item {
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
}

// 右侧面板
.panel {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.border{
            border-bottom: 1px solid #f5f5f5;
        }
    }

    .subheader {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-top: 1px solid rgb(92, 156, 230);
        border-bottom: 1px solid rgb(92, 156, 230);

        p {
            padding: 0 10px;
            cursor: pointer;
            font-size: 13px;

            &:first-child {
                padding-left: 0;
            }

            &.active {
                color: #508afe;
            }
        }
    }

    .panel-body {
        overflow: auto;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        .preloading {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            user-select: none;

            p {
                margin-top: 20px;
                color: #afacac;
                font-size: 14px;
                font-weight: 300;
            }
        }

        .data-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 60px;
            cursor: pointer;
            padding: 5px 15px;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid #f1ebeb;
            margin-bottom: 2px;

            .avatar {
                height: 35px;
                width: 35px;
                flex-basis: 35px;
                flex-shrink: 0;
                background-color: #508afe;
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: white;
                user-select: none;
                transition: ease 1s;
                position: relative;
            }

            .card {
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


                    .name {
                        margin-right: 15px;
                        font-size:.16rem;
                        color: #1f2329;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        .alias {
                            margin-left:.1rem;
                            font-size: .12rem
                        }
                    }

                    .larkc-tag {
                        font-size: 12px;
                        font-weight: 400;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 6px;
                        height: 20px;
                        border-radius: 2px;
                        cursor: default;
                        user-select: none;
                        background-color: #dee0e3;
                        transform: scale(0.8);
                        transform-origin: left;
                        flex-shrink: 0;
                    }

                    .wait {
                        background: #ffb445;
                        color: white;
                    }

                    .agree {
                        background: #53bd53;
                        color: white;
                    }
                }

                .content {
                    font-size: 10px;
                    line-height: 18px;
                    color: #8f959e;
                    overflow: hidden;
                    margin-top: 3px;
                    font-weight: 300;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            .apply-from {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                position: relative;
                right: -110px;
                top: 0px;
                height: 60px;
                width: 100px;
                transition: ease 0.5s 0.3s;
                background-color: white;
                opacity: 0;
                button {
                    margin: 2px;
                }
            }

            &:hover {
                box-shadow: 0 0 8px 4px #f1f1f1;

                .avatar {
                    border-radius: 2px;
                }

                .apply-from {
                    opacity: 1;
                    right: 0px;
                }
            }
        }
    }
}

.broadside-box {
    position: absolute;
    width: 350px;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 2;
    animation: showBox 0.5s ease-in-out;
    -webkit-animation: showBox 0.5s ease-in-out;
    -moz-animation: showBox 0.5s ease-in-out;
    -webkit-box-direction: normal;
    background: white;
    box-shadow: 0 0 14px #cccccc70;
}

@keyframes showBox {
    0% {
        transform: translateX(350px);
    }

    to {
        transform: translateX(0);
    }
}

@-webkit-keyframes showBox {
    0% {
        -webkit-transform: translateX(350px);
    }

    to {
        -webkit-transform: translateX(0);
    }
}

</style>
