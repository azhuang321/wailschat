import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store';
import 'normalize.css';
import '@/assets/css/base.scss';

import '@/style/index.scss';

import '@/assets/css/global.scss';

// import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';

import registerDirectives from './core/directives';// 自定义指令

// import './core/global-component'; // 全局插件

import { myPlugin } from '@/components/user/user-card';

const app = createApp(App);
registerDirectives(app);

app.use(myPlugin);
// app.use(ElementPlus);


app.use(router)
    .use(store)
    .mount('#app');
