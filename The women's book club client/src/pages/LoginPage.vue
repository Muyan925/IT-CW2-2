<template>
  <div class="login">
    <div class="form-box">
            <div :class="isLogin ? 'info' : 'info right'">
                <div class="title">The Women's Book Club</div>
                <div class="description">Management system</div>
                <button class="btn switch" @click="handleSwitch">{{ isLogin ? 'Go to register' : 'log in' }}</button>
                <img src="@/assets/images/p1.jpg">
            </div>
            <div :class="isLogin ? 'form unvisible' : 'form'">
                <RegisterForm></RegisterForm>
            </div>
            <div :class="isLogin ? 'form' : 'form unvisible'">
                <LoginForm></LoginForm>
                
            </div>
        
        </div>
  </div>
</template>

<script lang="js">
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
export default {
    name: 'LoginPage',
    components: {
        LoginForm, RegisterForm
    },
    data() {
        return {
            isLogin: true,
            switchCount: 0,
            showtip: false
        }
    },
    methods: {
        handleSwitch() {
            this.isLogin = !this.isLogin
            this.switchCount ++
            if (this.switchCount >= 10) {
                this.showtip = true
            }
        }
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    }
}
</script>

<style scoped>
.login {
    display: flex;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(45deg, #E8B2B9, #E8B2B9);
    perspective: 1000px;
    /* transform-style: preserve-3d; */
}
.form-box {
    overflow: hidden;
    position: relative;
    display: flex;
    width: 640px;
    height: 460px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 2px 2px 12px 2px rgba(0, 0, 0, .3);
    /* perspective: 100px; */
    clip-path: margin-box;
    
}

.info {
    position: absolute;
    display: flex;
    /* display: none; */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    /* background-color: pink; */
    /* box-shadow: 0 0 10px 2px rgba(0, 0, 0, .3); */
    z-index: 1;
    transition: all .3s;
}

.info img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    /* filter: brightness(.8); */
}

.title {
    font-size: 40px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
    text-align: center
}

.description {
    font-size: 14px;
    color: rgb(248, 248, 248);
}

.form {
    width: 50%;
    height: 100%;
    transition: all .3s;
}

.switch {
    width: 150px;
    margin-top: 60px;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px) brightness(.9);
    color: rgb(255, 255, 255);
}

.right {
    left: 50%;
}

.unvisible {
    opacity: 0;
}

.container {
    position: relative;
    overflow: hidden;
}

.tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 400px;
    background-color: #fff;
    z-index: 5;
    font-size: 120px;
    font-weight: 700;
    text-align: center;
}
</style>