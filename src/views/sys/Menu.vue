<template>
    <div>
        <el-form>
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
        </el-form>

      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        stripe
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column prop="name" label="名称" width="180" />

        <el-table-column prop="perms" label="权限编码" width="180" />

        <el-table-column prop="icon" label="图标"/>

        <el-table-column prop="type" label="类型">
            <template #default="scope">
                <el-tag v-if="scope.row.type === 0">目录</el-tag>
                <el-tag v-else-if="scope.row.type === 1" type="success">菜单</el-tag>
                <el-tag v-else type="info">按钮</el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="path" label="菜单URL"/>

        <el-table-column prop="component" label="菜单组件"/>

        <el-table-column prop="orderNum" label="排序号"/>

        <el-table-column prop="status" label="状态">
            <template #default="scope">
                <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
                <el-tag v-else type="danger">禁用</el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="action" label="操作">
            <template #default="scope">
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
    
      <el-dialog
        v-model="dialogVisible"
        title="菜单信息"
        width="600px"
        :before-close="handleClose"
    >

        <el-form :model="editForm" :rules="rules" ref="ruleFormRef" label-width="100px">
            <el-form-item label="上级菜单" prop="parentId">
                <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
                    <template v-for="item in tableData">
                        <el-option :label="item.name" :value="item.id"></el-option>
                        <template v-for="child in item.children">
                            <el-option :label="child.name" :value="child.id">
                                {{ "- " + child.name }}
                            </el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item label="菜单名称" prop="name" label-width="100px">
                <el-input v-model="editForm.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="权限编码" prop="perms" label-width="100px">
                <el-input v-model="editForm.perms" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="图标" prop="icon" label-width="100px">
                <el-input v-model="editForm.icon" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="菜单URL" prop="path" label-width="100px">
                <el-input v-model="editForm.path" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="菜单组件" prop="component" label-width="100px">
                <el-input v-model="editForm.component" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="类型" prop="type" label-width="100px">
                <el-radio-group v-model="editForm.type">
                    <el-radio :label=0>目录</el-radio>
                    <el-radio :label=1>菜单</el-radio>
                    <el-radio :label=2>按钮</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="状态" prop="status" label-width="100px">
                <el-radio-group v-model="editForm.status">
                    <el-radio :label=0>禁用</el-radio>
                    <el-radio :label=1>正常</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="排序号" prop="orderNum" label-width="100px">
                <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">立即创建</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    </div>
</template>

    <script setup>
        import axios from 'axios';
        import { ref, reactive } from 'vue'
        import { ElMessage } from 'element-plus'
        let tableData = ref([])
        let dialogVisible = ref(false)
        let ruleFormRef = ref(null)
        let editForm = ref({})
        let rules = ref({
            parentId: [
                {required: true, message: '请选择上级菜单', trigger: 'blur'}
            ],
            name: [
                {required: true, message: '请输入名称', trigger: 'blur'}
            ],
            perms: [
                {required: true, message: '请输入权限编码', trigger: 'blur'}
            ],
            type: [
                {required: true, message: '请选择状态', trigger: 'blur'}
            ],
            orderNum: [
                {required: true, message: '请填入排序号', trigger: 'blur'}
            ],
            status: [
                {required: true, message: '请选择状态', trigger: 'blur'}
            ]
        })

        function getMenuTree() {
            axios.get('/sys/menu/list').then(res => {
                tableData.value = res.data.data
            })
        }

        function submitForm(form) {
            if (!form) return
            form.validate((valid, fields) => {
                if (valid) {
                    axios.post('/sys/menu/' + (editForm.id ? 'update' : 'save'), editForm).then(res => {
                        ElMessage.success("提交成功")
                        getMenuTree()
                        resetForm(form)
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
            ruleFormRef.value.clearValidate()
            editForm.value = {}
        }

        function handleEdit(id) {
            axios.get('/sys/menu/info' + id).then(res => {
                editForm.value = res.data.data
                dialogVisible.value = true
            })
        }

        function handleClose(done) {
            resetForm()
            done()
        }

        function handleDelete(id) {
            axios.post('/sys/menu/delete/' + id).then(res => {
                ElMessage.success("删除成功")
                getMenuTree()
            }).catch(err => {
                ElMessage.error("删除失败")
            })
        }

        getMenuTree()

    </script>