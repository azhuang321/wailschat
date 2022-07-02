import { getNimInstance, getFriends, getUsers, getServerSessions } from '@/utils/nim/index';

// 获取好友列表
export const getFriendList = async () => {
    let nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        getFriends()
            .then(async friends => {
                const friendsAccounts = friends.map(i => i.account);
                const usersInfo = await getUsers(friendsAccounts, false);
                const friendsList = nim.cutFriends(
                    nim.mergeFriends(friends, usersInfo),
                    friends.invalid
                );
                resolve(friendsList);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// 获取回话列表
export const getSessionList = async () => {
    let sessionServerList = [];
    return new Promise((resolve, reject) => {
        getServerSessions()
            .then(res => {
                if (res.sessionList.length > 0) {
                    let sessionAccounts = res.sessionList.map(res => {
                        let account = res.id.split('p2p-')[1];
                        res.id = account;
                        return account;
                    });
                    sessionServerList = res.sessionList;
                    //todo 发现不存在的用户，需要去服务器同步
                    return getUsers(sessionAccounts, false);
                }
            })
            .then(res => {
                sessionServerList.map((val1, index) => {
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].account === val1.id) {
                            sessionServerList[index] = Object.assign(res[i], val1);
                            continue;
                        }
                    }
                });
                resolve(sessionServerList);
            })
            .catch(err => {
                reject(err);
            });
    });
};
