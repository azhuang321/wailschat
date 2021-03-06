<template>
    <div class="lum-dialog-mask animated fadeIn">
        <el-container v-outside="close" class="container">
            <el-header class="no-padding header" height="180px">
                <span class="close pointer" @click="close"><Close /></span>
                <div class="img-banner">
                    <img :src="detail.bag" class="img-banner" />
                </div>
                <div class="user-header">
                    <div class="avatar">
                        <div class="avatar-box">
                            <img :src="detail.avatar || defaultAvatar" :onerror="defaultAvatar" />
                        </div>
                    </div>
                    <div class="nickname">
                        <i class="iconfont icon-qianming"></i>
                        <span>{{ detail.nickname || '未设置昵称' }}</span>
                        <div class="share no-select">
                            <i class="iconfont icon-fenxiang3"></i> <span>分享</span>
                        </div>
                    </div>
                </div>
            </el-header>
            <el-main class="no-padding main">
                <div class="user-sign">
                    <div class="sign-arrow"></div>
                    <i class="iconfont icon-bianji"></i>
                    <span>编辑个签，展示我的独特态度。 </span>
                </div>

                <div class="card-rows no-select">
                    <div class="card-row">
                        <label>手机</label>
                        <span>{{ detail.mobile }}</span>
                    </div>
                    <div class="card-row">
                        <label>昵称</label>
                        <span>{{ detail.nickname || '未设置昵称' }}</span>
                    </div>
                    <div class="card-row">
                        <label>性别</label>
                        <span>{{ userGender }}</span>
                    </div>
                    <div class="card-row">
                        <label>备注</label>
                        <span v-if="remarkData.isShow === false">
                            <span>{{ remarkData.text ? remarkData.text : '暂无备注' }}</span>
                            <Edit v-show="!remarkData.isShow" @click="handClickEditRemark" />
                        </span>
                        <span v-else>
                            <input
                                v-model="remarkData.text"
                                v-focus
                                class="friend-remark"
                                type="text"
                                @blur="handleBlurRemark"
                                @keyup.enter="handleEditRemarkSubmit"
                            />
                            <el-button class="submit-btn" :loading="saveRemarkLoading" />
                            <Select v-show="remarkData.isShow" @click="handleEditRemarkSubmit" />
                        </span>
                    </div>

                    <div class="card-row">
                        <label>邮箱</label>
                        <span v-if="detail.email">{{ detail.email }}</span>
                        <span v-else>未设置</span>
                    </div>
                </div>
            </el-main>
            <el-footer class="no-padding footer" height="50px">
                <el-button
                    type="primary"
                    :icon="PromotionIcon"
                    @click="sendMessage($event, detail)"
                >
                    发消息
                </el-button>
            </el-footer>

            <!-- 添加好友申请表单 -->
            <div
                v-outside="closeApply"
                class="friend-from"
                :class="{ 'friend-from-show': apply.isShow }"
            >
                <p>
                    <span>请填写好友申请备注：</span>
                    <span @click="closeApply">取消</span>
                </p>
                <div>
                    <input
                        v-model="apply.text"
                        type="text"
                        placeholder="(必填项)"
                        @keyup.enter="sendApply"
                    />
                    <el-button type="primary" size="small" @click="sendApply"> 立即提交 </el-button>
                </div>
            </div>
        </el-container>
    </div>
</template>
<script>
import { ServeSearchUser, ServeCreateContact, ServeEditContactRemark } from '@/api/contacts';
import { toTalk } from '@/utils/talk';

import defaultUserBanner from '@/assets/image/default-user-banner.png';
import { getUser, updateFriend } from '@/utils/nim/index';
import defaultAvatar from '@/assets/image/detault-avatar.jpg';
import { Promotion, Close, Select, Edit } from '@element-plus/icons-vue';

import { ElNotification } from 'element-plus';

const userIconEffect = () => {
    return {
        Close: markRaw(Close),
        Select: markRaw(Select),
        Edit: markRaw(Edit)
    };
};

const useUserCardShowEffect = () => {
    const { props } = getCurrentInstance();
    const accountInfo = props.account_info;
    const detail = reactive({
        account: accountInfo.account,
        mobile: accountInfo.tel,
        nickname: accountInfo.nick,
        avatar: accountInfo.avatar,
        alias: accountInfo.alias,
        bag: defaultUserBanner,
        gender: accountInfo.gender,
        email: accountInfo.email
    });

    const genderObj = {
        male: '男',
        female: '女',
        unknown: '未知'
    };
    const userGender = computed({
        get: () => genderObj[detail.gender]
    });

    const close = () => {
        props.close();
    };

    const PromotionIcon = markRaw(Promotion);
    return { close, accountInfo, detail, userGender, defaultAvatar, PromotionIcon };
};

const useUserRemarkEffect = () => {
    const { detail, accountInfo } = useUserCardShowEffect();
    const remarkData = reactive({
        isShow: false,
        text: detail.alias
    });

    // 点击编辑备注信息
    const handClickEditRemark = () => {
        remarkData.isShow = true;
    };

    // 编辑好友备注信息
    const saveRemarkLoading = ref(false);
    const handleEditRemarkSubmit = () => {
        saveRemarkLoading.value = true;
        updateFriend(detail.account, remarkData.text)
            .then(obj => {
                remarkData.text = obj.alias;
                accountInfo.alias = obj.alias;
                detail.alias = obj.alias;
            })
            .catch(err => {
                ElNotification({
                    type: 'error',
                    message: '更新用户信息失败'
                });
                remarkData.text = detail.alias;
            })
            .finally(() => {
                saveRemarkLoading.value = false;
                remarkData.isShow = false;
            });
    };
    const handleBlurRemark = () => {
        if (detail.alias === remarkData.text) {
            remarkData.isShow = false;
        } else {
            handleEditRemarkSubmit();
        }
    };

    return {
        remarkData,
        handClickEditRemark,
        handleEditRemarkSubmit,
        handleBlurRemark,
        saveRemarkLoading
    };
};
let parentClose = null;
const useSendMessageEffect = () => {
    const sendMessage = (event, test) => {
        parentClose();
        toTalk(1, this.user_id);
    };
    return {
        sendMessage
    };
};

