import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import externalGlobals from 'rollup-plugin-external-globals';
import IconsResolver from 'unplugin-icons/resolver';

import { AutoGenerateImports } from 'vite-auto-import-resolvers';

import viteCompression from 'vite-plugin-compression';
import ElementPlus from 'unplugin-element-plus/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import Icons from 'unplugin-icons/vite';

import eslintPlugin from 'vite-plugin-eslint'; // 导入包

import legacyPlugin from '@vitejs/plugin-legacy';

import { createStyleImportPlugin } from 'vite-plugin-style-import';

import fullImportPlugin from './build/plugins/fullImportPlugin';

const pathSrc = path.resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    console.log(mode);
    return {
        base: '/',
        resolve: {
            alias: [
                { find: '@', replacement: pathSrc }
            ]
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
            mode === 'development'
                ? fullImportPlugin()
                : Components({
                    resolvers: [ElementPlusResolver({ importStyle: 'sass', useSource: true })],
                    dts: path.resolve(pathSrc, 'components.d.ts')
                }),,
            // 增加下面的配置项,这样在运行时就能检查eslint规范
            // eslintPlugin({
            //     include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
            // }),
            ElementPlus({
                useSource: true
            }),
            // viteCompression({
            //     verbose: true,
            //     disable: false,
            //     threshold: 10240,
            //     algorithm: 'gzip',
            //     ext: '.gz'
            // }),
            // todo vite 3.0.0-beta5 按需加载有问题 2.9.9正常
            AutoImport({
                imports: AutoGenerateImports(), // 自动管理，只有对应的包有装时才会自动按需设置预设
                resolvers: [
                    ElementPlusResolver(),
                    // Auto import icon components
                    // 自动导入图标组件
                    IconsResolver({
                        prefix: 'Icon'
                    })
                ],
                dts: path.resolve(pathSrc, 'auto-imports.d.ts')
            }),

            Components({
                resolvers: [
                    // Auto register icon components
                    // 自动注册图标组件
                    IconsResolver({
                        enabledCollections: ['ep']
                    }),
                    // Auto register Element Plus components
                    // 自动导入 Element Plus 组件
                    ElementPlusResolver({ importStyle: 'sass', useSource: true })
                ],

                dts: path.resolve(pathSrc, 'components.d.ts')
            }),

            Icons({
                autoInstall: true
            }),

            topLevelAwait({
                // The export name of top-level await promise for each chunk module
                promiseExportName: '__tla',
                // The function to generate import names of top-level await promise in each chunk module
                promiseImportName: i => `__tla_${i}`
            }),
            createStyleImportPlugin({
                libs: [
                    {
                        libraryName: 'element-plus',
                        esModule: true,
                        ensureStyleFile: true,
                        resolveStyle: name => {
                            return `element-plus/theme-chalk/${name}.css`;
                        }
                    }
                ]
            })
            // legacyPlugin({
            //     targets: [
            //         'Android > 39',
            //         'Chrome >= 60',
            //         'Safari >= 10.1',
            //         'iOS >= 10.3',
            //         'Firefox >= 54',
            //         'Edge >= 15'
            //     ]
            // })
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
                    manualChunks (id) {
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
