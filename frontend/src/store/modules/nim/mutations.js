import * as c from './constants';

export const mutations = {
    [c.CONNECT_STATUS](state, status) {
        state.connectStatus = status;
    },
    [c.SESSION_LIST](state, sessionList) {
        state.sessionList = sessionList;
    }
};
