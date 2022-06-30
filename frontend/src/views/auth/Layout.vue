<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="logo-name animated slideInLeft">
                    {{ $store.state.website_name }}
                    logo-name
                </div>
            </el-header>
            <el-main>
                <router-view/>
            </el-main>
            <el-footer>
                <div class="copyright" v-html="$store.state.copyright"></div>
            </el-footer>
        </el-container>

        <div class="fly-box">
            <div class="fly bg-fly-circle1"></div>
            <div class="fly bg-fly-circle2"></div>
            <div class="fly bg-fly-circle3"></div>
            <div class="fly bg-fly-circle4"></div>
        </div>
    </div>
</template>
<script>

</script>
<style lang="scss" scoped>

$bg-color: #f6f8fb;
$theme-color: #2196f3;
$lw-cl: #b1a0a0;


.common-layout{
    background-color: $bg-color;
    width: 100%;
    height: 100%;

    .el-container{
        width: 100%;
        height: 100%;

        .el-header{
            flex: 1;
            .logo-name{
                font-size: .34rem;
                font-family: Times New Roman, Georgia, Serif, serif;
                color: $theme-color;
                margin-left: .2rem;
                margin-top: .2rem;
            }
        }
        .el-main {
            flex: 8;
            width: 100%;
            height: 100%;
            padding: 0;
            background-color: $bg-color;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .el-footer{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            .copyright{
                color: $lw-cl;
            }
        }
    }
}

@media screen and (max-height: 500px) {
    .el-header,.copyright,.el-footer{
        display: none !important;

    }
}


.fly-box {
    .fly {
        pointer-events: none;
        position: fixed;
        z-index: 100;
    }

    .bg-fly-circle1 {
        left: 40px;
        top: 100px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: linear-gradient(
                to right,
                rgba(100, 84, 239, 0.07) 0%,
                rgba(48, 33, 236, 0.04) 100%
        );
        animation: move 2.5s linear infinite;
    }

    .bg-fly-circle2 {
        left: 3%;
        top: 60%;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: linear-gradient(
                to right,
                rgba(100, 84, 239, 0.08) 0%,
                rgba(48, 33, 236, 0.04) 100%
        );
        animation: move 3s linear infinite;
    }

    .bg-fly-circle3 {
        right: 2%;
        top: 140px;
        width: 145px;
        height: 145px;
        border-radius: 50%;
        background: linear-gradient(
                to right,
                rgba(100, 84, 239, 0.1) 0%,
                rgba(48, 33, 236, 0.04) 100%
        );
        animation: move 2.5s linear infinite;
    }

    .bg-fly-circle4 {
        right: 5%;
        top: 60%;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: linear-gradient(
                to right,
                rgba(100, 84, 239, 0.02) 0%,
                rgba(48, 33, 236, 0.04) 100%
        );
        animation: move 3.5s linear infinite;
    }
}

@keyframes move {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(25px);
    }

    100% {
        transform: translateY(0px);
    }
}
</style>
