import * as c from './constants';
import lodash from 'lodash';

// 合并数组并去重
function concatAndUniqArr(arr1 = [], arr2 = []) {
    if (arr1.length === 0 && arr2.length === 0) {
        return [];
    }
    if (arr1.length === 0 && arr2.length > 0) {
        return arr2;
    }
    if (arr1.length > 0 && arr2.length === 0) {
        return arr1;
    }
    return lodash.uniqBy(lodash.concat(arr1, arr2), 'id');
}
// 去除数组对应元素
function removeArr(arr = [], remove = []) {
    if (arr.length === 0) {
        return [];
    }
    if (remove.length === 0) {
        return arr;
    }
    const removeArrId = [];
    remove.forEach(val => {
        removeArrId.push(val.id);
    });
    arr.map((val, index) => {
        if (removeArrId.includes(val.id)) {
            arr.splice(index, 1);
        }
    });
}

export const mutations = {
    [c.CONNECT_STATUS](state, payload) {
        state.connectStatus = payload.status;
    },
    [c.CONNECT_NOTIFICATION](state, payload) {
        state.connectNotification = payload.notification;
    },
    [c.CURRENT_SESSION_LIST](state, payload) {
        state.currentSessionList.push(payload.currentSession);
    },
    [c.TOP_SESSION_LIST](state, payload) {
        const remove = () => {
            removeArr(state.topSessionList, payload.topSessionList);
        };
        const add = () => {
            state.topSessionList = concatAndUniqArr(
                payload.topSessionList,
                toRaw(state.topSessionList)
            );
        };
        switch (payload?.action) {
            case 'remove':
                remove();
                break;
            default:
                add();
                break;
        }
    },
    [c.SESSION_LIST](state, payload) {
        let options = {
            keyPath: 'account',
            sortPath: 'updateTime',
            desc: true
        };
        state.sessionList = NIM.util.mergeObjArray(
            toRaw(state.sessionList),
            payload.session,
            options
        );
    }
};
