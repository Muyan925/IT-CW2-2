<template>
    <div class="login-form">
      <!-- <img src="../assets/images/user.webp" alt="" srcset=""> -->
      <div class="title">Register</div>
      <div class="input-content">
          <input type="text" pattern="" v-model="user.userId" id="phone">
          <label class="placeholder" for="phone">Phone number</label>
      </div>
      <!-- <div class="input-content">
          <input type="text" pattern="" v-model="code" id="code">
          <label class="placeholder" for="code">验证码</label>
          <span class="get-code" @click="getCode">{{ codeLabel }}</span>
      </div> -->
      <div class="input-content">
          <input :type="isSee ? 'text' : 'password'" pattern="" @input="checkStrength1" v-model="user.userPassword" id="pass">
          <label class="placeholder" for="pass">Password</label>
          <span class="see iconfont" @click="changeIsSee">{{ isSee ? '&#xe624;' : '&#xe625;' }}</span>
          <span class="strength">
            <i :class="strength1 > 0 ? 'weak' : ''"></i>
            <i :class="strength1 > 1 ? 'nomal' : ''"></i>
            <i :class="strength1 > 2 ? 'strong' : ''"></i>
          </span>
      </div>
      <div class="input-content">
          <input :type="isSee ? 'text' : 'password'" pattern="" @input="checkStrength2" v-model="user.confirmPassword" id="c-pass">
          <label class="placeholder" for="c-pass">Confirm Password</label>
          <span class="see iconfont" @click="changeIsSee">{{ isSee ? '&#xe624;' : '&#xe625;' }}</span>
          <span class="strength">
            <i :class="strength2 > 0 ? 'weak' : ''"></i>
            <i :class="strength2 > 1 ? 'nomal' : ''"></i>
            <i :class="strength2 > 2 ? 'strong' : ''"></i>
          </span>
      </div>
      <div class="input-content">
          <input type="text" pattern="" v-model="user.userEmail" id="email">
          <label class="placeholder" for="email">Email</label>
      </div>
      <div class="input-content">
          <input type="text" pattern="" v-model="user.userName" id="nickname">
          <label class="placeholder" for="nickname">Name</label>
      </div>
      <button class="btn" @click="register">Sign Up</button>
    </div>
  </template>
  
  <script>
  export default {
      name: 'RegisterForm',
      data() {
          return {
            isSee: false,
            strength1: 0,
            strength2: 0,
            user: {
                userId: '',
                userPassword: '',
                confirmPassword: '',
                userEmail: '',
                userName: ''
            },
            code: '',
            codeLabel: 'Get CAPTCHA',
            isSend: true
          }
      },
      methods: {
        checkStrength1() {
            if (this.user.userPassword.length > 12) {
                this.strength1 = 3
            } else if (this.user.userPassword.length > 6) {
                this.strength1 = 2
            } else if (this.user.userPassword.length > 0) {
                this.strength1 = 1
            } else {
                this.strength1 = 0
            }
        },
        checkStrength2() {
            if (this.user.confirmPassword.length > 12) {
                this.strength2 = 3
            } else if (this.user.confirmPassword.length > 6) {
                this.strength2 = 2
            } else if (this.user.confirmPassword.length > 0) {
                this.strength2 = 1
            } else {
                this.strength2 = 0
            }
        },
        changeIsSee() {
            this.isSee = !this.isSee
        },
        getCode() {    
            const rgx = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
            if (!rgx.test(this.user.userId)) {
                this.$message.warning("Incorrect mobile phone number format")
                return
            }
            if (!this.isSend) {
                return
            }
            this.isSend = false
            this.$axios.post(`/users/send/${this.user.userId}`).then(response => {
                if (response.data.flag) {
                    this.$message.success(response.data.msg)
                } else {
                    this.$message.error(response.data.msg)
                }
            })
            let seconds = 60
            this.timer = setInterval(() => {
                this.codeLabel = 'wait ' + seconds + ' seconds'
                seconds--
                if (seconds < 0) {
                    clearInterval(this.timer)
                    this.codeLabel = 'Get CAPTCHA'
                    this.isSend = true
                }
            }, 1000);

        },
        register() {
            for(let k in this.user) {
                if (!this.user[k]) {
                    this.$message.warning('Please check the form for completeness')
                    return
                }
            }
            if (this.user.userPassword != this.user.confirmPassword) {
                this.$message.error('Password does not match the confirmation password')
            } else {
                let account = {}
                Object.assign(account, this.user)
                delete account.confirmPassword
                this.$axios.post(`/register`, account).then(response => {
                    if (response.data.flag) {
                        this.$message.success(response.data.msg)
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
            }
        }
      },
  }
  </script>
  
  <style scoped>
  .login-form {
    position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 70px 20px 20px;
  }
  
  .login-form img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #E8B2B9;
      margin-bottom: 40px;
  }
  
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
      margin-bottom: 25px;
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

.title {
    position: absolute;
    top: 20px;
    left: 28px;
    font-size: 24px;
    font-weight: 700;
    color: #E8B2B9;
}
  
  .login-form button {
      width: 80px;
      height:30px;
      /* margin-top: 10px; */
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

  .strength {
    display: flex;
    position: absolute;
    bottom: -8px;
    right: 0;
    width: 100px;
    height: 4px;
    /* background-color: pink; */
  }

  .strength i {
    flex: 1;
    background-color: rgb(190, 190, 190);
    border-radius: 2px;
  }

  .strength i:nth-child(2) {
    margin: 0 4px;
  }

  .weak {
    background-color: rgb(253, 36, 36) !important;
  }

  .nomal {
    background-color: rgb(251, 151, 57) !important;
  }

  .strong {
    background-color: rgb(8, 199, 8) !important;
  }

  .get-code {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 12px;
    color: #aaa;
    cursor: pointer;
  }

  .get-code:hover {
    color: #E8B2B9;
  }
  </style>