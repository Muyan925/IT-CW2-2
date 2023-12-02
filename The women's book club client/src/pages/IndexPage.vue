<template>
  <div class="index">
    <div class="username">Hello, {{ username }}</div>
    <div class="content">
        <div class="left">
            <ul class="msgs">
                <li>There are {{infos.noteNumber}} books in the libaray</li>
                <li>The women's book club has {{infos.planNumber}} members</li>
            </ul>
            <div class="notes">
                <div class="title">
                    <span>Book list</span>
                    <span>Please operate in detail on the library management page</span>
                </div>
                <el-table
                    :data="notes"
                    height="500"
                    border
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    label="number"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="noteName"
                    label="Name">
                    </el-table-column>
                    <el-table-column
                    prop="typeName"
                    label="type"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="notePress"
                    label="importance"
                    width="100">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="right">
            <div class="todo">
                <div class="title">
                    <span>Users</span><span class="date">{{ getDate() }}</span>
                </div>
                <!-- <ul class="todo-list">
                    <li v-for="(item ,index) in todos" :key="index">
                        <span>{{index}}</span><span>{{ item.planName }}</span><span>{{ item.planInfo }}</span>
                    </li>
                </ul> -->
                <el-table :data="todos" border height="500" style="margin-top: 10px;">
                    <el-table-column
                    type="index" 
                    label="number"
                    width="80px">
                    </el-table-column>
                    <el-table-column
                    prop="planName" 
                    label="Username">
                    </el-table-column>
                    <el-table-column
                    prop="planInfo" 
                    label="Introduction">
                    </el-table-column>
                </el-table>
            </div>
            <div class="pic">
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="js">
export default {
    name: 'IndexPage',
    data() {
        return {
            infos: {
                noteNumber: 0,
                planNumber: 0
            },
            notes: [],
            todos: []
        }
    },
    computed: {
        uid() {
            return this.$store.getters['getUserId']
        },
        username() {
            return this.$store.getters['getUsername']
        }
    },
    methods: {
        getDate() {
            var date = new Date();
            var year = date.getFullYear();    //  返回的是年份
            var month = date.getMonth() + 1;  //  返回的月份上个月的月份，记得+1才是当月
            var dates = date.getDate();  
            if(month<10)month="0"+month;
            if(date<10)date="0"+date;
            return year + "/" + month + "/" + dates
        },
        getPlanAndNoteNumber() {
            this.$axios.get(`/user/ShowCountAtHomePageByUid/${this.uid}`).then(response => {
                // console.log(response.data);
                if (response.data.flag) {
                    this.infos.noteNumber = response.data.data.uploadNotesNum
                    this.infos.planNumber = response.data.data.createdPlansNum
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        getNotesList() {
            this.$axios.get(`/user/ShowNotesAtHomePageByUid/${this.uid}`).then(response => {
                // console.log(response.data);
                if (response.data.flag) {
                    this.notes = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        getTodos() {
            this.$axios.get(`/user/ShowUnfinishedPlansAtHomePageByUid/${this.uid}`).then(response => {
                console.log(response.data);
                if (response.data.flag) {
                    this.todos = response.data.data
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        }
    },
    created() {
        this.getPlanAndNoteNumber()
        this.getNotesList()
        this.getTodos()
    }
}
</script>

<style scoped>
.index {
    height: 100%;
}
.username {
    font-size: 24px;
    margin-bottom: 20px;
}

.content {
    display: flex;
    height: calc(100% - 60px);
}

.left,
.right {
    flex: 1;
    min-width: 300px;
}

.left {
    margin-right: 20px;
}

.right {
    display: flex;
    flex-direction: column;
}

.msgs {
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 12px;
}

.msgs li {
    margin: 4px 0;
}

.notes {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-top: 20px;
}

.notes .title {
    display: flex;
    font-size: 13px;
    margin-bottom: 10px;
    justify-content: space-between;
}

.notes .el-table {
    /* background-color: red; */
}

.todo {
    height: 600px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.todo .title {
    display: flex;
    justify-content: space-between;
}

.todo-list {
    width: 100%;
    height: 240px;
    /* background-color: red; */
    margin-top: 10px;
}

.todo-list li {
    margin: 5px 0;
    font-size: 14px;
    color: #333;
}

.todo-list li span {
    overflow: hidden;
    margin-right: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* background-color: green; */
}

.todo-list li span:nth-child(2) {
    display: inline-block;
    width: calc(100% - 150px);
    /* background-color: pink; */
    vertical-align: top;
    margin-left: 30px;
}

/* .pic {
    flex: 1;
    background: url(../assets/images/login.png) no-repeat;
    background-position: top center;
    background-size: 100%; */
/* } */
</style>