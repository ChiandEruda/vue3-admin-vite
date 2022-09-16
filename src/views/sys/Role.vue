<template>
    <div>
        <el-form :inline="true" :model="roleForm">
            <el-form-item>
                <el-input clearable v-model="searchForm.name" placeholder="名称" />
            </el-form-item>

            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>

            <el-form-item>
                <el-popconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="确认要批量删除吗？"
                    @comfirm=""
                >
                    <template #reference>
                        <el-button type="danger" :disabled="delStatus">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </el-form-item>
        </el-form>

        <el-table
            ref="tableRef"
            :data="tableData"
            style="width: 100%"
            border
            stripe
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />

            <el-table-column property="name" label="名称" width="120" />

            <el-table-column property="code" label="唯一编码"/>

            <el-table-column property="remark" label="描述"/>

            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
                    <el-tag v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="action" label="操作">
                <template #default="scope">
                    <el-button link type="primary" @click="handleEdit(scope.row.id)">分配权限</el-button>

                    <el-divider direction="vertical"></el-divider>

                    <el-button link type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>

                    <el-divider direction="vertical"></el-divider>
                    
                    <el-popconfirm title="确定删除吗" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button link type="primary">删除</el-button>
                        </template>
                    </el-popconfirm>
                    
                </template>
            </el-table-column>
        </el-table>        

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>        

        <el-dialog
        v-model="dialogVisible"
        title="提示"
        width="600px"
        :before-close="handleClose"
        >

            <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">

                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="roleForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="roleForm.code" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="roleForm.remark" autocomplete="off"></el-input>
                </el-form-item>


                <el-form-item label="状态" prop="status" label-width="100px">
                    <el-radio-group v-model="roleForm.status">
                        <el-radio :label=0>禁用</el-radio>
                        <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm(roleFormRef)">立即创建</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>        
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { ElMessage } from 'element-plus';
    import axios from '@/plugins/axios'
    
    let delStatus = ref(true)
    let searchForm = reactive({})
    let roleForm = ref({})
    let roleFormRef = ref()
    let tableRef = ref()
    let tableData = ref([])
    let size = ref(10)
    let currentPage = ref(1)
    let total = ref(0)
    let dialogVisible = ref(false)
    let rules = ref({
        name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        code: [
            {required: true, message: '请输入唯一编码', trigger: 'blur'}
        ],
        status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
        ]        
    })

    function getRoleList() {
        // console.log(searchForm.name)
        axios.get('/sys/role/list*', {
            params: {
                name: searchForm.name,
                size: size.value,
                current: currentPage.value
            }
        }).then(res => {
            tableData.value = res.data.data.records
            size.value = res.data.data.size
            total.value = res.data.data.total
            currentPage.value = res.data.data.current
        })
    }

    function handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
    }

    function handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
    }

    function handleSelectionChange() {
        
    }

    function submitForm(form) {
        if (!form) return
        form.validate((valid, fields) => {
            if (valid) {
                axios.post('/sys/role/' + (roleForm.id ? 'update' : 'save'), roleForm).then(res => {
                    ElMessage.success("提交成功")
                    getRoleList()
                    resetForm()
                    dialogVisible.value = false
                }).catch(err => {
                    ElMessage.error("提交失败")
                    console.log('error submit!!');
                })
            } else {
                ElMessage.error("验证失败")
                console.log('error submit!', fields)
            }
        })              
    }

    function resetForm() {
        // if (!ruleFormRef.value) return;
        // ruleFormRef.value.resetFields()
        roleFormRef.value.clearValidate()
        roleForm.value = {}
    }   

    function handleEdit(id) {
            axios.get('/sys/role/info' + id).then(res => {
                roleForm.value = res.data.data
                dialogVisible.value = true
            })
        }

    function handleClose(done) {
        resetForm()
        done()
    }

    function handleDelete(id) {
        axios.post('/sys/role/delete/' + id).then(res => {
            ElMessage.success("删除成功")
            getRoleList()
        }).catch(err => {
            ElMessage.error("删除失败")
        })
    }    



    getRoleList()
</script>

<style scoped>
    .el-pagination{
        float: right;
        margin-top: 15px;
    }
</style>