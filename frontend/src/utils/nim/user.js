import { getNimInstance } from '@/utils/nim/init';

// 回调: 用户信息
const onMyInfo = (obj) => {
    console.log('my info', obj);
};

// 获取用户好友
const getFriends = async () => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getFriends({
            done: async (error, friends) => {
                if (error) return reject(error);
                const friendsAccounts = friends.map(i => i.account);
                const usersInfo = await getUsers(friendsAccounts, false);
                const friendsList = nim.cutFriends(nim.mergeFriends(friends, usersInfo), friends.invalid);
                resolve(friendsList);
            }
        });
    });
};

// 获取多个用户名片
const getUsers = async (accounts, isSync = true) => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getUsers({
            accounts: accounts,
            sync: isSync,
            done: (error, users) => {
                if (error) return reject(error);
                resolve(users);
            }
        });
    });
};

// 获取单个个用户名片
const getUser = async (account, isSync = true) => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.getUser({
            account: account,
            sync: isSync,
            done: (error, user) => {
                if (error) return reject(error);
                resolve(user);
            }
        });
    });
};

// 更新用户好友信息
const updateFriend = async (account, alias = '', custom = '') => {
    const nim = await getNimInstance();
    return new Promise((resolve, reject) => {
        nim.updateFriend({
            account: account,
            alias: alias,
            done: (error, obj) => {
                if (error) return reject(error);
                resolve(obj);
            }
        });
    });
};


export {
    onMyInfo, getFriends, getUsers, getUser, updateFriend
};


// 去重数组
// const test = friends.reduce((acc, { account }) => {
//     if (!acc.includes(account)) acc.push(account);
//     return acc;
// }, []);
// console.dir(test);
