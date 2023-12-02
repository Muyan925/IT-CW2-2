<template>
    <div class="login">
      <div class="name">
          <h1>The Women's Book Club</h1>Management system

      </div>
     <div class="content">
        <div class="form">
          <InputBox v-model="account.userId" pattern="^(?:(?:\+|00)86)?1\d{10}$" error-text="Incorrectly formatted mobile phone number" label="Mobile telephone number" required></InputBox>
          <InputBox v-model="account.userPassword" pattern="^[0-9a-zA-Z]{6, 18}$" error-text="Passwords are 6 to 18 digits long and contain only numbers and letters." label="Password" required></InputBox>
          <InputBox v-model="account.confirmPassword" pattern="^[0-9a-zA-Z]{6, 18}$" error-text="Passwords are 6 to 18 digits long and contain only numbers and letters." label="Confirm Password" required></InputBox>
          <InputBox v-model="account.userEmail" pattern='^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$' error-text="Incorrect email format" label="email" required></InputBox>
          <InputBox v-model="account.userName" label="What do I call you?" required></InputBox>
          <button @click="register">Register</button>
          <div class="option">
            Already have an account?<router-link to="/login">login</router-link>
          </div>
      </div>
      <div class="photo">
          <img src="../assets/images/login.png" alt="" srcset="">
      </div>
      
     </div>
      <div class="footer">
          Diligence is the mother of good fortune<br>
      </div>
    </div>
  </template>
  
  <script lang="js">
  import InputBox from '@/components/InputBox'
  export default {
    name: 'RegisterPage',
      components: {
          InputBox
      },
      data() {
        return {
            account: {
                userId: '',
                userPassword: '',
                confirmPassword: '',
                userEmail: '',
                userName: ''
            }
        }
      },
      methods: {
        register() {
            if (this.account.userPassword != this.account.confirmPassword) {
                this.$message.error('Password does not match the confirmation password')
            } else {
                let user = {}
                Object.assign(user, this.account)
                delete user.confirmPassword
                this.$axios.post('/register', user).then(response => {
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
  .login {
      display: flex;
      width: 100%;
      height: 100%;
      background-color: #fff;
      flex-direction: column;
      justify-content: space-between;
  }
  
  .name {
      display: flex;
      height: 160px;
      text-align: center;
      flex-direction: column;
      align-items: center;
      justify-content: end;
  }
  
  .name h1 {
      font-size: 50px;
  }
  
  .content {
      width: 100%;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
      /* background-color: pink; */
  }
  
  .photo {
      width: 400px;
      height: 400px;
      margin-left: 200px;
  }
  
  .photo img {
      width: 100%;
      height: 100%;
  }
  
  .form {
      display: flex;
      height: 500px;
      width: 300px;
      padding: 20px;
      background-color: #fff;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 0 15px 2px rgba(0, 0, 0,  .2);
  }
  
  .form button {
      width: 240px;
      height: 40px;
      margin-bottom: 10px;
      margin-top: 60px;
      font-size: 22px;
      background-color: #6fb59f;
      border: none;
      color: #fff;
  }
  
  .option {
      font-size: 12px;
  }
  
  .footer {
      height: 50px;
      font-size: 14px;
      color: rgb(80, 79, 79);
      text-align: center;
  }
  </style>