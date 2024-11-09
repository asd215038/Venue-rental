<template>
  <div class="container m-5">
    <form action="#" @submit.prevent="registerAndPost">
      <h3>註冊</h3>
      <div class="form-group">
        <label>名子</label>
        <input type="text" class="form-control form-control-lg" v-model="user.userName" />
      </div>

      <div class="form-group">
        <label>信箱</label>
        <input type="text" class="form-control form-control-lg" v-model="user.email" />
      </div>

      <div class="form-group">
        <label>密碼</label>
        <input type="text" class="form-control form-control-lg" v-model="user.password" />
      </div>

      <div class="form-group">
        <label>密碼</label>
        <input type="text" class="form-control form-control-lg" v-model="user.phoneNumber" />
      </div>

      <button type="submit" class="btn btn-dark btn-lg btn-block">
        註冊
      </button>

      <p class="forgot-password text-right">
        已經註冊過了?
        <router-link to="/login">登入</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { addDoc, setDoc, doc, collection } from 'firebase/firestore';

export default {
  data() {
    return {
      user: {
        userName: "",
        isAdmin: false,
        email: "",
        password: "",
        enabled: false,
        phoneNumber: "",
      },
    };
  },
  methods: {
    async registerAndPost() {
      try {
        // 先執行 handleRegister 的功能
        await this.$store.dispatch('register', {
          email: this.user.email,
          password: this.user.password,
          name: this.user.userName
        });
        // 成功後執行 post 的 Firestore 儲存操作
        await addDoc(collection(db, "users"), {
          userName: this.user.userName,
          isAdmin: this.user.isAdmin,
          email: this.user.email,
          password: this.user.password,
          enabled: this.user.enabled,
          phoneNumber: this.user.phoneNumber,
        });

        // 註冊成功後重定向
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>