<template>
  <div class="login-form">
    <!-- <img src="../assets/images/user.webp" alt="" srcset=""> -->
    <div class="title">Login</div>
    <div class="input-content"> 
        <input type="text" pattern="" v-model="phoneNumber" id="phone">
        <label class="placeholder" for="phone">Phone Number</label>
    </div>
    <div class="input-content">
        <input :type="isSee ? 'text' : 'password'" pattern="" v-model="password" id="pass">
        <label class="placeholder" for="pass">Password</label>
        <span class="see iconfont" @click="changeIsSee">{{ isSee ? '&#xe624;' : '&#xe625;' }}</span>
    </div>
    <div class="input-content code">
        <input type="text" v-model="code" pattern="" id="code">
        <label class="placeholder" for="code">Code</label>
        <div class="code-content" @click="getCode">
            <img :src="codeSrc" alt="" srcset="">
        </div>
    </div>
    <button class="btn" @click="login">Login</button>
  </div>
</template>

<script>
export default {
    name: 'LoginForm',
    data() {
        return {
            isSee: false,
            phoneNumber: '',
            password: '',
            code: '',
            codeSrc: ''
        }
    },
    methods: {
        changeIsSee() {
            this.isSee = !this.isSee
        },
        login() {
            if (this.phoneNumber === '' || this.password === '') {
                this.$message.warning('Mobile phone number and password cannot be empty')
                return
            }
            this.$axios.get(`/login?userId=${this.phoneNumber}&userPassword=${this.password}&code=${this.code}`).then(response => {
                console.log(response.data);
                if (response.data.flag) {
                    console.log(response.data);
                    this.$message.success(response.data.msg)
                    this.$store.dispatch('saveUserInfo', response.data.data.user)
                    sessionStorage.setItem('token', response.data.data.token)
                    this.timer = setTimeout(() => {
                        this.$router.replace('/manage/index')
                    }, 1500);
                } else {
                    this.$message.error(response.data.msg)
                }
            })
        },
        loadCode() {
            this.$axios.get('/user/getCaptcha').then(response => {
                this.codeSrc = 'data:image/png' + response.data
                console.log(response);
            })
        },
        getCode() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.loadCode()
            }, 300);
        }
    },
    created() {
        this.loadCode()
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    }
}
</script>

<style scoped>
.login-form {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-between; */
    width: 100%;
    height: 100%;
    padding: 120px 20px 20px;
    /* background-color: red; */
    /* background-color: pink; */
}

/* .login-form img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid rgb(179, 225, 249);
    margin-bottom: 40px;
} */

.login-form input {
    height: 30px;
    width: 240px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: all .2s;
    padding: 2px 4px;
    font-size: 16px;
}

.login-form input:focus {
    border-color:  #E8B2B9;
}
.input-content {
    position: relative;
    margin-bottom: 20px;
}
.input-content .placeholder {
    display: block;
    position: absolute;
    height: 30px;
    line-height: 30px;
    top: 0;
    left: 4px;
    font-size: 14px;
    color: #929191;
    transition: all .3s;
}

.input-content input:focus + .placeholder {
    top: -24px;
    color: #E8B2B9;
    font-size: 12px;
}

.input-content input:invalid + .placeholder {
    top: -24px;
    color: #E8B2B9;
    font-size: 12px;
}

.login-form button {
    width: 80px;
    height: 30px;
    margin-top: 30px;
    background-color:#E8B2B9
}

.see {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    /* background-color: blue; */
    text-align: center;
    cursor: pointer;
    color: #929191;
}
.title {
    position: absolute;
    top: 20px;
    right: 28px;
    font-size: 40px;
    font-weight: 700;
    color: #E8B2B9;
}

.remember-me {
    /* background-color: pink; */
    display: flex;
    align-items: center;
    width: 200px;
}

.code {
    display: flex;
}

.code input {
    width: 170px;
    margin-right: 10px;
}

.code-content {
    width: 60px;
    height: 30px;
}

.code-content img {
    width: 100%;
    height: 100%;
}
</style>