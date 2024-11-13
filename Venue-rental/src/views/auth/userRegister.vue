<template>
  <div class="container m-5">
    <form action="#" @submit.prevent="registerAndPost">
      <h3>註冊</h3>

      <!-- 註冊表單開始 -->
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>姓名</label>
          <input type="text" class="form-control form-control-lg" v-model="user.userName" />
        </div>

        <div class="form-group col-md-6">
          <label>信箱</label>
          <input type="email" class="form-control form-control-lg" v-model="user.email" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-6">
          <label>密碼</label>
          <input type="password" class="form-control form-control-lg" v-model="user.password" />
        </div>

        <div class="form-group col-md-6">
          <label>確認密碼</label>
          <input type="password" class="form-control form-control-lg" v-model="confirmPassword" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-6">
          <label>手機號碼</label>
          <input type="text" class="form-control form-control-lg" v-model="user.phoneNumber" />
        </div>

        <div class="form-group col-md-6">
          <label>性別</label>
          <select class="form-control form-control-lg" v-model="user.gender">
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-4">
          <label>出生年份</label>
          <select class="form-control form-control-lg" v-model="user.birthYear">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        <div class="form-group col-md-4">
          <label>出生月份</label>
          <select class="form-control form-control-lg" v-model="user.birthMonth">
            <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
          </select>
        </div>

        <div class="form-group col-md-4">
          <label>出生日期</label>
          <select class="form-control form-control-lg" v-model="user.birthDay">
            <option v-for="day in daysInMonth" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>
      </div>

      <button type="submit" class="btn btn-dark btn-lg btn-block">註冊</button>

      <p class="forgot-password text-right">
        已經註冊過了?
        <router-link to="/login">登入</router-link>
      </p>
    </form>
  </div>
</template>


<script>
import { db } from '@/config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

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
        gender: "",
        birthYear: "",
        birthMonth: "",
        birthDay: ""
      },
      confirmPassword: "",
      years: Array.from({ length: 35 }, (_, i) => 1990 + i)
    };
  },
  computed: {
    daysInMonth() {
      const year = this.user.birthYear || 1990;
      const month = this.user.birthMonth || 1;
      return new Date(year, month, 0).getDate();
    }
  },
  methods: {
    async registerAndPost() {
      if (this.user.password !== this.confirmPassword) {
        alert("密碼不一致，請確認密碼。");
        return;
      }

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
          gender: this.user.gender,
          birthDate: `${this.user.birthYear}-${this.user.birthMonth}-${this.user.birthDay}`
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
