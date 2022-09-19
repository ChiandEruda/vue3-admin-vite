<template>
    <div>
        <el-form :inline="true" :model="userForm">
            <el-form-item>
                <el-input clearable v-model="searchForm.username" placeholder="用户名" />
            </el-form-item>

            <el-form-item>
                <el-button @click="getUserList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>

            <el-form-item>
                <el-popconfirm
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    title="确认要批量删除吗？"
                    @confirm="handleDelete(null)"
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

            <el-table-column prop="avatar" label="头像" width="50">
                <template #default="scope">
                    <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>

            <el-table-column property="username" label="用户名" width="120" />

            <el-table-column prop="status" label="角色名称">
                <template #default="scope">
                    <el-tag size="small" type="info" v-for="item in scope.row.roles" :key="item.id">{{item.name}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column property="email" label="邮箱"/>

            <el-table-column property="phone" label="手机号"/>

            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
                    <el-tag v-else type="danger">禁用</el-tag>
                </template>
            </el-table-column>

			<el-table-column prop="created" width="200" label="创建时间"></el-table-column>            

            <el-table-column prop="action" label="操作">
                <template #default="scope">
                    <el-button link type="primary" @click="handleRole(scope.row.id)">分配权限</el-button>
                    <el-divider direction="vertical"></el-divider>

					<el-button type="text" @click="handleRepass(scope.row.id, scope.row.username)">重置密码</el-button>
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
        title="用户信息编辑"
        width="600px"
        :before-close="handleClose"
        >

            <el-form :model="userForm" :rules="rules" ref="userFormRef">
				<el-form-item label="用户名" prop="username" label-width="100px">
					<el-input v-model="userForm.username" autocomplete="off"></el-input>
					<el-alert
							title="初始密码为888888"
							:closable="false"
							type="info"
							style="line-height: 12px;"
					></el-alert>
				</el-form-item>

				<el-form-item label="邮箱"  prop="email" label-width="100px">
					<el-input v-model="userForm.email" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="手机号"  prop="phone" label-width="100px">
					<el-input v-model="userForm.phone" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="状态"  prop="status" label-width="100px">
					<el-radio-group v-model="userForm.status">
						<el-radio :label="0">禁用</el-radio>
						<el-radio :label="1">正常</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

            <div>
				<el-button @click="resetForm()">重 置</el-button>
				<el-button type="primary" @click="submitForm(userFormRef)">确 定</el-button>
			</div>
        </el-dialog>      

        <el-dialog
        v-model="roleDialogFormVisible"
        title="分配权限"
        width="600px"
        >
            <el-tree
                :props="props"
                :data="roleTreeData"
                show-checkbox
                node-key="id"
                default-expand-all="true"
                check-strictly="true"
                ref="roleTreeRef"
                @check-change="handleCheckChange"
            />

            <template #footer>
                <span>
                    <el-button @click="roleDialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleRoleSubmit"
                    >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>        
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { ElMessage, ElMessageBox  } from 'element-plus';
    import axios from '@/plugins/axios'
    
    let delStatus = ref(true)
    let searchForm = reactive({})
    let userForm = ref({})
    let userFormRef = ref()
    let tableRef = ref()
    let roleTreeRef = ref()
    let tableData = ref([])
    let size = ref(10)
    let currentPage = ref(1)
    let total = ref(0)
    let dialogVisible = ref(false)
    let roleDialogFormVisible = ref(false)
    let roleTreeData = ref([])
    let multipleSelection = ref([])
    let count = ref(1)
    let userId = ref()
    let props = ref({
        label: 'name',
        children: 'children',        
    })
    let rules = ref({
        username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        status: [
            {required: true, message: '请选择状态', trigger: 'blur'}
        ]      
    })

    function getUserList() {
        // console.log(searchForm.username)
        axios.get('/sys/user/list', {
            params: {
                name: searchForm.username,
                size: size.value,
                current: currentPage.value
            }
        }).then(res => {
            tableData.value = res.data.data.records
            console.log(res.data)
            size.value = res.data.data.size
            total.value = res.data.data.total
            currentPage.value = res.data.data.current
        })
    }

    function getRoleList() {
        axios.get('/sys/role/list').then(res => {
            roleTreeData.value = res.data.data.records
        })
    }

    function handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        size.value = val
        getUserList()
    }

    function handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        currentPage.value = val
        getUserList()
    }

    function handleSelectionChange(val) {
        // console.log(val);
        delStatus.value = val.length === 0 ? true : false
        multipleSelection.value = val
    }

    function handleRepass(id, username) {

        ElMessageBox.confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            axios.post("/sys/user/repass", id).then(res => {
                ElMessage.success({
                    message: '操作成功!'
                });
            })
        })
    }

    function submitForm(form) {
        if (!form) return
        form.validate((valid, fields) => {
            if (valid) {
                axios.post('/sys/role/' + (userForm.id ? 'update' : 'save'), userForm).then(res => {
                    ElMessage.success("提交成功")
                    getUserList()
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
        userFormRef.value.clearValidate()
        userForm.value = {}
    }   

    function handleEdit(id) {
        axios.get('/sys/user/info' + id).then(res => {
            userForm.value = res.data.data
            console.log(res.data.data)
            dialogVisible.value = true
        })
    }

    function handleClose(done) {
        resetForm()
        done()
    }

    function handleDelete(id) {
        let ids = []

        if(id) {
            ids.push(id)
        } else {
            multipleSelection.value.forEach(row => {
                ids.push(row.id)
            })
        }

        console.log(ids)

        axios.post('/sys/user/delete/', ids).then(res => {
            ElMessage.success("删除成功")
            getUserList()
        }).catch(err => {
            ElMessage.error("删除失败")
        })
    }    

    function handleRole(id){
        roleDialogFormVisible.value = true

        axios.get('/sys/user/info' + id).then(res => {
            userForm.value = res.data.data

            let roleIds = []
            res.data.data.roles.forEach(row => {
                roleIds.push(row.id)
            })            
            roleTreeRef.value.setCheckedKeys(roleIds)
            userId.value = res.data.data.id
        })
    }

    function handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
    }

    function handleRoleSubmit() {
        let menuIds = roleTreeRef.value.getCheckedKeys()
        console.log(menuIds)
        axios.post('/sys/role/perm/' + userId.value, menuIds).then(res => {
            ElMessage.success("提交成功")
        })
        roleDialogFormVisible.value = false
    }

    getUserList()
    getRoleList()
</script>

<style scoped>
    .el-pagination{
        float: right;
        margin-top: 15px;
    }
</style>