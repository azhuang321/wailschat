import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store';
import 'normalize.css';
import '@/assets/css/base.scss';

import '@/style/index.scss';

import '@/assets/css/global.scss';

import registerDirectives from './core/directives'; // 自定义指令

// import './core/global-component'; // 全局插件

import { myPlugin } from '@/components/user/user-card';
import { directive, menusEvent, Vue3Menus } from 'vue3-menus';
import {
    AudioMessage,
    CodeMessage,
    ForwardMessage,
    ImageMessage,
    TextMessage,
    VideoMessage,
    VoiceMessage,
    SystemTextMessage,
    FileMessage,
    InviteMessage,
    RevokeMessage,
    VisitCardMessage,
    ReplyMessage,
    VoteMessage,
    LoginMessage,
    LocationMessage
} from '@/components/chat/messaege';

const app = createApp(App);
registerDirectives(app);
// app.component(AudioMessage.name, AudioMessage);
// app.component(CodeMessage.name, CodeMessage);
// app.component(ForwardMessage.name, ForwardMessage);
// app.component(ImageMessage.name, ImageMessage);
// app.component(TextMessage.name, TextMessage);
// app.component(VideoMessage.name, VideoMessage);
// app.component(VoiceMessage.name, VoiceMessage);
// app.component(SystemTextMessage.name, SystemTextMessage);
// app.component(FileMessage.name, FileMessage);
// app.component(InviteMessage.name, InviteMessage);
// app.component(RevokeMessage.name, RevokeMessage);
// app.component(VisitCardMessage.name, VisitCardMessage);
// app.component(ReplyMessage.name, ReplyMessage);
// app.component(VoteMessage.name, VoteMessage);
// app.component(LoginMessage.name, LoginMessage);
// app.component(LocationMessage.name, LocationMessage);

app.use(myPlugin);
app.component('Vue3Menus', Vue3Menus); // 只注册组件
app.directive('menus', directive); // 只注册指令
// app.config.globalProperties.$menusEvent = menusEvent; // 只绑定方法

app.use(router).use(store).mount('#app');
