<template>
    <div id="login-box">
        <div class="header">账号注册</div>
        <div class="main">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item prop="nickname">
                    <el-input
                        v-model="form.nickname"
                        placeholder="用户昵称"
                        class="cuborder-radius"
                        maxlength="11"
                        autocomplete="off"
                        @keyup.enter.native="onSubmit('form')"
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="密码"
                        class="cuborder-radius"
                        autocomplete="new-password"
                        @keyup.enter.native="onSubmit('form')"
                    />
                </el-form-item>
                <el-form-item prop="password2">
                    <el-input
                        v-model="form.password2"
                        type="password"
                        placeholder="确认密码"
                        class="cuborder-radius"
                        @keyup.enter.native="onSubmit('form')"
                    />
                </el-form-item>
                <el-form-item prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="手机号"
                        class="cuborder-radius"
                        maxlength="11"
                        @keyup.enter.native="onSubmit('form')"
                    />
                </el-form-item>
                <el-form-item prop="sms_code">
                    <el-input
                        v-model="form.sms_code"
                        placeholder="验证码(随意填写)"
                        class="cuborder-radius"
                        maxlength="6"
                        style="width: 205px"
                        @keyup.enter.native="onSubmit('form')"
                    />

                    <div v-if="smsLock" class="send-code-btn send-sms-disable">
                        正在发送 ...
                    </div>
                    <div
                        v-else-if="smsLock == false && smsLockObj.time == null"
                        class="send-code-btn"
                        @click="sendSms"
                    >
                        获取短信
                    </div>
                    <div v-else class="send-code-btn send-sms-disable">
                        重新发送({{ smsLockObj.time }}s)
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        class="submit-btn"
                        :loading="registerLoading"
                        @click="onSubmit('form')"
                    >
                        立即注册
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <div class="links">
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="toLink('/auth/forget')"
                        >
                            找回密码
                        </el-link>
                        <el-link
                            type="primary"
                            :underline="false"
                            @click="toLink('/auth/login')"
                        >
                            已有账号，立即登录?
                        </el-link>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { ServeSendVerifyCode } from '@/api/common';
import { ServeRegister } from '@/api/auth';
import { isMobile } from '@/utils/validate';
import SmsLock from '@/plugins/sms-lock';

export default {
    data () {
        const validateMobile = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('手机号不能为空！'));
                return;
            }

            if (!isMobile(value)) {
                callback(new Error('手机号格式不正确！'));
            } else {
                callback();
            }
        };

        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };

        return {
            registerLoading: false,
            form: {
                nickname: '',
                username: '',
                password: '',
                password2: '',
                sms_code: ''
            },
            rules: {
                nickname: [
                    {
                        required: true,
                        message: '用户昵称不能为空!',
                        trigger: 'blur'
                    }
                ],
                username: [
                    {
                        validator: validateMobile,
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '登录密码不能为空!',
                        trigger: 'blur'
                    }
                ],
                password2: [
                    {
                        validator: validatePass2,
                        trigger: 'blur'
                    }
                ],
                sms_code: [
                    {
                        required: true,
                        message: '验证码不能为空!',
                        trigger: 'blur'
                    }
                ]
            },

            smsLock: false,
            smsLockObj: null
        };
    },
    created () {
        this.smsLockObj = new SmsLock('REGISTER_SMS', 120);
    },
    unmounted () {
        this.smsLockObj.clearInterval();
    },
    methods: {
        toLink (url) {
            this.$router.push({
                path: url
            });
        },

        onSubmit (formName) {
            if (this.registerLoading) return false;

            this.$refs[formName].validate(valid => {
                if (!valid) return false;
                this.registerLoading = true;
                this.register();
            });
        },

        register () {
            ServeRegister({
                nickname: this.form.nickname,
                mobile: this.form.username,
                password: this.form.password,
                sms_code: this.form.sms_code,
                platform: 'web'
            })
                .then(res => {
                    if (res.code == 200) {
                        this.$notify({
                            title: '成功',
                            message: '注册成功,快去登录吧...',
                            type: 'success'
                        });

                        this.$refs.form.resetFields();
                        setTimeout(() => {
                            this.toLink('/auth/login');
                        }, 1500);
                    } else {
                        this.$notify.info({
                            title: '提示',
                            message: res.message
                        });
                    }
                })
                .catch(() => {
                    this.$notify({
                        message: '网络错误,请稍后再试...'
                    });
                })
                .finally(() => {
                    this.registerLoading = false;
                });
        },

        // 点击发送验证码
        sendSms () {
            if (this.smsLock) return false;

            if (!isMobile(this.form.username)) {
                this.$refs.form.validateField('username');
                return false;
            }

            this.smsLock = true;
            ServeSendVerifyCode({
                mobile: this.form.username,
                channel: 'register'
            })
                .then(res => {
                    if (res.code == 200) {
                        this.$notify({
                            title: '成功',
                            message: '验证码发送成功...',
                            type: 'success'
                        });

                        this.smsLockObj.start();

                        if (res.data.is_debug) {
                            setTimeout(() => {
                                this.$notify({
                                    title: '提示',
                                    message: '已自动填充验证码'
                                });

                                this.form.sms_code = res.data.sms_code;
                            }, 500);
                        }
                    } else {
                        this.$notify({
                            title: '提示',
                            message: res.message,
                            customClass: 'cus-notifyclass'
                        });
                    }
                })
                .finally(() => {
                    this.smsLock = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
    border-radius: 1px !important;
}

#auth-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: #f6f8fb;

    #logo-name {
        width: 200px;
        height: 38px;
        font-size: 34px;
        font-family: Times New Roman, Georgia, Serif, serif;
        color: #2196f3;
        margin-left: 20px;
        margin-top: 20px;
    }

    #login-box {
        position: absolute;
        width: 350px;
        min-height: 480px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 0 0 #ccc;
        box-shadow: 0 4px 14px 0 rgba(206, 207, 209, 0.5);
        padding: 10px 20px;

        .header {
            width: 100%;
            height: 38px;
            font-size: 22px;
            margin: 25px 0 20px 0;
        }

        .main {
            width: 100%;

            .links {
                display: flex;
                justify-content: space-between;
                align-items: center;

                a {
                    font-weight: normal !important;
                }
            }

            .send-code-btn {
                width: 140px;
                height: 40px;
                line-height: 40px;
                display: inline-block;
                background: #f3ecec;
                text-align: center;
                color: #777373;
                cursor: pointer;
                user-select: none;
                margin-left: 5px;

                &:active {
                    background: #e4dbdb;
                }
            }

            .send-sms-disable {
                cursor: not-allowed !important;
                background: #f7f7f7 !important;
                color: silver !important;
            }

            .submit-btn {
                width: 100%;
                border-radius: 2px;
            }
        }
    }
}
</style>
