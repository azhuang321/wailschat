import { ClickOutside } from 'element-plus';
import userDefaultAvatar from '@/assets/image/detault-avatar.jpg';

const directives = {
    // 自定义聚焦指令
    focus: {
        mounted(el) {
            el.focus();
        }
    },
    // 自定义粘贴指令
    paste: {
        bind(el, binding, vnode) {
            el.addEventListener('paste', function (event) {
                // 这里直接监听元素的粘贴事件
                binding.value(event);
            });
        }
    },
    // 自定义拖拽指令
    drag: {
        bind(el, binding, vnode) {
            // 因为拖拽还包括拖动时的经过事件，离开事件，和进入事件，放下事件，
            // 浏览器对于拖拽的默认事件的处理是打开拖进来的资源，
            // 所以要先对这三个事件进行默认事件的禁止
            el.addEventListener('dragenter', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            el.addEventListener('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            el.addEventListener('dragleave', function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            el.addEventListener('drop', function (event) {
                // 这里阻止默认事件，并绑定事件的对象，用来在组件上返回事件对象
                event.stopPropagation();
                event.preventDefault();
                binding.value(event);
            });
        }
    },
    // 点击其他地方隐藏指令
    outside: ClickOutside,
    //懒加载图片
    lazyImg: {
        mounted(el, binding) {
            // el:img dom对象
            // binding.value  图片url地址
            // 使用 vueuse/core 提供的监听 api 对图片 dom 进行监听 正式进入视口才加载
            // img.src = url
            const { stop } = useIntersectionObserver(
                // 监听目标元素
                el,
                ([{ isIntersecting }], observerElement) => {
                    let defaultAvatar = userDefaultAvatar;
                    switch (binding.value.type) {
                        case 'user':
                            defaultAvatar = userDefaultAvatar;
                            break;
                    }
                    if (isIntersecting) {
                        // ◆图片加载失败显示默认图片
                        el.onerror = function () {
                            el.src = defaultAvatar;
                        };
                        // ◆这里显示传过来的图片数据
                        el.src = binding.value.src;
                        stop(); // 中止监听
                    }
                }
            );
        }
    }
};

const registerDirectives = app => {
    for (const directivesKey in directives) {
        app.directive(directivesKey, directives[directivesKey]);
    }
};

export default registerDirectives;
