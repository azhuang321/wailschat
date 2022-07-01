import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

import { AutoGenerateImports } from 'vite-auto-import-resolvers';

import viteCompression from 'vite-plugin-compression';
import ElementPlus from 'unplugin-element-plus/vite';
import topLevelAwait from 'vite-plugin-top-level-await';

import eslintPlugin from 'vite-plugin-eslint'; // 导入包

import legacyPlugin from '@vitejs/plugin-legacy';

import fullImportPlugin from './build/plugins/fullImportPlugin';

const pathSrc = path.resolve(__dirname, 'src');

const componentPlugin = mode => {
    if (mode === 'development') {
        return fullImportPlugin();
    }
    return Components({
        resolvers: [
            // 自动导入 Element Plus 组件
            ElementPlusResolver({ importStyle: 'sass' })
        ],
        dts: path.resolve(pathSrc, 'components.d.ts')
    });
};

const autoImportPlugin = mode => {
    // todo vite 3.0.0-beta5 按需加载有问题 2.9.9正常
    return AutoImport({
        imports: AutoGenerateImports(), // 自动管理，只有对应的包有装时才会自动按需设置预设
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(pathSrc, 'auto-imports.d.ts')
    });
};

const topLevelAwaitPlugin = () => {
    return topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
    });
};

const legacyCheckPlugin = () => {
    return legacyPlugin({
        // targets: [
        //     // 'Android > 50',
        //     'Chrome >= 88'
        //     // 'Safari >= 14',
        //     // 'iOS >= 13',
        //     // 'Firefox >= 79',
        //     // 'Edge >= 89'
        // ]
        targets: ['defaults', 'not IE 11']
    });
};

// 增加下面的配置项,这样在运行时就能检查eslint规范
const eslintCheckPlugin = () => {
    return eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
    });
};

const viteCompressionPlugin = () => {
    return viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
    });
};
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        base: '/',
        resolve: {
            alias: [{ find: '@', replacement: pathSrc }]
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "src/style/element.scss" as *;'
                }
            }
        },
        plugins: [
            vue(),
            componentPlugin(mode),
            autoImportPlugin(mode),
            ElementPlus({ useSource: true }),
            topLevelAwaitPlugin()
            // eslintCheckPlugin(),
            // viteCompressionPlugin(),
            // legacyCheckPlugin()
        ],
        build: {
            // target: ['esnext'],
            minify: 'terser',
            manifest: false, // 是否产出maifest.json
            sourcemap: false, // 是否产出soucemap.json
            terserOptions: {
                // compress: {
                //     drop_console: true,
                //     drop_debugger: true
                // }
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            }
        },
        // 开发服务器配置
        server: {
            host: false,
            open: false,
            port: 3000
            // proxy: {
            //     '/api': {
            //         target: '//www.xxxx.com',
            //         changeOrigin: true,
            //         ws: true,
            //         secure: true,
            //         rewrite: (path) => path.replace(/^\/api/, '')
            //     }
            // }
        }
    };
});
