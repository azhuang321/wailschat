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

const app = createApp(App);
registerDirectives(app);

if (typeof ElementPlusIconsVue !== 'undefined' && import.meta.env.MODE === 'development') {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }
}

app.use(myPlugin);

app.use(router).use(store).mount('#app');
