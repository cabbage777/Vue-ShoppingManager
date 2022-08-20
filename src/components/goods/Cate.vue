<template>
    <div>
         <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog" >添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
           <tree-table 
           :data="cateList" 
           :columns="columns" 
           :selection-type="false"
           :expand-type="false" 
            show-index 
            index-text="#" 
            border 
            :show-row-hover="false"
            class="treetable">
            <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot-scope="scope" slot="order">
                     <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                     <el-tag type="success" v-if="scope.row.cat_level===1">二级</el-tag>
                     <el-tag type="warning" v-if="scope.row.cat_level===2">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type='primary' icon='el-icon-edit' size="mini" @click="showEditCate(scope.row)">编辑</el-button>
                    <el-button type='danger' icon='el-icon-delete' size="mini" @click="removeCate(scope.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
             <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-size="queryInfo.pagesize"
                     :page-sizes="[3,5,10,15]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close='addCateDialogClosed'
            >
            <!-- 添加分类的表单 -->
            <el-form 
            :model="addCateForm" 
            :rules="addCateFormRules" 
            ref="addCateFormRef" 
            label-width="100px">
                <el-form-item label="活动名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- 级联选择器 -->
                    <el-cascader  
                    :options="parentCateList" 
                    :props="{ expandTrigger: 'hover',checkStrictly:true,...cascaderProps }"
                    v-model="selectedKeys"
                    @change="parentCateChange"
                    clearable
                     >
                </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 点击编辑分类的对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editCateDialog"
            width="50%"
            >
            <el-form ref="editCateRef" :model="editCate" label-width="80px">
                <el-form-item label="分类名称">
                    <el-input v-model="editCate.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialog = false">取 消</el-button>
                <el-button type="primary" @click="editCateDialogInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类的数据列表
            cateList:[],
            // 总数据条数
            total:0,
            // 为table指定列的定义
            columns:[{
                label:'分类名称',
                prop:'cat_name'
                },
                {
                    label:'是否有效',
                    // 表示将当前列定义为模板列
                    type:'template',
                    // 当前这一列使用的模板名称
                    template:'isok'
                },
                {
                    label:'排序',
                    // 表示将当前列定义为模板列
                    type:'template',
                    // 当前这一列使用的模板名称
                    template:'order'
                },
                {
                    label:'操作',
                    // 表示将当前列定义为模板列
                    type:'template',
                    // 当前这一列使用的模板名称
                    template:'opt'
                }

            ],
            // 控制添加分类对话框的显示
            addCateDialogVisible:false,
            // 添加分类的表单数据对象
            addCateForm:{
                // 将要添加的分类的名称
                cat_name:'',
                // 将要添加的分类的id
                cat_pid:0,
                // 将要添加的分类的等级 0表示一级
                cat_level:0,
            },
            // 添加分类的规则
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    
                ]
            },
            // 父级分类列表
            parentCateList:[],
            // 指定级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 选中的父级分类的id数组
            selectedKeys:[],
            // 存放编辑获得数据
            editCate:'',
            // 编辑分类对话框的显示
            editCateDialog:false,
        }
    },
    created() {
        this.getCateList()
    },
    methods:{
        // 获取商品分类数据
        async getCateList(){
            const{data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200) return this.$message.error('获取商品数据失败')
            this.cateList=res.data.result
            this.total=res.data.total
        },
        // 监听pagesize改变
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize
            this.getCateList()
        } ,
        // 监听页码变化
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage
            this.getCateList()
        },
        // 点击添加按钮
        showAddCateDialog(){
            this.addCateDialogVisible=true
            // 调用获取父级分类列表的方法
            this.getParentCateList()
        },
         // 选择项发生变化触发
        parentCateChange() {
            // console.log(this.selectedKeys)
            // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
            // 反之，就说明没有选中任何父级分类
            if (this.selectedKeys.length > 0) {
                // 父级分类的Id
                this.addCateForm.cat_pid = this.selectedKeys[
                this.selectedKeys.length - 1
                ]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                // 父级分类的Id
                this.addCateForm.cat_pid = 0
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: { type: 2 }
            })

            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败！')
            }

            // console.log(res.data)
            this.parentCateList = res.data
        },
        // 点击确定按钮
        addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return
                const{data:res} = await this.$http.post('categories',this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加成功')
                this.getCateList()
                this.addCateDialogVisible=false
            })
        },
        // 关闭对话框重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys=[]
            this.addCateForm.cat_level=0
            this.addCateForm.cat_pid=0
        },
        // 点击编辑按钮
        async showEditCate(id){
            // console.log(id.cat_id);
            const{data:res} = await this.$http.get('categories/'+id.cat_id)
            if(res.meta.status!==200) return this.$message.error('查询分类失败')
            this.editCate = res.data
            // console.log(this.editCate);

            this.editCateDialog=true
        },
        // 点击编辑分类的确定按钮
        editCateDialogInfo(){
            this.$refs.editCateRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.put('categories/'+this.editCate.cat_id,
                {cat_name:this.editCate.cat_name}
                )
                if(res.meta.status!==200){
                return this.$message.error('跟新分类失败')
            }
                // 关闭对话框
                this.editCateDialog=false
                // 刷新数据列表
                this.getCateList()
                // 提示修改成功
                return this.$message.success('跟新分类成功') 
        })
        },
        // 点击删除按钮
        async removeCate(id){
            // 弹窗询问分类是否确定删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch(error=>error)
            // 如果分类确定删除，则返回值为confirm
            // 如果分类取消删除，则返回值为cancel
            if(confirmResult!=='confirm'){
                return this.$message.info('已经取消删除')
            }
            const{data:res} = await this.$http.delete('categories/'+id.cat_id)
            if(res.meta.status!==200){
                return this.$message.error('删除分类失败')
            }
               
                this.$message.success('删除分类成功')
                this.getCateList()
        }

    }
   
}
</script>

<style scoped>
    .treetable{
        margin-top: 15px;
    }
    .el-cascader {
        width: 100%;
    }
    
</style>