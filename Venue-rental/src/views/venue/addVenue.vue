<template>
  <div class="container m-5">
    <form action="#" @submit.prevent="addVenue">
      <h3>新增場地</h3>

      <!-- 註冊表單開始 -->
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>場地名稱</label>
          <input type="text" class="form-control form-control-lg" v-model="venue.venues_name" />
        </div>

        <div class="form-group col-md-6">
          <label>每小時費用</label>
          <input type="text" class="form-control form-control-lg" v-model="venue.price" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-6">
          <label>容納人數</label>
          <input type="text" class="form-control form-control-lg" v-model="venue.capacity" />
        </div>
      </div>
      <button type="submit" class="btn btn-dark btn-lg btn-block">新增</button>
    </form>
  </div>
</template>


<script>
import { db } from '@/config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export default {
  data() {
    return {
      venue: {
        venues_name: "",
        price: "",
        capacity: "",
      },
    };
  },
  methods: {
    async addVenue() {
      try {
        // post 的 Firestore 儲存操作
        await addDoc(collection(db, "venues"), {
          venues_name: this.venue.venues_name,
          price_per_hour: this.venue.price, 
          capacity: this.venue.capacity,
        });

        // 註冊成功後重定向
        this.$router.push("/manage/venues");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>