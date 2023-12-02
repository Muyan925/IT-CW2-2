<template>
    <div class="plan-manage">
        <div class="title">
            <span class="name">User Management</span>
        </div>
        <div class="content">
            <div class="opts">
                <div class="filter-content">
                    <el-select @change="handleFilterPlan" clearable v-model="filterPlan.planStatus" placeholder="Status" size="small" style="width: 100px">
                        <el-option label="Online" :value="0"></el-option>
                        <el-option label="Offline" :value="1"></el-option>
                    </el-select>
                    <el-select @change="handleFilterPlan" clearable v-model="filterPlan.planStress" placeholder="Levels" size="small" style="width: 100px">
                        <el-option value="p1"></el-option>
                        <el-option value="p2"></el-option>
                        <el-option value="p3"></el-option>
                    </el-select>
                    <!-- <button class="filter btn">筛选</button> -->
                </div>
                <div class="search-content">
                    <input type="text" v-model="keywords" placeholder="Fuzzy search by user name"/>
                    <i class="el-icon-circle-close" @click="cleanKeyword" v-show="keywords"></i>
                    <button class="search btn" @click="search">Search</button>
                </div>
                <div>
                    <button class="add-plan btn" @click="showAddDialog">Add User</button>
                    <button class="all-delete btn" @click="handleMultipleDelete">
                        bulk delete
                    </button>
                </div>
            </div>
            <el-table height="500" ref="multipleTable" :data="plans" tooltip-effect="dark"
                style="width: 100%; border: 1px solid #ccc; margin-top: 20px" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="Username">
                    <template slot-scope="scope">
                        <span @click="showDetailInfo(scope.row.pId)" class="plan-name">
                            {{ scope.row.planName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="startTime" label="startTime" width="100">
                </el-table-column>
                <el-table-column prop="endTime" label="endTime" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="planStress" label="Membership Levels" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="Status" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.planStatus === 0 ? 'Online' : 'Offline' }}
                    </template>
                </el-table-column>
                <el-table-column label="operation" width="160">
                    <template slot-scope="scope">
                        <!-- <span class="delete" @click="handleDelete(scope.row.pId)">删除</span>
                        <span class="modify" @click="showModifyDialog(scope.row.pId)">编辑</span> -->
                        <el-button type="primary" class="el-icon-edit" size="small" @click="showModifyDialog(scope.row.pId)"></el-button>
            <el-button type="danger" class="el-icon-delete" size="small" @click="handleDelete(scope.row.pId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @prev-click="handlePagination" @next-click="handlePagination" @current-change="handlePagination" background layout="prev, pager, next" :current-page="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.total">
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="addDialogFormVisible">
            <el-form ref="form" :model="plan" label-width="80px">
                <el-form-item label="Username">
                    <el-input v-model="plan.planName" style="max-width: 400px"></el-input>
                </el-form-item>
                <el-form-item label="Introduction">
                    <el-input v-model="plan.planInfo" type="textarea" rows="15" show-word-limit maxlength="500"
                        style="max-width: 400px"></el-input>
                </el-form-item>

                <el-form-item label="startTime">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="plan.startTime" style="max-width: 200px" type="date"
                        placeholder="Select Date"></el-date-picker>
                </el-form-item>
                <el-form-item label="endTime">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="plan.endTime" style="max-width: 200px" type="date"
                        placeholder="Select Date"></el-date-picker>
                </el-form-item>
                <el-form-item label="Membership Levels">
                    <el-select v-model="plan.planStress" style="max-width: 200px" placeholder="Please select user level">
                        <el-option label="ViP1" value="P1"></el-option>
                        <el-option label="ViP2" value="P2"></el-option>
                        <el-option label="ViP3" value="P3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Status" v-show="!addPlan">
                    <el-select v-model="plan.planStatus" style="max-width: 200px" placeholder="Please select user status">
                        <el-option label="online" :value="0"></el-option>
                        <el-option label="offline" :value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleAddPlan">Ok</el-button>
            </div>
        </el-dialog>

        <el-dialog title="Booklist" :visible.sync="planDetailForm">
            <el-table height="500" ref="multipleTable" :data="planNotes" tooltip-effect="dark"
                style="width: 100%; border: 1px solid #ccc;">
                <el-table-column type="index" width="40"> </el-table-column>
                <el-table-column label="Bookname" prop="noteName"> </el-table-column>
                <el-table-column prop="typeName" label="Booktype" width="120">
                </el-table-column>
                <el-table-column prop="notePress" label="Popularity" width="60" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="Status" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.noteStatus === 0 ? 'Reading' : 'Complete' }}
                    </template>
                </el-table-column>
                <el-table-column label="operation" width="60">
                    <template slot-scope="scope">
                        <el-button type="danger" class="el-icon-delete" size="small" @click="deletePlanNote(scope.row.nId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showSelectPlanDialog">Add a book</el-button>
            </div>
            <el-dialog title="Select the book to add" :visible.sync="noteListFormVisible" append-to-body>
                <el-table height="300" ref="multipleTable" :data="toAddNoteList" tooltip-effect="dark"
                    style="width: 100%; border: 1px solid #ccc;"
                    @selection-change="handleSelected">
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column label="Bookname" prop="noteName"> </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleAddNoteToPlan">Ok</el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>
</template>
  
