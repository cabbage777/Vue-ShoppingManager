<template>
    <div>
    <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-table :data='rightsList' border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级" prop="level">
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.level==='0'">一级权限</el-tag>
                        <el-tag v-if="scope.row.level==='1'" type="success">二级权限</el-tag>
                        <el-tag v-if="scope.row.level==='2'" type="warning">三级权限</el-tag>

                     </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //权限列表
            rightsList:[]
        } 
        },
        created() {
            // 获取所有的权限
            this.getRighsList()
    },
    methods: {
        async getRighsList(){
           const{data:res} =  await this.$http.get('rights/list')
           if(res.meta.status!==200)return this.$message.error('获取权限失败')
           this.rightsList=res.data
        //    console.log(this.rightsList);
        }
    },
}
</script>

<style scoped>
  /deep/  .el-breadcrumb__inner
      {
        color: #FFFFFF !important;	
        font-weight:600 ;
    }
   /deep/ .el-breadcrumb__inner.is-link{
       font-size: 20px;
        font-weight:1100 ;
   }
</style>