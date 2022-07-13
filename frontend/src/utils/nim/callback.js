import store from '@/store';

export const isConnect = ref(false);

export const onConnect = event => {
    isConnect.value = true;
};

export const onError = event => {
    isConnect.value = false;
    console.log('onError', event);
};

export const onWillReconnect = event => {
    isConnect.value = false;
    console.log('onWillReconnect', event);
};

export const onDisConnect = error => {
    isConnect.value = false;

    console.log('onDisConnect', error);
    switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302: {
            alert('帐号或密码错误');
            break;
        }
        case 'kicked': {
            const map = {
                PC: '电脑版',
                Web: '网页版',
                Android: '手机版',
                iOS: '手机版',
                WindowsPhone: '手机版'
            };
            // let str = error.from;
            const errorMsg = "你的帐号于 '其他端'踢出下线，请确定帐号信息安全!";
            alert(errorMsg);
            break;
        }
        default:
            break;
    }
};

// 回调: 用户信息
export const onMyInfo = obj => {
    console.log('my info', obj);
};

export const onMsg = msg => {
    console.log('收到消息', msg.scene, msg.type, msg);
    msg.float = 'left';
    store.commit('PUSH_DIALOGUE', msg);
    // console.log(store);

    // switch (msg.type) {
    //     case 'custom':
    //         onCustomMsg(msg);
    //         break;
    //     case 'notification':
    //         // 处理群通知消息
    //         onTeamNotificationMsg(msg);
    //         break;
    //     // 其它case
    //     default:
    //         break;
    // }
};