<script>

export default {
    name: "PlanManage",
    data() {
        return {
            keywords: '',
            filterPlan: {},
            noteListFormVisible: false,
            planDetailForm: false,
            addDialogFormVisible: false,
            addPlan: true,
            dialogTitle: "Add User",
            plans: [],
            PID: '',
            planNotes: [],
            toAddNoteList: [],
            multipleSelection: [],
            plan: {
                uId: "",
                planName: "",
                planStress: "",
                planInfo: "",
                startTime: "",
                endTime: "",
                planStatus: 0
            },
            willAddNotesList: [],
            pagination: {//分页相关模型数据
                currentPage: 1,//当前页码
                pageSize:7,//每页显示的记录数
                total:0//总记录数
            },
        };
    },
    computed: {
        uid() {
            return this.$store.getters["getUserId"];
        },
    },
    methods: {
        cleanKeyword() {
            this.keywords = ''
            this.getPlansList()
        },
        search() {
            this.$axios.get(`/Plan/SelectPlansByKeyword/${this.uid}/${this.pagination.currentPage}/${this.pagination.pageSize}?keyword=${this.keywords}`).then(response => {
                if (response.data.flag) {
                    this.plans = response.data.data.records
                    this.pagination.total = response.data.data.total
                    // this.pagination.currentPage = response.data.data.beginPage
                    // this.keywords = ''
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        deletePlanNote(nid) {
            this.$alert('Are you sure you want to delete this record?', 'prompts', {
                type: 'warning',
                cancelButtonText: 'cancel',
                confirmButtonText: 'OK'
            }).then(() => {
                const formData = new FormData()
                formData.append('pId', this.PID)
                formData.append('nId', nid)
                this.$axios.post(`/Plan/RemoveNotesFromPlan`, formData).then(response => {
                    if (response.data.flag) {
                        this.$message.success(response.data.msg)
                        this.getInsertedNotes()
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
            }).catch(() => {
                this.$message.info('Deletion cancelled')
            })
            
        },
        handleFilterPlan() {
            this.filterPlan.uId = this.uid
            this.$axios.post(`/Plan/FilterPlans/${this.pagination.currentPage}/${this.pagination.pageSize}`, this.filterPlan).then(response => {
                console.log(response.data);
                if (response.data.flag) {
                    this.plans = response.data.data.records
                    this.pagination.total = response.data.data.total
                    // this.pagination.currentPage = response.data.data.beginPage
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        handleAddNoteToPlan() {
            if (this.willAddNotesList.length === 0) {
                this.$message.warning('Please add books first')
                this.noteListFormVisible = false
                return
            }
            const formData = new FormData()
            let nids = []
            this.willAddNotesList.forEach(item => {
                nids.push(item.nId)
            })
            formData.append('pId', this.PID)
            formData.append('nIds', nids)
            this.$axios.post('/Note/AddNotesToPlan', formData).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                    this.noteListFormVisible = false
                    this.getInsertedNotes()
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        handleSelected(v) {
            this.willAddNotesList = v
        },
        showSelectPlanDialog() {
            this.noteListFormVisible = true
            this.$axios.get(`/Note/GetNotesToAdd/${this.PID}`).then(response => {
                if (response.data.flag) {
                    this.toAddNoteList = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        showDetailInfo(pid) {
            this.PID = pid
            this.planDetailForm = true
            this.getInsertedNotes()
        },
        getInsertedNotes() {
            this.$axios.get(`/Plan/ShowPlanNotesInfoByPid/${this.PID}`).then(response => {
                if (response.data.flag) {
                    this.planNotes = response.data.data;
                } else {
                    this.$message.error(response.data.msg);
                }
            })
        },
        showAddDialog() {
            this.plan = {};
            this.dialogTitle = "Add user";
            this.addDialogFormVisible = true;
            this.addPlan = true;
        },
        showModifyDialog(pid) {
            this.addDialogFormVisible = true;
            this.dialogTitle = "edit user";
            this.addPlan = false;
            this.$axios.get(`Plan/ShowPlanBasicInfoByPid/${pid}`).then((response) => {
                if (response.data.flag) {
                    this.plan = response.data.data;
                } else {
                    this.$message.error(response.data.msg);
                }
            });
        },
        handleDelete(pid) {
            this.$confirm("This will permanently delete this record, should I continue?", "prompts", {
                confirmButtonText: "OK",
                cancelButtonText: "cancel",
                type: "warning",
            })
                .then(() => {
                    this.$axios
                        .post(`/Plan/DeleteSinglePlanByPid/${pid}`)
                        .then((response) => {
                            if (response.data.flag) {
                                this.$message.success(response.data.msg);
                                this.getPlansList()
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "Deletion cancelled",
                    });
                });
        },
        handleMultipleDelete() {
            if (this.multipleSelection.length === 0) {
                this.$message.info("Please select the data first");
                return;
            }
            this.$confirm("This operation will permanently delete all selected records. Do you want to continue?", "prompt", {
                confirmButtonText: "OK",
                cancelButtonText: "cancel",
                type: "warning",
            })
                .then(() => {
                    let pids = [];
                    this.multipleSelection.forEach((item) => {
                        pids.push(item.pId);
                    });
                    const formData = new FormData();
                    formData.append("pIds", pids);
                    this.$axios
                        .post(`/Plan/DeletePlansByPids`, formData)
                        .then((response) => {
                            if (response.data.flag) {
                                this.$message.success(response.data.msg);
                                this.getPlansList();
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "Deletion cancelled",
                    });
                });
        },
        handleModify() {
            this.$axios
                .post("/Plan/UpdatePlanBasicInfo", this.plan)
                .then((response) => {
                    if (response.data.flag) {
                        this.$message.success(response.data.msg);
                        this.addDialogFormVisible = false
                        this.getPlansList()
                    } else {
                        this.$message.error(response.data.msg);
                    }
                    
                });
        },
        handleAddPlan() {
            this.plan.uId = this.uid;
            if (this.plan.startTime > this.plan.endTime) {
                this.$message.error('The start time cannot be greater than the end time')
                return
            }
            if (this.addPlan) {
                this.$axios.post("/Plan/AddPlans", this.plan).then((response) => {
                    if (response.data.flag) {
                        this.$message.success(response.data.msg);
                        this.addDialogFormVisible = false
                        // this.pagination.currentPage = this.pagination.total / this.pagination.pageSize
                        this.getPlansList()
                    } else {
                        this.$message.error(response.data.msg);
                    }
                    
                });
            } else {
                this.handleModify()
            }
            
        },
        handleSelectionChange(v) {
            this.multipleSelection = v;
        },
        getPlansList() {
            this.$axios.get(`/Plan/GetAllPlansByUid/${this.uid}/${this.pagination.currentPage}/${this.pagination.pageSize}`).then((response) => {
                console.log(response.data);
                if (response.data.flag) {
                    this.plans = response.data.data.records;
                    this.pagination.total = response.data.data.total
                } else {
                    this.$message.error(response.data.msg);
                }
            });
        },
        handlePagination(current) {
            // console.log(current);
            this.pagination.currentPage = current
            this.getPlansList()
        }
    },
    created() {
        this.getPlansList();
    },
};
</script>
  
<style scoped>
.title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.title .name {
    font-size: 24px;
}

.search-content {
    position: relative;
}

.search-content i {
    position: absolute;
    right: 76px;
    top: 50%;
    transform: translateY(-55%);
    color: #ddd;
    transition: all .3s;
    cursor: default;
}

.search-content i:hover {
    color: #ccc;
}

.search-content input {
    width: 400px;
    height: 30px;
    margin-right: 20px;
    border-radius: 15px;
    border: 1px solid #ddd;
    outline: none;
    text-indent: 15px;
    font-size: 16px;
    transition: all .3s;
}

.search-content input::placeholder {
    color: #ccc;
    font-size: 14px;
}

.search-content input:hover {
    border-color: #ccc;
}

.search-content input:focus {
    border-color: #E8B2B9;
}

.content {
    position: relative;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.opts {
    display: flex;
    justify-content: space-between;
}

.filter-content * {
    margin-right: 10px;
}

.pagination {
    display: flex;
    width: 100%;
    margin-top: 20px;
    justify-content: center;
}

.add-plan {
    margin-right: 10px;
}

.plan-name {
    cursor: pointer;
}

.plan-name:hover {
    color: #E8B2B9;
}
</style>