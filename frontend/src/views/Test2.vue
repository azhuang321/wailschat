<template>
    <div class="theme-page">
        <div class="menu">
            <el-menu default-active="1-1">
                <el-sub-menu index="1">
                    <template #title>
                        <span>Navigator One</span>
                    </template>
                    <el-menu-item-group title="Group One">
                        <el-menu-item index="1-1">item one</el-menu-item>
                        <el-menu-item index="1-2">item one</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Group Two">
                        <el-menu-item index="1-3">item three</el-menu-item>
                    </el-menu-item-group>
                    <el-sub-menu index="1-4">
                        <template #title>item four</template>
                        <el-menu-item index="1-4-1">item one</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                    <span>Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                    <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <span>Navigator Four</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="content">
            <div class="fix-color-pick">
                <el-space>
                    <el-button size="mini" type="primary" @click="resetTheme">重置</el-button>
                    <el-color-picker v-model="color" @change="changeTheme"></el-color-picker>
                </el-space>
            </div>
            <el-divider>基本组件</el-divider>
            <el-space wrap>
                <el-card>
                    <el-space class="flex center">
                        <el-button type="primary" @click="handleNprogress(true)">开始nprogress</el-button>
                        <el-button type="info" @click="handleNprogress(false)">结束nprogress</el-button>
                    </el-space>
                </el-card>
                <el-card>
                    <div v-loading="true" style="width: 100px"></div>
                </el-card>
                <el-card>
                    <el-space>
                        <el-link>default</el-link>
                        <el-link type="primary">primary</el-link>
                        <el-link type="success">success</el-link>
                        <el-link type="warning">warning</el-link>
                        <el-link type="danger">danger</el-link>
                        <el-link type="info">info</el-link>
                    </el-space>
                </el-card>
                <el-card>
                    <el-dropdown>
                        <span>下拉菜单</span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item>显卡</el-dropdown-item>
                                <el-dropdown-item>什么</el-dropdown-item>
                                <el-dropdown-item>时候</el-dropdown-item>
                                <el-dropdown-item disabled>降价</el-dropdown-item>
                                <el-dropdown-item divided>明年</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-card>
                <el-card>
                    <el-space>
                        <el-input type="text" placeholder="请输入内容" v-model="input" style="width: 200px" />
                    </el-space>
                </el-card>
                <el-card>
                    <el-space>
                        <el-button>按钮</el-button>
                        <el-button type="primary">按钮</el-button>
                        <el-button type="success">按钮</el-button>
                        <el-button type="warning">按钮</el-button>
                        <el-button type="info">按钮</el-button>
                        <el-button type="danger">按钮</el-button>
                    </el-space>
                </el-card>
                <el-card>
                    <el-space>
                        <el-tag>标签</el-tag>
                        <el-tag type="success">标签</el-tag>
                        <el-tag type="warning">标签</el-tag>
                        <el-tag type="info">标签</el-tag>
                        <el-tag type="danger">标签</el-tag>
                    </el-space>
                </el-card>

                <el-card>
                    <el-select v-model="select">
                        <el-option label="选项一" value="1"></el-option>
                        <el-option label="选项二" value="2"></el-option>
                    </el-select>
                </el-card>
                <el-card>
                    <el-radio v-model="radio" label="1">单选框1</el-radio>
                    <el-radio v-model="radio" label="2">单选框2</el-radio>
                    <el-checkbox v-model="checked" label="多选框"></el-checkbox>
                </el-card>
                <el-card>
                    <el-date-picker v-model="date" type="date" placeholder="选择日期"> </el-date-picker>
                </el-card>
                <el-card>
                    <el-pagination
                        v-model:currentPage="currentPage"
                        :page-sizes="[100, 200, 300, 400]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400"
                        @size-change="fakeMethod"
                        @current-change="fakeMethod"
                    />
                </el-card>
                <el-card>
                    <el-switch v-model="switchValue"></el-switch>
                </el-card>
                <el-card>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="User" name="first">User</el-tab-pane>
                        <el-tab-pane label="Config" name="second">Config</el-tab-pane>
                        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-space>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { mix } from '@/utils/color';
import nProgress from 'nprogress';

export default {
    setup () {
        // 变量前缀
        const pre = '--el-color-primary';
        // 白色混合色
        const mixWhite = '#ffffff';
        // 黑色混合色
        const mixBlack = '#000000';
        // 默认主题
        const defaultTheme = '#409eff';

        const node = document.documentElement;

        const state = reactive({
            color: localStorage.getItem('primaryColor') || defaultTheme,
            input: '',
            select: '1',
            radio: '1',
            date: '',
            activeName: 'first',
            currentPage: 1,
            switchValue: true,
            checked: true
        });

        const method = {
            /**
             * @description: 更改主题
             * @param {String} color 颜色
             */
            changeTheme: (color = state.color) => {
                console.log(color);
                node.style.setProperty(pre, color);
                localStorage.setItem('primaryColor', color);
                // 这里是覆盖原有颜色的核心代码
                for (let i = 1; i < 10; i += 1) {
                    node.style.setProperty(`${pre}-light-${i}`, mix(color, mixWhite, i * 0.1));
                }
                node.style.setProperty('--el-color-primary-dark', mix(color, mixBlack, 0.1));
                // 本地缓存style，样式持久化，你也可以存在后端
                localStorage.setItem('style', node.style.cssText);
            },
            /**
             * @description: 重置主题
             */
            resetTheme: () => {
                localStorage.removeItem('style');
                localStorage.removeItem('primaryColor');
                node.style.cssText = '';
                state.color = defaultTheme;
            },
            /**
             * @description: 处理nprogress
             * @param {Boolean} flag
             */
            handleNprogress: (flag) => (flag ? nProgress.start() : nProgress.done()),
            fakeMethod: () => {}
        };

        return {
            ...toRefs(state),
            ...method
        };
    }
};
</script>

<style lang="scss">
.theme-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    & .menu {
        width: 200px;
        height: 100%;
        .el-menu {
            height: 100%;
        }
    }
    & .content {
        padding: 10px;
        flex: 1;
        overflow: hidden auto;
        .fix-color-pick {
            position: fixed;
            bottom: 5px;
            right: 20px;
            z-index: 10;
        }
    }
}
</style>
