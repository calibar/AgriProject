<template>
  <div id="app" class="d-flex justify-content-center align-items-center vh-100 login-page">
    <div class="card p-4 shadow login-box" style="width: 350px;">
      <h2 class="text-start mb-4">{{ isSignUp ? 'Sign Up' : 'Login' }}</h2>
      <form @submit.prevent>
        <div class="mb-3">
          <label for="username" class="form-label">Username:</label>
          <div class="input-group">
            <input type="text" id="username" v-model="username" class="form-control" required>
            <span v-if="isSignUp" class="input-group-text" @click="checkUsername" style="cursor: pointer;">
              <i class="fas fa-sync-alt"></i>
            </span>
          </div>
          <small v-if="usernameError" class="text-bright-red">{{ usernameError }}</small>
          <small v-if="usernameGreat" class="text-bright-green">{{ usernameGreat }}</small>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input type="password" id="password" v-model="password" class="form-control" required>
          <small v-if="passwordError" class="text-bright-red">{{ passwordError }}</small>
        </div>
        <div v-if="isSignUp" class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control" required>
          <small v-if="passwordMismatch" class="text-bright-red">Passwords do not match</small>
        </div>
        <button type="button" class="btn btn-primary w-100" :disabled="isSignUp && passwordMismatch" @click="handleSubmit">{{ isSignUp ? 'Sign Up' : 'Login' }}</button>
      </form>
      <p class="text-center mt-3">
        {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
        <a href="#" @click.prevent="toggleSignUp">{{ isSignUp ? 'Login' : 'Sign Up' }}</a>
      </p>
    </div>
  </div>
</template>

<script>
import apiService from '@/services/apiService'; 
export default {
  name: 'HomePage',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      isSignUp: false,
      passwordMismatch: false,
      usernameError: '',
      passwordError: '',
      usernameGreat:''
    };
  },
  watch: {
    username() {
      this.usernameError = ''; // 清除用户名错误消息
      this.usernameGreat=''
    },
    password() {
      this.passwordError = ''; // 清除密码错误消息
      this.checkPasswordMismatch();
    },
    confirmPassword() {
      this.checkPasswordMismatch();
    }
  },
  methods: {
    handleSubmit() {
      this.clearErrors();
      
      if (!this.username) {
        this.usernameError = 'Username cannot be empty';
        return;
      }
      if (!this.password) {
        this.passwordError = 'Password cannot be empty';
        return;
      }
      
      console.log('Submit button clicked');
      if (this.isSignUp) {
        this.signUp();
      } else {
        this.login();
      }
    },
    async login() {
      
      const result=await this.getAccount(this.username)
      console.log(result)
      if(result.find){
        if(result.data.password==this.password){
          //localStorage.setItem('username',this.username)
          sessionStorage.setItem('username',this.username)
          sessionStorage.setItem('token',this.username+"token")
          console.log('Login with:', this.username, this.password);
          this.$router.push('/gas');
        }else{
          alert("wrong password")
        }
      }else{
        if(result.data==404){
          alert("Invalid Username")
        }else{
          alert("Backend Error")
        }
      }
    },
    signUp() {
      if (!this.passwordMismatch) {
        console.log('Sign Up with:', this.username, this.password, this.email);
        // 添加注册逻辑
      }
    },
    toggleSignUp() {
      this.isSignUp = !this.isSignUp;
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.email = '';
      this.passwordMismatch = false;
      this.clearErrors();
    },
    async checkUsername() {
      const result=await this.getAccount(this.username)
      if(result.find){
        this.usernameError="Username has been used"
      }else{
        this.usernameGreat="You can use this usename"
      }
      console.log('Checking if username is available:', this.username);
      // 添加用户名重复检查逻辑，例如请求API
    },
    checkPasswordMismatch() {
      this.passwordMismatch = this.isSignUp && this.password !== this.confirmPassword;
    },
    clearErrors() {
      this.usernameError = '';
      this.passwordError = '';
      this.usernameGreat=''
    },
    async getAccount(name){
      //console.log(name)
      try {
      // 获取数据
      const nameParam = { username: name }; // 将 name 赋值给 nameParam 中的 username
      console.log(nameParam); 
      const response = await apiService.getAccountData(nameParam);
      console.log(response.data) 
      return {find:true,data:response.data[0]}
    } catch (error) {
      this.errorMessage = 'Failed to load data.';
      console.error(error);
      return {find:false,data:error.response.status}
    }
    },
    async newAccount(){

    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.login-page {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top:0px;
  background-image: url('../assets/blue5.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.login-box {
  background: linear-gradient(rgba(90, 90, 90, 0.5), rgba(20, 20, 20, 0.5)) !important;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.login-box label {
  color: white;
}

.login-box p {
  color: white;
  user-select: none;
}

.login-box a {
  color: #add8e6;
}
.login-box h2 {
  color: white;
  user-select: none;
}
.login-box .form-label {
  text-align: left;
  display: block;
  color: white;
  user-select: none;
}
.text-bright-red {
  color: #ff4d4d; /* 更亮的红色 */
}
.text-bright-green {
  color: #15ff00; /* 更亮的红色 */
}
</style>
