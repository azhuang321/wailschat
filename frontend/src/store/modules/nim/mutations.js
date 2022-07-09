import * as c from './constants';

export const mutations = {
    [c.CONNECT_STATUS](state, payload) {
        state.connectStatus = payload.status;
    },
    [c.SESSION_LIST](state, payload) {
        state.sessionList.length = 0;
        state.sessionList.push(...payload.session);
    },
    [c.CONNECT_NOTIFICATION](state, payload) {
        state.connectNotification = payload.notification;
    }
};
