<template>
    <div class="plan-manage">
        <div class="title">
            <span class="name">library management</span>
        </div>
        <div class="content">
            <div class="opts">
                <div class="filter-content">
                    <el-select @change="handleFilterNote" clearable v-model="filterNote.typeName" placeholder="Booktype" size="small" style="width: 100px">
                        <el-option v-for="(item, index) in types" :key="index" :value="item.typeName"></el-option>
                    </el-select>
                    <el-select @change="handleFilterNote" clearable v-model="filterNote.noteStatus" placeholder="Status" size="small" style="width: 100px">
                        <el-option label="Read" :value="0"></el-option>
                        <el-option label="Unread" :value="1"></el-option>
                    </el-select>
                    <el-select @change="handleFilterNote" clearable v-model="filterNote.notePress" placeholder="Popularity" size="small" style="width: 120px">
                        <el-option value="P1"></el-option>
                        <el-option value="P2"></el-option>
                        <el-option value="P3"></el-option>
                    </el-select>
                    <!-- <button class="filter btn">筛选</button> -->
                </div>
                <div class="search-content">
                    <input type="text" v-model="keywords" placeholder="Search by book title"/>
                    <i class="el-icon-circle-close" @click="cleanKeyword" v-show="keywords"></i>
                    <button class="search btn" @click="search">Search</button>
                </div>
                <div>
                    <button class="add-plan btn" @click="showAddDialog">Added books</button>
                    <button class="all-delete btn" @click="handleMultipleDelete">
                        bulk delete
                    </button>
                    <!-- <button class="add-to-plan btn" @click="handleMultipleDelete">
                        加入计划
                    </button> -->
                </div>
            </div>
            <el-table height="500" ref="multipleTable" :data="notes" tooltip-effect="dark"
                style="width: 100%; border: 1px solid #ccc; margin-top: 20px" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="Bookname">
                    <template slot-scope="scope">
                        <span class="note-name" @click="showNoteInfo(scope.row.fileLocation, scope.row.noteName)">
                            {{ scope.row.noteName }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="typeName" label="Booktype" width="100">
                </el-table-column>
                <el-table-column prop="notePress" label="Popularity" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="Status" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.noteStatus === 0 ? 'Read' : 'Unread' }}
                    </template>
                </el-table-column>
                <el-table-column label="Operation" width="160">
                    <template slot-scope="scope">
                        <!-- <span class="delete" @click="handleDelete(scope.row.pId)">删除</span>
                        <span class="modify" @click="showModifyDialog(scope.row.pId)">编辑</span> -->
                        <el-button type="primary" class="el-icon-edit" size="small" @click="showModifyDialog(scope.row.nId)"></el-button>
                        <el-button type="danger" class="el-icon-delete" size="small" @click="handleDelete(scope.row.nId)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @prev-click="handlePagination" @next-click="handlePagination" @current-change="handlePagination" background layout="prev, pager, next" :current-page="pagination.currentPage" :page-size="pagination.pageSize" :total="pagination.total">
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="addDialogFormVisible">
            <el-form ref="form" :model="note" label-width="80px">
                <el-form-item label="Bookname">
                    <el-input v-model="note.noteName" style="max-width: 400px"></el-input>
                </el-form-item>
                <!-- <el-form-item label="笔记描述">
                    <el-input v-model="plan.planInfo" type="textarea" rows="5" show-word-limit maxlength="100"
                        style="width: 400px"></el-input>
                </el-form-item> -->
                <el-form-item label="Booktype">
                    <el-select v-model="note.tId" style="max-width: 200px" placeholder="Please select book type">
                        <el-option v-for="(item, index) in types" :key="index" :label="item.typeName" :value="item.tId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Popularity">
                    <el-select v-model="note.notePress" style="max-width: 200px" placeholder="Popularity of books">
                        <el-option label="P1" value="P1"></el-option>
                        <el-option label="P2" value="P2"></el-option>
                        <el-option label="P3" value="P3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="status" v-show="!addNote">
                    <el-select v-model="note.noteStatus" style="max-width: 200px" placeholder="Please select book reading status">
                        <el-option label="Read" :value="0"></el-option>
                        <el-option label="Unread" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Upload Books" v-show="addNote">
                    <label>
                        <input type="file" v-show="false" accept=".md" @change="handleChange">
                        <div class="upload">
                            <span class="el-icon-plus"></span>
                            <span>Click to upload a book</span>
                        </div>
                        <div class="file-name">{{ file.name }}</div>
                    </label>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="handleAddNote">Determine</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    name: "NoteManage",
    data() {
        return {
            keywords: '',
            file: {},
            filterNote: {},
            addDialogFormVisible: false,
            addNote: true,
            dialogTitle: "Add Book",
            notes: [],
            types: [],
            multipleSelection: [],
            note: {
                noteName: '',
                typeName: '',
                notePress: '',
                noteStatus: 0,
                tId: '',
            },
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
            this.getNotesList()
        },
        search() {
            this.$axios.get(`/Note/SelectNotesByKeyword/${this.uid}/${this.pagination.currentPage}/${this.pagination.pageSize}?keyword=${this.keywords}`).then(response => {
                if (response.data.flag) {
                    this.notes = response.data.data.records
                    this.pagination.total = response.data.data.total
                    // this.keywords = ''
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        handleFilterNote() {
            this.filterNote.uId = this.uid
            this.$axios.post(`/Note/FilterNotes/${this.pagination.currentPage}/${this.pagination.pageSize}`, this.filterNote).then(response => {
                console.log(response.data);
                if (response.data.flag) {
                    this.notes = response.data.data.records
                    this.pagination.total = response.data.data.total
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        showNoteInfo(location, name) {
            // console.log(location);
            this.$router.push({name: 'View', query: {
                location,
                name
            }})
        },
        handleChange(e) {
            if (e.currentTarget.files.length === 0) {
                return
            }
            this.file = e.currentTarget.files[0]
        },
        showAddDialog() {
            this.note = {}
            this.dialogTitle = 'Add Book'
            this.addDialogFormVisible = true
            this.addNote = true
        },
        showModifyDialog(nid) {
            // console.log(nid);
            this.dialogTitle = 'Updated information'
            this.addDialogFormVisible = true
            this.addNote = false
            this.$axios.get(`/Note/ShowNoteInfoByNid/${nid}`).then(response => {
                if (response.data.flag) {
                    this.note = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        handleDelete(nid) {
            this.$confirm("This will permanently delete this books, should I continue?", "prompts", {
                confirmButtonText: "OK",
                cancelButtonText: " Cancelled",
                type: "warning",
            })
                .then(() => {
                    this.$axios
                        .post(`/Note/DeleteSingleNoteByNid/${nid}`)
                        .then((response) => {
                            if (response.data.flag) {
                                this.$message.success(response.data.msg);
                                this.getNotesList()
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
            this.$confirm("This will permanently delete all selected records, do you want to continue?", "prompts", {
                confirmButtonText: "OK",
                cancelButtonText: "Cancelled",
                type: "warning",
            })
                .then(() => {
                    let nids = [];
                    this.multipleSelection.forEach((item) => {
                        nids.push(item.nId);
                    });
                    const formData = new FormData();
                    formData.append("nIds", nids);
                    this.$axios
                        .post(`/Note/DeleteNotesByNids`, formData)
                        .then((response) => {
                            if (response.data.flag) {
                                this.$message.success(response.data.msg);
                                this.getNotesList();
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
            this.$axios.post("/Note/UpdateNoteInfoByNid", this.note).then((response) => {
                    if (response.data.flag) {
                        this.$message.success(response.data.msg);
                        this.addDialogFormVisible = false
                        this.getNotesList()
                    } else {
                        this.$message.error(response.data.msg);
                    }
                    
                });
        },
        handleAddNote() {
            if (!this.addNote) {
                this.handleModify()
                return
            }
            if (!(this.file instanceof File)) {
                this.$message.info('Please select the book file')
                return
            }
            const formData = new FormData()
            formData.append('note', JSON.stringify({
                ...this.note,
                uId: this.uid,
            }))
            formData.append('noteFile', this.file)
            this.$axios.post(`/Note/AddNotes`, formData).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                    this.addDialogFormVisible = false
                    this.getNotesList()
                } else {
                    this.$message.error(response.data.msg)
                }
            })
            
        },
        handleSelectionChange(v) {
            this.multipleSelection = v;
        },
        getNotesList() {
            this.$axios.get(`/Note/GetAllNoteByUid/${this.uid}/${this.pagination.currentPage}/${this.pagination.pageSize}`).then((response) => {
                console.log(response.data);
                if (response.data.flag) {
                    this.notes = response.data.data.records;
                    this.pagination.total = response.data.data.total
                } else {
                    this.$message.error(response.data.msg);
                }
            });
        },
        getTypeList() {
            this.$axios.get(`/Type/GetTypeListByUid/${this.uid}`).then(response => {
                if (response.data.flag) {
                this.types = response.data.data
                } else {
                this.$message.error(response.data.msg)
                }
            })
        },
        handlePagination(current) {
            // console.log(current);
            this.pagination.currentPage = current
            this.getNotesList()
        }
    },
    created() {
        this.getTypeList()
        this.getNotesList();
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


.upload {
    display: flex;
    width: 200px;
    height: 200px;
    /* background-color: red; */
    border: 1px dotted gray;
    border-radius: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.upload span:first-child {
    font-size: 40px;
    margin-top: 30px;
}

.upload span:last-child {
    font-size: 12px;
}

.file-name {
    width: 200px;
    height: 30px;
    /* background-color: red; */
    font-size: 14px;
}

.note-name {
    cursor: pointer;
}

.note-name:hover {
    color: #E8B2B9;
}
</style>