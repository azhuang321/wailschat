import {
    getNimInstance,
    getFriends,
    getUsers,
    getServerSessions,
    getLocalTeams,
    getTeams,
    getStickTopSessions
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
export const getUserTeams = async (teamIds = [], isServer = false) => {
    return new Promise((resolve, reject) => {
        if (isServer) {
            getTeams()
                .then(teams => {
                    resolve(teams);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            getLocalTeams(teamIds)
                .then(teams => {
                    resolve(teams?.teams ?? []);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
};

// 处理会话列表
async function dealSessionList(sessionList = []) {
    if (sessionList.length === 0) {
        return [];
    }
    //todo 发现不存在的用户，需要去服务器同步
    const friendList = await getFriendList();
    const teamIds = [];
    sessionList.map((val, index) => {
        val.session_id = val.id;
        if (val.id.startsWith('team-')) {
            val.session_type = 'team';
            teamIds.push(val.id.split('team-')[1]);
        }
        if (val.id.startsWith('p2p-')) {
            val.session_type = 'p2p';
            for (let i = 0; i < friendList.length; i++) {
                if (friendList[i].account === val.id.split('p2p-')[1]) {
                    friendList[i].name = friendList[i].alias
                        ? friendList[i].alias
                        : friendList[i].nick;
                    sessionList[index] = Object.assign(friendList[i], val);
                    friendList.splice(i, 1);
                    continue;
                }
            }
        }
    });
    const teams = await getUserTeams(teamIds, false);
    sessionList.map((val, index) => {
        if (val.session_type === 'team') {
            for (let i = 0; i < teams.length; i++) {
                if (teams[i].teamId === val.id.split('team-')[1]) {
                    sessionList[index] = Object.assign(teams[i], val);
                    teams.splice(i, 1);
                    continue;
                }
            }
        }
    });
    return sessionList;
}

// 获取会话列表
export const getSessionList = async () => {
    return new Promise((resolve, reject) => {
        getServerSessions()
            .then(async res => {
                resolve(dealSessionList(res.sessionList));
            })
            .catch(err => {
                reject(err);
            });
    });
};

// 获取置顶会话列表
export const getTopSessionList = async () => {
    return new Promise((resolve, reject) => {
        getStickTopSessions()
            .then(async res => {
                resolve(dealSessionList(res));
            })
            .catch(err => {
                reject(err);
            });
    });
};
