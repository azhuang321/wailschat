import * as c from './constants';

export const actions = {
    // 连接状态
    [c.CONNECT_STATUS]({ commit }, payload) {
        commit(payload);
    },
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
    }
};
