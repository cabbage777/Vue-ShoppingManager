<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span='8'>
                     <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodsList'>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data='goodslist' border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="128px"></el-table-column>
                <el-table-column label="商品质量" prop="goods_weight" width="90px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time"  width="180px">
                    <template slot-scope="scope">
                        {{scope.row.add_time|dateFromat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editById(scope.row.goods_id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
             <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-size="queryInfo.pagesize"
                     :page-sizes="[7,12,15,20]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background>
                </el-pagination>
        </el-card>

        <!-- 编辑对话框 -->
        <el-dialog
            title="修改商品信息"
            :visible.sync="editdialogVisible"
            width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="商品名称">
                    <el-input v-model="editForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="editForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="editForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品质量">
                    <el-input v-model="editForm.goods_weight" type="number"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editGoods">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:7
            },
            // 商品列表
            goodslist:[],
            // 总数据条数
            total:0,
            // 编辑对话框的显示
            editdialogVisible:false,
            // 修改商品数据
            editForm:{},
            // 编辑商品的规则
            editFormRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品质量', trigger: 'blur' }
                ]
            }
            
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodsList(){
            const{data:res}= await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status!==200) return this.$message.error('获取商品列表失败')
            this.$message.success('获取商品列表成功')
            console.log(res.data);
            this.goodslist=res.data.goods
            this.total=res.data.total
        },
        handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize
            this.getGoodsList()
        },
        handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage
            this.getGoodsList()
        },
        async removeById(id){
            const confirmResult=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
                if(confirmResult!=='confirm')return this.$message('已经取消删除')
                const{data:res} = await this.$http.delete('goods/'+id)
                if(res.meta.status!==200) return this.$message.error('删除商品失败')
                    this.$message.success('删除商品成功')
                    this.getGoodsList()
        },
        // 跳转添加页面
        goAddpage(){
            this.$router.push('/goods/add')
        },
        // 编辑
        async editById(id){
            const{data:res} =await this.$http.get('goods/'+id)
            if(res.meta.status!==200) return this.$message.error('查询商品失败')
            this.editForm=res.data
            console.log(this.editForm);
            this.editdialogVisible=true
        },
        // 点击编辑的确定按钮
        editGoods(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.put(`goods/${this.editForm.goods_id}`,
                {goods_name:this.editForm.goods_name,goods_price:this.editForm.goods_price,
                    goods_number:this.editForm.goods_number,goods_weight:this.editForm.goods_weight,
                    goods_cat: this.editForm.goods_cat,}
                
                )
                if(res.meta.status!==200){
                return this.$message.error('编辑商品失败')
            }
                // 关闭对话框
                this.editdialogVisible=false
                // 刷新数据列表
                this.getGoodsList()
                // 提示修改成功
                return this.$message.success('修改商品成功') 
        })
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