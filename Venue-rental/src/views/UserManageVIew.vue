<template>
  <table class="table table-striped">
  <thead>
    <tr>
      <th v-for="(header, index) in tableHeaders" :key="index" scope="col">{{ header }}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="user in users" :key="user.userId">
      <th scope="row">{{ user.userId }}</th>
      <td>{{ user.userName }}</td>
      <td>{{ user.isAdmin }}</td>
      <td>{{ user.email }}</td>
      <td>{{ user.password }}</td>
      <td>{{ user.enabled }}</td>
      <td>{{ user.phoneNumber }}</td>
    </tr>
  </tbody>
</table>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { collection, where, query, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      users: [],
      tableHeaders: ["使用者ID", "使用者名稱", "是否為管理員", "電子郵件", "密碼", "帳號是否啟用", "聯絡電話"]
    };
  },
  computed: {
    user() {
      console.log(this.$store.state.user)
      return this.$store.state.user
    },
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        let appData = doc.data();
        appData.userId = doc.id;
        users.push({
          userId: appData.userId,
          userName: appData.userName,
          isAdmin: appData.isAdmin,
          email: appData.email,
          password: appData.password,
          enabled: appData.enabled,
          phoneNumber: appData.phoneNumber,
        });
      });
      this.users = users;
      // console.log(this.blogs);
    },
  },
}

</script>

<style>

</style>
