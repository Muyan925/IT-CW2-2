<template>
  <el-container>
    <el-aside>
        <!-- <div @click="changeStatus(2)">1</div> -->
        <div v-for="(item, index) in navigators" :key="index" @click="changeStatus(index)" :class="item.checked ? 'checked' : ''">{{item.label}}</div>
        <!-- <router-link @click="changeStatus(1)" tag="div" to="/manage/note" :class="statusList[1] ? 'checked' : ''">笔记管理</router-link>
        <router-link @click="changeStatus(2)" tag="div" to="/manage/plan" :class="statusList[2] ? 'checked' : ''">计划管理</router-link>
        <router-link @click="changeStatus(3)" tag="div" to="/manage/study" :class="statusList[3] ? 'checked' : ''">学习进度</router-link> -->
    </el-aside>
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="js">
export default {
    name: 'ManagePage',
    // components: {
    //     IndexPage, NoteManage, StudyProgress, PlanManage, UserInfo, NoteTypes
    // }
    data() {
        return {
            navigators: [
                {
                    path: '/manage/index',
                    label: 'Homepage',
                    checked: true
                },
                {
                    path: '/manage/note',
                    label: 'Library',
                    checked: false
                },
                {
                    path: '/manage/plan',
                    label: 'Member',
                    checked: false
                },
                {
                    path: '/manage/study',
                    label: 'Comment',
                    checked: false
                }
            ]
        }
    },
    methods: {
        changeStatus(index) {
            console.log(123);
            this.navigators.forEach(item => {
                item.checked = false
            })
            this.navigators[index].checked = true
            this.$router.push(this.navigators[index].path)
        }
    }
}
</script>

<style scoped>
.el-container {
    /* background-color: blue; */
    height: calc(100vh - 60px);
    width: 100%;
}
.el-aside {
    display: flex;
    width: 140px !important;
    background-color: #ecc7cb;
    flex-direction: column;
    align-items: center;
}

.el-aside div {
    width: 100px;
    height: 60px;
    line-height: 54px;
    background-color: #e89da7;
    margin-top: 30px;
    border-radius: 5px;
    text-align: center;
    cursor: default;
    color: #1a1a1a;
    transition: all .3s;
}

.el-aside div:hover {
    background-color: #E8B2B9;
    transform: scale(1.05);
}

.el-main {
    overflow: scroll;
    /* background-color: pink; */
}

.el-aside .checked {
    color: #fff;
}
</style>