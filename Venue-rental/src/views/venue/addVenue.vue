<template>
  <div class="container m-5">
    <form action="#" @submit.prevent>
      <h3 v-if="actionIsEdit">編輯場地</h3>
      <h3 v-else>新增場地</h3>

      <!-- 註冊表單開始 -->
      <div class="form-row">
        <div class="form-group col-md-6">
          <label>場地名稱</label>
          <input type="text" class="form-control form-control-lg" v-model="venue.venues_name" />
        </div>

        <div class="form-group col-md-6">
          <label>每小時費用</label>
          <input type="text" class="form-control form-control-lg" v-model="venue.price_per_hour" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-6">
          <label>容納人數</label>
          <input type="text" class="form-control form-control-lg" v-model="venue.capacity" />
        </div>
      </div>
      <button v-if="actionIsEdit" type="submit" class="btn btn-dark btn-lg btn-block"
        @click="openEditModal(venue.venueId)">編輯</button>
      <button v-else type="submit" class="btn btn-dark btn-lg btn-block" @click="addVenue">新增</button>
    </form>
    <!-- 編輯確認modal -->
    <div v-if="showEditModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">確認編輯</h5>
            <button type="button" class="close" @click="showEditModal = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>確定要編輯此項目嗎？</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="confirmEdit">確認編輯</button>
            <button type="button" class="btn btn-secondary" @click="showEditModal = false">取消</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import { db } from '@/config/firebaseConfig';
import { addDoc, collection, getDoc, doc, setDoc } from 'firebase/firestore';

export default {
  props: ['venueId'],
  data() {
    return {
      venue: {
        venues_name: "",
        price_per_hour: "",
        capacity: "",
      },
      showEditModal: false,
      actionIsEdit: this.venueId,
    };
  },
  async mounted() {
    if (this.venueId) {
      // 如果有 venueId，表示進入編輯模式，載入場地資料
      const docRef = doc(db, "venues", this.venueId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        this.venue = docSnap.data(); // 直接填充到表單資料
      } else {
        console.log("找不到該場地資料");
      }
    }
  },
  methods: {
    async addVenue() {
      try {
        // post 的 Firestore 儲存操作
        await addDoc(collection(db, "venues"), {
          venues_name: this.venue.venues_name,
          price_per_hour: this.venue.price_per_hour,
          capacity: this.venue.capacity,
        });
        console.log("場地資料已新增");

      } catch (error) {
        console.log(error);
      }
    },
    openEditModal() {
      this.showEditModal = true;
    },
    async confirmEdit() {
      console.log(this.venueId)
      if (this.venueId) {
        try {
          const docRef = doc(db, "venues", this.venueId);
          await setDoc(docRef, this.venue, { merge: true });
          console.log("場地資料已編輯");
          this.$router.push("/manage/venue");
        } catch (error) {
          console.error("編輯資料時發生錯誤:", error);
        }
        this.showEditModal = false;
      }
    },
  }
};
</script>