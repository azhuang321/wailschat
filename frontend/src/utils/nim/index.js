import config from '@/config/config';
import { onConnect, onError, onWillReconnect, onDisConnect, onMyInfo, onMsg } from './callback';

import(`../../nim_sdk/${config.sdk}.js`);
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
                onpushevents: param => {
                    // account: "azhuang1"
                    // clientType: "Web"
                    // custom: {}
                    // idClient: "15fb8a65-08ec-4ef8-854c-1eea281652a3"
                    // idServer: "debf1845-7732-481e-a233-624203090e81"
                    // serverConfig: "{\"online\":[16]}"
                    // time: "1657543885640"
                    // type: "1"
                    // value: "1"    //1 - 登录，2 - 登出，3 - 断开连接
                    console.log('订阅事件', param.msgEvents);
                },
                onsyncdone: function onSyncDone() {
                    // 说明在聊天列表页
                    console.dir('同步完成');
                    resolve();
                },
                onmsg: onMsg
            });

            setTimeout(() => {
                nim.subscribeEvent({
                    type: 1,
                    accounts: ['azhuang1', 'azhuang2'],
                    subscribeTime: 70,
                    sync: true,
                    done: (error, obj) => {
                        console.log('订阅事件' + (!error ? '成功' : '失败'), error, obj);
                    }
                });
            }, 2000);
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

//获取本地群组列表
export const getLocalTeams = async teamIds => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        if (teamIds.length === 0) {
            return resolve([]);
        }
        nim.getLocalTeams({
            teamIds: teamIds,
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};
// 获取群列表 http://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html#getTeams__anchor
export const getTeams = async () => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getTeams({
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};

// 发送消息 todo 完善发送设置
export const sendText = async content => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        let msg = nim.sendText({
            scene: 'p2p',
            to: 'azhuang1',
            text: content,
            done: (error, msg) => {
                console.log(
                    '发送' +
                        msg.scene +
                        ' ' +
                        msg.type +
                        '消息' +
                        (!error ? '成功' : '失败') +
                        ', id=' +
                        msg.idClient,
                    error,
                    msg
                );
            }
        });
        console.log('正在发送p2p text消息, id=' + msg.idClient);
    });
};

//获取云端消息 http://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html#getHistoryMsgs__anchor
// todo 完善
export const getHistoryMsgs = async () => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getHistoryMsgs({
            scene: 'p2p',
            to: 'azhuang1',
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};

/**************************************************** 会话相关 **************************************************************************************************/
// 获取置顶会话列表 http://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html#getStickTopSessions__anchor
export const getStickTopSessions = async (isShowDelete = false) => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getStickTopSessions({
            findDelete: isShowDelete,
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};

// 新增置顶会话 http://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html#addStickTopSession__anchor
export const addStickTopSession = async id => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.addStickTopSession({
            id: id,
            topCustom: '',
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};

// 删除置顶会话 http://dev.yunxin.163.com/docs/interface/%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AFWeb%E7%AB%AF/NIMSDK-Web/NIM.html#deleteStickTopSession__anchor
export const deleteStickTopSession = async id => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.deleteStickTopSession({
            id: id,
            done: (error, obj) => {
                if (error) {
                    return reject(error);
                }
                resolve(obj);
            }
        });
    });
};
