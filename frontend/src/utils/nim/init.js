import { onConnect, onError, onWillReconnect, onDisConnect } from './callback';
import { onMyInfo } from '@/utils/nim/user';

await import('../../nim_sdk/NIM_Web_NIM_v9.2.0.js');
let nim = null;

import * as nimtest from 'nim';
console.dir(nimtest);
console.dir(window.NIM);

/**
 * 文档地址
 * http://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html#getUser
 */
export const getNimInstance = async () => {
    // todo 监听状态的改变 onConnect 中改变状态
    if (nim === null) {
        await new Promise((resolve, reject) => {
            nim = window.NIM.getInstance({
                debug: false,
                appKey: '45c6af3c98409b18a84451215d0bdd6e',
                account: 'azhuang',
                token: '4297f44b13955235245b2497399d7a93',
                transports: ['websocket'],
                db: true,
                syncSessionUnread: true,
                syncRobots: true,
                autoMarkRead: true,
                onconnect: onConnect, // 连接回调
                onerror: onError, // 连接错误回调
                onmyinfo: onMyInfo,
                onwillreconnect: onWillReconnect,
                ondisconnect: onDisConnect,
                onsyncdone: function onSyncDone() {
                    // 说明在聊天列表页
                    console.dir('同步完成');
                    resolve();
                }
            });
        });
    }
    return nim;
};
