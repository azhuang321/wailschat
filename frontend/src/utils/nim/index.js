import config from '@/config/config';
import { onConnect, onError, onWillReconnect, onDisConnect, onMyInfo } from './callback';

await import(`../../nim_sdk/${config.sdk}.js`);
let nim = null;

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
                appKey: config.appkey,
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

// 获取用户好友
export const getFriends = async () => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getFriends({
            done: async (error, friends) => {
                if (error) {
                    return reject(error);
                }
                resolve(friends);
            }
        });
    });
};

// 获取多个用户名片
export const getUsers = async (accounts, isSync = true) => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getUsers({
            accounts: accounts,
            sync: isSync,
            done: (error, users) => {
                if (error) {
                    return reject(error);
                }
                resolve(users);
            }
        });
    });
};

// 获取单个个用户名片
export const getUser = async (account, isSync = true) => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getUser({
            account: account,
            sync: isSync,
            done: (error, user) => {
                if (error) {
                    return reject(error);
                }
                resolve(user);
            }
        });
    });
};

// 更新用户好友信息
export const updateFriend = async (account, alias = '', custom = '') => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.updateFriend({
            account: account,
            alias: alias,
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};

// 从服务器获取回话列表
export const getServerSessions = async () => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getServerSessions({
            // minTimestamp: 1571039417853,
            // maxTimestamp: 1571039418800,
            needLastMsg: true,
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};