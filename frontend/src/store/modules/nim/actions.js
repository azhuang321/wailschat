import * as c from './constants';

export const actions = {
    // 连接状态
    [c.CONNECT_STATUS]({ commit }, payload) {
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
    [c.TOP_SESSION_LIST]({ commit }, payload) {
        commit(payload);
    },
    //会话列表
    [c.SESSION_LIST]({ commit }, payload) {
        commit(payload);
    }
};
