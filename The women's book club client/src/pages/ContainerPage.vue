<template>
  <el-container>
    <el-header>
        <div class="site">
            <!-- <img src="../assets/images/logo.png" alt="" srcset="" @click="gotoIndexPage"> -->
            <span class="name">The Women's Book Club</span>
        </div>
        <!-- <div class="saying">
            {{ saying }}
        </div> -->
        <div class="user">
            <router-link tag="span" to="/account/info" class="photo">
                <img :src="userImage" alt="">
            </router-link>
            <!-- <span>login in</span> -->
            <span class="logout" @click="logout">Logout</span>
        </div>

    </el-header>
    <router-view></router-view>
    <AIChat></AIChat>
  </el-container>
</template>

<script lang="js">
import AIChat from '@/components/AIChat'
export default {
    name: 'ContainerPage',
    data() {
        return {
            saying: ''
        }
    },
    components: {
        AIChat
    },
    methods: {
        logout() {
            this.$store.dispatch('saveUserInfo', null)
            sessionStorage.clear()
            this.$router.replace('/login')
        },
        gotoIndexPage() {
            this.$router.replace('/manage/index')
        },
     
    },
    computed: {
        userImage() {
            return this.$store.getters['getUserPhoto']
        }
    },
  
}
</script>

<style scoped>
.el-container {
    position: relative;
    min-width: 1200px;
    min-height: 700px;
}
.el-header {
    display: flex;
    background-color: #f2dadd;
    justify-content: space-between;
    align-items: center;
    /* box-shadow: 0 0 10px 2px rgba(0, 0, 0, .1); */
    border-bottom: 1px solid #E8B2B9;
}

.site {
    display: flex;
    height: 100%;
    align-items: center;
    
}

/* .site img {
    width: 50px;
    height: 50px;
    margin-right: 20px;
} */

.site .name {
    padding: 3px 6px;
    font-size: 24px;
    border-radius: 5px;
    color: #e27682;
    font-weight: 700;
    text-align: center
}

.saying {
    max-width: 600px;
    font-size: 14px;
    text-align: center;
    color: #333;
    white-space: nowrap;
}

.user {
    display: flex;
    align-items: center;
}

.user .photo {
    overflow: hidden;
    width: 40px;
    height: 40px;
    margin-right: 20px;
    border-radius: 50%;
}

.user .photo img {
    width: 100%;
    height: 100%;
}

.logout {
    cursor: pointer;
    color: #1c1b1b;
}
</style>