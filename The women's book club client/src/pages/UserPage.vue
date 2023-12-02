<template>
    <el-container>
      <el-aside>
        <div v-for="(item, index) in navigators" :key="index" @click="changeStatus(index)" :class="item.checked ? 'checked' : ''">{{item.label}}</div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </template>
  
  <script lang="js">
  import IndexPage from '@/pages/IndexPage'
  import NoteManage from '@/pages/NoteManage'
  import StudyProgress from '@/pages/StudyProgress'
  import PlanManage from '@/pages/PlanManage'
  import UserInfo from '@/pages/UserInfo'
  import NoteTypes from '@/pages/NoteTypes'
  export default {
      name: 'UserPage',
      components: {
          IndexPage, NoteManage, StudyProgress, PlanManage, UserInfo, NoteTypes
      },
      data() {
        return {
            navigators: [
                {
                    path: '/account/info',
                    label: 'Personal Info',
                    checked: true
                },
                {
                    path: '/account/types',
                    label: 'Book Type',
                    checked: false
                },
                {
                    path: '/manage/index',
                    label: 'Homepage',
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