export default {
    name: 'UserCardDetail',
    props: {
        account_info: {
            type: Object,
            default: null
        },
        close: Function
    },
    data() {
        return {
            // 好友申请表单
            apply: {
                isShow: false,
                text: ''
            },

            contacts: false
        };
    },
    methods: {
        // 发送添加好友申请
        sendApply() {
            if (this.apply.text == '') {
                return;
            }
            ServeCreateContact({
                friend_id: this.detail.user_id,
                remark: this.apply.text
            }).then(res => {
                if (res.code == 200) {
                    this.apply.isShow = false;
                    this.apply.text = '';
                    this.detail.friend_apply = 1;
                } else {
                    alert('发送好友申请失败,请稍后再试...');
                }
            });
        },

        // 隐藏申请表单
        closeApply() {
            this.apply.isShow = false;
        }

        // 发送好友消息
        // sendMessage() {
        //     this.close();
        //     toTalk(1, this.user_id);
        // }
    }
};
</script>

<script setup>
const { close, detail, userGender, defaultAvatar, PromotionIcon } = useUserCardShowEffect();
parentClose = close;
const {
    remarkData,
    handClickEditRemark,
    handleEditRemarkSubmit,
    handleBlurRemark,
    saveRemarkLoading
} = useUserRemarkEffect();

const { Close, Edit, Select } = userIconEffect();
const { sendMessage } = useSendMessageEffect();
</script>
<style lang="scss" scoped>
.container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 350px;
    height: 600px;
    overflow: hidden;
    border-radius: 3px;

    .header {
        position: relative;
        padding: 0;

        .close {
            position: absolute;
            right: 5px;
            top: 5px;
            color: white;
            transition: all 1s;
            z-index: 1;
            font-size: 20px;
            width: 20px;
        }

        .img-banner {
            width: 100%;
            height: 100%;
            background-image: url(@/assets/image/default-user-banner.png);
            background-size: 100%;
            transition: all 0.2s linear;
            cursor: pointer;
            overflow: hidden;

            img:hover {
                -webkit-transform: scale(1.1);
                transform: scale(1.1);
                -webkit-filter: contrast(130%);
                filter: contrast(130%);
            }
        }
    }

    .main {
        background-color: white;
        padding: 45px 16px 0;
    }

    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #f5eeee;

        button {
            width: 90%;
        }
    }
}

.user-header {
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: -40px;
    display: flex;
    flex-direction: row;

    .avatar {
        width: 100px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;

        .avatar-box {
            width: 80px;
            height: 80px;
            background-color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                height: 70px;
                width: 70px;
                border-radius: 50%;
            }
        }
    }

    .nickname {
        flex: auto;
        padding-top: 50px;
        font-size: 16px;
        font-weight: 400;

        span {
            margin-left: 5px;
        }

        .share {
            display: inline-flex;
            width: 50px;
            height: 22px;
            background: #ff5722;
            color: white;
            align-items: center;
            justify-content: center;
            padding: 3px 8px;
            border-radius: 20px;
            transform: scale(0.7);
            cursor: pointer;

            i {
                margin-top: 2px;
            }

            span {
                font-size: 14px;
                margin-left: 4px;
            }
        }
    }
}

.user-sign {
    min-height: 26px;
    border-radius: 5px;
    padding: 5px;
    line-height: 25px;
    background: #f3f5f7;
    color: #7d7d7d;
    font-size: 12px;
    margin-bottom: 20px;
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    position: relative;

    .sign-arrow {
        position: absolute;
        width: 0;
        height: 0;
        font-size: 0;
        border: 5px solid hsla(0, 0%, 96.9%, 0);
        border-bottom-color: #f3f5f7;
        left: 28px;
        top: -9px;
    }
}

.card-rows {
    .card-row {
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        color: #736f6f;

        label {
            margin-right: 25px;
            color: #cbc5c5;
        }
        .submit-btn {
            border: none;
        }

        .friend-remark {
            border: none;
            border-bottom: 1px dashed #bec3d0;
            padding-bottom: 2px;
            color: #736f6f;
            width: 60%;
            padding-right: 5px;
            &:focus {
                outline: none;
            }
        }

        .el-icon-edit-outline {
            margin-left: 3px !important;
        }
        display: flex;

        span {
            display: flex;
            justify-content: space-between;
            svg {
                width: 20px;
            }
        }
    }
}

/* 好友申请表单 */
.friend-from {
    position: absolute;
    background: #fbf6f6;
    height: 80px;
    z-index: 2;
    width: 100%;
    bottom: -80px;
    left: 0;
    transition: all 0.5s ease-in-out;

    p {
        height: 20px;
        line-height: 20px;
        padding: 7px 5px 5px 15px;
        font-size: 13px;

        span {
            &:nth-child(2) {
                float: right;
                margin-right: 13px;
                color: #32caff;
                cursor: pointer;
            }
        }
    }

    div {
        height: 31px;
        line-height: 20px;
        padding: 7px 5px 5px 15px;
        font-size: 13px;
    }

    input {
        height: 30px;
        line-height: 30px;
        width: 220px;
        border-radius: 3px;
        padding: 0 5px;
        margin-right: 5px;
    }
}

.friend-from-show {
    bottom: 0;
}
</style>
