import store from '@/store';
import router from '@/router';
import { ElNotification as Notification } from 'element-plus';

class Base {
  /**
   * 初始化
   */
  constructor () {
    this.$notify = Notification;
  }

  getStoreInstance () {
    return store;
  }

  /**
   * 获取当前登录用户的ID
   */
  getAccountId () {
    return store.state.user.uid;
  }

  getTalkParams () {
    const { talk_type, receiver_id, index_name } = store.state.dialogue;

    return { talk_type, receiver_id, index_name };
  }

  /**
   * 判断消息是否来自当前对话
   *
   * @param {Number} talk_type 聊天消息类型[1:私信;2:群聊;]
   * @param {Number} sender_id 发送者ID
   * @param {Number} receiver_id 接收者ID
   */
  isTalk (talk_type, sender_id, receiver_id) {
    const params = this.getTalkParams();

    if (talk_type != params.talk_type) {
      return false;
    } else if (
      params.receiver_id == receiver_id ||
      params.receiver_id == sender_id
    ) {
      return true;
    }

    return false;
  }

  /**
   * 判断用户是否打开对话页
   */
  isTalkPage () {
    const path = router.currentRoute.path;
    return !(path != '/message' && path != '/');
  }
}

export default Base;
