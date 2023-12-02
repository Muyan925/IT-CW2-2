<template>
  <div class="note-type">
    <div class="title">Hello, {{username}}</div>
    <div class="content">
      <div class="opts">
        <button class="add btn" @click="handleAdd">Add</button>
        <button class="all-delete btn" @click="handleMultipleDelete">bulk delete</button>
      </div>
      <el-table height="500"
      :data="types"
      style="width: 100%; border: 1px solid #ccc;"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column type="index" label="Number" width="100"> </el-table-column>
        <el-table-column label="Typename" prop="typeName"> </el-table-column>
        <el-table-column label="Operation" width="200">
          <template slot-scope="scope">
            <el-button type="primary" class="el-icon-edit" size="small" @click="handleEdit(scope.row.tId)"></el-button>
            <el-button type="danger" class="el-icon-delete" size="small" @click="handleDelete(scope.row.tId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pigination" v-show="false">
        <el-pagination background layout="prev, pager, next" :total="1000">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoteTypes",
  data() {
    return {
        types: [],
        multipleSelection: []
    }
  },
  methods: {
    addType(typeName) {
      this.$axios.post('/Type/AddType', {typeName, uId: this.uid}).then(response => {
        if (response.data.flag) {
          this.$message.success(response.data.msg)
          this.getTypesList()
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    deleteType(tid) {
      this.$axios.post(`/Type/DeleteTypeByTid/${tid}`).then(response => {
        if (response.data.flag) {
          this.$message.success(response.data.msg)
          this.getTypesList()
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    modifyType(typeName, tid) {
      this.$axios.post('/Type/UpdateTypeByTid', {typeName, uId: this.uid, tId: tid}).then(response => {
        if (response.data.flag) {
          this.$message.success(response.data.msg)
          this.getTypesList()
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    getTypesList() {
      this.$axios.get(`/Type/GetTypeListByUid/${this.uid}`).then(response => {
        if (response.data.flag) {
          this.types = response.data.data
        } else {
          this.$message.error(response.data.msg)
        }
        console.log(response.data);
      })
    },
    handleAdd() {
        this.$prompt('Please enter the name of the type', 'prompts', {
          confirmButtonText: 'OK',
          cancelButtonText: 'cancel',
        }).then(({ value }) => {
          
          this.addType(value)
     
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel input'
          });       
        });
    },
    handleEdit(tid) {
        this.$prompt('Please enter a new type name', 'prompts', {
          confirmButtonText: 'OK',
          cancelButtonText: 'cancel',
        }).then(({ value }) => {
          this.modifyType(value, tid)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel input'
          });       
        });
    },
    handleDelete(tid) {
        this.$confirm('This will permanently delete all selected records, do you want to continue?', 'prompts', {
            confirmButtonText: 'OK',
            cancelButtonText: 'cancel',
            type: 'warning'
            }).then(() => {
            this.deleteType(tid)
            }).catch(() => {
            this.$message({
                type: 'info',
                message: 'Cancel input'
            });          
            });
        },
        handleSelectionChange(v) {
            this.multipleSelection = v;
        },
        handleMultipleDelete() {
            if (this.multipleSelection.length === 0) {
                this.$message.info("Please select the data first");
                return;
            }
            this.$confirm("This will permanently delete all selected records, do you want to continue?", "prompts", {
                confirmButtonText: "OK",
                cancelButtonText: "cancel",
                type: "warning",
            }).then(() => {
                    let tids = [];
                    this.multipleSelection.forEach((item) => {
                        tids.push(item.tId);
                    });
                    const formData = new FormData();
                    formData.append("tIds", tids);
                    this.$axios
                        .post(`/Type/DeleteTypeByTid/`, formData)
                        .then((response) => {
                            if (response.data.flag) {
                                this.$message.success(response.data.msg);
                                this.getTypesList()
                            } else {
                                this.$message.error(response.data.msg);
                            }
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "Cancel input",
                    });
                });
        },
    },
    computed: {
      uid() {
        return this.$store.getters['getUserId']
      },
      username() {
        return this.$store.getters['getUsername']
      }
    },
    created() {
      this.getTypesList()
    }
}
</script>

<style scoped>
.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.content {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.opts {
  margin-bottom: 20px;
}

.add {
  margin-right: 10px;
}

.pigination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>