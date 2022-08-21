<template>
    <div>
    <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

         <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区  -->
            <el-table :data='rolelist' border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row  :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key='item1.id'>
                            <!-- 渲染一级权限 -->
                            <el-col :span='5'>
                                <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级权限和三级权限 -->
                            <el-col :span='19'>
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="[i2===0?'':'bdtop','vcenter']" 
                                v-for="(item2,i2) in item1.children"
                                 :key='item2.id'>
                                    <el-col :span='6'>
                                        <el-tag type="success" closable @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span='18'>
                                        <el-tag v-for="(item3) in item2.children" 
                                        :key='item3.id'
                                         type="warning" 
                                         closable
                                          @close='removeRightById(scope.row,item3.id)'>
                                        {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size='mini' type="primary" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
                        <el-button size='mini' type="danger" icon="el-icon-delete" @click='removeRolesByid(scope.row.id)'>删除</el-button>
                        <el-button size='mini' type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
                
            </el-table>
        </el-card> 
        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync='addRolesVisible'
            width="50%"
            @close='addRolesClosed'
            >
            <!-- 内容主体区 -->
            <el-form :model="addRolesList" :rules="addRolesRules" ref="addRolesRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRolesList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户的对话框 -->
         <el-dialog
            title="修改角色"
            :visible.sync='aditRolesVisible'
            width="50%"
            @close='editRolesClosed'
            >
            <!-- 内容主体区 -->
            <el-form :model="editRoles" :rules="editRolesRules" ref="editRolesRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoles.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="aditRolesVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close='setRightDialogClosed'
            >
            <!-- 树形控件 -->
            <el-tree :data="rightslist" 
            :props="treeProps" 
            show-checkbox 
            node-key='id'
            default-expand-all
            :default-checked-keys='defKeys'
            ref='treeRef'
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            rolelist:[],
            // 添加用户对话框的显示
            addRolesVisible:false,
            // 修改角色信息对话框的显示
            aditRolesVisible:false,
            // 存放修改角色信息数据
            editRoles:'',
            // 存放权限数据
            rightslist:'',
            // 树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 添加角色信息数据
            addRolesList:{
                roleName:'',
                roleDesc:''
            },
            // 控制分配权限对话框的显示
            setRightDialogVisible:false,
            // 添加角色规则
            addRolesRules:{
                roleName:[
                    {required:true,message:'请输入角色名',trigger:'blur'},
                    {min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger:'blur'}
                ],
                roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'},
                    {min:3,message:'描述内容至少三个字符长度',trigger:'blur'}
                ]
            },
            // 修改角色规则
            editRolesRules:{
                roleName:[
                    {required:true,message:'请输入角色名',trigger:'blur'},
                    {min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger:'blur'}
                                      
                ],
                roleDesc:[
                    {required:true,message:'请输入角色描述',trigger:'blur'},
                     {min:3,message:'描述内容至少三个字符长度',trigger:'blur'}

                ]
            },
            // 默认选中的节点id值的数组
            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:''
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取所有角色的列表
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200) return this.$$message.error('获取角色列表失败');
            this.rolelist=res.data
            // console.log(res);
        },
        // 退出添加用户后，对话框内容清空
        addRolesClosed(){
            this.$refs.addRolesRef.resetFields()
        },
        // 退出编辑用户后，对话框内容清空
        editRolesClosed(){
            this.$refs.editRolesRef.resetFields()
        },
        // 点击按钮添加新角色
        addUsers(){
            this.$refs.addRolesRef.validate(async valid=>{
                if(!valid)return
                // 可以发起添加用户的网络请求
                const {data:res} =await this.$http.post('roles',this.addRolesList)
                if(res.meta.status!==201){
                    return this.$message.error('添加用户失败')
                }
                    this.$message.success('添加用户成功')
                    // 隐藏添加列表
                    this.addRolesVisible=false
                    // 重新获取用户列表
                    this.getRolesList()

            })
        },
        // 点击编辑按钮后查询到该角色id和弹出对话框
        async showEditRoles(id){
            console.log(id);
            const {data:res} = await this.$http.get('roles/'+id)
            if(res.meta.status!==200) return this.$message.error('查询用户失败')
            this.editRoles = res.data
            this.aditRolesVisible=true
            console.log(this.editRoles);
            
        },
        // 编辑角色信息
        editRolesInfo(){
            this.$refs.editRolesRef.validate(async valid=>{
                if(!valid) return
                // 发起修改用户信息的数据请求
                const {data:res}=await this.$http.put('roles/'+this.editRoles.roleId,
                {roleName:this.editRoles.roleName,
                roleDesc:this.editRoles.roleDesc}
                )
                if(res.meta.status!==200){
                return this.$message.error('跟新角色失败')
            }
                // 关闭对话框
                this.aditRolesVisible=false
                // 刷新数据列表
                this.getRolesList()
                // 提示修改成功
                return this.$message.success('跟新角色成功')         
            })      
        },
        // 点击按钮删除角色信息
        async removeRolesByid(id){
            // 弹窗询问用户是否确定删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(error=>error)
            // 如果用户确定删除，则返回值为confirm
            // 如果用户取消删除，则返回值为cancel
            if(confirmResult!=='confirm'){
                return this.$message.info('已经取消删除')
            }
            const{data:res} = await this.$http.delete('roles/'+id)
            if(res.meta.status!==200){
                return this.$message.error('删除用户失败')
            }
               
                this.$message.success('删除用户成功')
                this.getRolesList()

        }  ,
        // 根据id删除对应的权限
        async removeRightById(role,rightId){
            // 弹窗提示是否确定删除
            const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm') return this.$message.info('取消了删除')
            const{data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status!==200) return this.$message.error('删除权限失败')
            role.children = res.data 
        },  
        // 展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId=role.id
            // 获取所有权限的数据
            const{data:res} = await this.$http.get('rights/tree')
            if(res.meta.status!==200) return this.$message.error('获取权限数据失败')
            // 把获取到的权限复制到data中
            this.rightslist = res.data
            console.log(this.rightslist);
            // 获取三级节点id
            this.getLeafKeys(role,this.defKeys)

            this.setRightDialogVisible=true      
        } ,
        // 通过递归的形式获取角色已有的三级权限id
        getLeafKeys(node,arr){
            // 如果当前node节点不包括children属性则是三级节点
            if(!node.children) return arr.push(node.id)
            node.children.forEach(item=>this.getLeafKeys(item,arr))
        },
        // 监听权限分配对话框的关闭事件,如果不清空，上一次点击的角色有的权限数据不变
        setRightDialogClosed(){
            this.defKeys=[]
        } ,
        // 点击为角色分配权限
        async allotRights(){
            const keys =[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const idStr = keys.join(',')
            const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idStr })
            if(res.meta.status!==200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisible=false
        }
    },
}
</script>

<style scoped>
    .el-tag{
        margin:7px
    }
    .bdtop{
        border-top:1px solid #eee;
    }
    .bdbottom{
        border-top:1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
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