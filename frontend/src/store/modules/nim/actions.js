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
    return lodash.dropRightWhile(arr, val => {
        return removeArrId.includes(val.id);
    });
}

export const actions = {
    // 连接状态
    [c.CONNECT_STATUS]({ commit }, payload) {
        commit(payload);
    },
    //会话列表
    async [c.SESSION_LIST]({ state, commit }, payload) {
        let options = {
            keyPath: 'account',
            sortPath: 'updateTime',
            desc: true
        };
        payload.session = NIM.util.mergeObjArray(
            toRaw(state.sessionList),
            payload.session,
            options
        );
        commit(payload);
    },
    //连接状态通知
    [c.CONNECT_NOTIFICATION]({ commit }, payload) {
        commit(payload);
    },
    // 当前会话列表
    [c.CURRENT_SESSION_LIST]({ state, commit }, payload) {
        for (let i = 0; i < state.currentSessionList.length; i++) {
            if (state.currentSessionList[i].receiver_id === payload.currentSession.receiver_id) {
                return;
            }
        }
        commit(payload);
    },
    // 置顶会话列表
    [c.TOP_SESSION_LIST]({ state, commit }, payload) {
        const remove = () => {
            payload.topSessionList = removeArr(toRaw(state.topSessionList), payload.topSessionList);
        };
        const add = () => {
            payload.topSessionList = concatAndUniqArr(
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
        commit(payload);
    }
};
