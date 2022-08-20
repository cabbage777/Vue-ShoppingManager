<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/datou.jpg" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
            
        <!-- 页面主体区 -->
        <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
            <div class="toggle-button" @click='toggleCollapse'>
                |||
            </div>
            <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF"
                :unique-opened='true'
                :collapse='isCollapse'
                :collapse-transition='false'
                :router="true"
                :default-active="activePath"
                >
                <!-- 一级菜单 -->
                <!-- item.id是数字，index只能识别字符串，所以+'' -->
                <el-submenu 
                :index="item.id+''" 
                v-for="item in menulist" 
                :key='item.id'>
                    <!-- 一级菜单的模板区 -->
                    <template slot="title" >
                        <!-- 图标 -->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item 
                    :index="'/'+subitem.path" 
                    v-for="subitem in item.children" 
                    :key='subitem.id'
                    @click="saveNavState('/'+subitem.path)"
                    >
                        <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subitem.authName}}</span>
                    </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>

        </el-aside>
        <!-- 右侧主题区域 -->
        <el-main>
            <!-- 右侧组件存在在这 -->
            <router-view></router-view>
        </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单区域
            menulist:[],
            iconsObj:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            // 是否折叠
            isCollapse:false,
            // 被激活的链接地址
            activePath:''
        }
    },
    created(){
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取所有的菜单
       async getMenuList(){
       const{data:res}= await this.$http.get('menus')
       if(res.meta.status!==200) return this.$message.error(res.meta.msg)
       this.menulist = res.data
    },
    // 点击，切换菜单的折叠与展开
    toggleCollapse(){
        this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
    }
    }
    
}
</script>

<style scoped>
    .home-container{
        height: 100%;
    }
    img{
        width: 60px;
        height: 60px;
    }
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;    
              
    }
    .el-header div{
        display: flex;
            align-items: center;
    }
    .el-header span {
            margin-left: 15px;
            margin-bottom: 0;
    } 
    .el-aside{
        background-color: #333744;
    }
    .el-main{
        background-color: #eaedf1;
    }
    .el-menu{
        border: none;
    }
    .iconfont{
        margin-right: 10px;
    }
    .toggle-button{
        background-color: #4A5064;
        color: #fff;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.3em;
        cursor: pointer;
    }
</style>