import {
    getNimInstance,
    getFriends,
    getUsers,
    getServerSessions,
    getLocalTeams
} from '@/utils/nim/index';

const nim = await getNimInstance();

// 获取好友列表 todo 区分本地和服务器
export const getFriendList = async () => {
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

//获取群组列表 todo 区分本地和服务器
export const getTeams = async (teamIds = []) => {
    return new Promise((resolve, reject) => {
        getLocalTeams(teamIds)
            .then(teams => {
                resolve(teams.teams);
            })
            .catch(err => {
                reject(err);
            });
    });
};

// 获取会话列表 todo 统一 account 与 id
export const getSessionList = async () => {
    let sessionServerList = [];
    const teamIds = [];
    return new Promise((resolve, reject) => {
        getServerSessions()
            .then(async res => {
                if (res.sessionList.length > 0) {
                    res.sessionList.map(res => {
                        if (res.id.startsWith('team-')) {
                            res.id = res.id.split('team-')[1];
                            res.session_type = 'team';
                            teamIds.push(res.id);
                        }
                        if (res.id.startsWith('p2p-')) {
                            res.id = res.id.split('p2p-')[1];
                            res.session_type = 'p2p';
                        }
                    });
                    sessionServerList = res.sessionList;
                    //todo 发现不存在的用户，需要去服务器同步
                    const friendList = await getFriendList();
                    const teams = await getTeams(teamIds);

                    sessionServerList.map((val1, index) => {
                        if (val1.session_type === 'team') {
                            for (let i = 0; i < teams.length; i++) {
                                if (teams[i].teamId === val1.id) {
                                    sessionServerList[index] = Object.assign(teams[i], val1);
                                    continue;
                                }
                            }
                        }
                        if (val1.session_type === 'p2p') {
                            console.log(friendList);
                            for (let i = 0; i < friendList.length; i++) {
                                if (friendList[i].account === val1.id) {
                                    sessionServerList[index] = Object.assign(friendList[i], val1);
                                    friendList.splice(i, 1);
                                    continue;
                                }
                            }
                        }
                    });
                    resolve(sessionServerList);
                }
            })
            .catch(err => {
                reject(err);
            });
    });
};
