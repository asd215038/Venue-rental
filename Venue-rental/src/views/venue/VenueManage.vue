<template>
    <div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th v-for="(header, index) in tableHeaders" :key="index" scope="col">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="venue in venues" :key="venue.venueId">
                    <th scope="row">{{ venue.venueId }}</th>
                    <td>{{ venue.venues_name }}</td>
                    <td>{{ venue.price_per_hour }}</td>
                    <td>{{ venue.capacity }}</td>
                    <td><button @click="openEditModal(venue.venueId)">編輯</button></td>
                    <td><button @click="openDeleteModal(venue.venueId)">刪除</button></td>
                </tr>
            </tbody>
        </table>
        <!-- 刪除確認modal -->
        <div v-if="showDeleteModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">確認刪除</h5>
                        <button type="button" class="close" @click="showDeleteModal = false" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>確定要刪除此項目嗎？</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="confirmDelete">確認刪除</button>
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 刪除編輯modal -->
        <div v-if="showDeleteModal" class="modal" tabindex="-1" role="dialog" style="display: block;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">確認編輯</h5>
                        <button type="button" class="close" @click="showDeleteModal = false" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>確定要編輯此項目嗎？</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" @click="confirmDelete">確認編輯</button>
                        <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">取消</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '@/config/firebaseConfig';
import { collection, where, query, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            venues: [],
            tableHeaders: ["場地ID", "場地名稱", "每小時費用", "容納人數", "編輯/刪除"],
            showDeleteModal: false,
            venueIdToDelete: null,
            showEditModal: false,
            venueIdToEdit: null,
        };
    },
    mounted() {
        this.getVenues();
    },
    methods: {
        async getVenues() {
            const querySnapshot = await getDocs(collection(db, "venues"));
            const venues = [];
            querySnapshot.forEach((doc) => {
                let appData = doc.data();
                appData.venueId = doc.id;
                venues.push({
                    venueId: appData.venueId,
                    venues_name: appData.venues_name,
                    price_per_hour: appData.price_per_hour,
                    capacity: appData.capacity,
                });
            });
            this.venues = venues;
            // console.log(this.blogs);
        },
        openDeleteModal(venueId) {
            this.venueIdToDelete = venueId;
            this.showDeleteModal = true;
        },
        async confirmDelete() {
            if (this.venueIdToDelete) {
                try {
                    await deleteDoc(doc(db, "venues", this.venueIdToDelete));
                    console.log("資料已成功刪除！");
                } catch (error) {
                    console.error("刪除資料時發生錯誤:", error);
                }
                this.venueIdToDelete = null;
                this.showDeleteModal = false;
            }
        },
        openEditModal(venueId) {
            this.venueIdToEdit = venueId;
            this.showEditModal = true;
        },
        async confirmEdit() {
            if (this.venueIdToEdit) {
                try {
                    const cityRef = doc(db, 'venues', this.venueIdToEdit);
                    await setDoc(cityRef, { capital: true }, { merge: true });
                    console.log("資料已成功刪除！");
                } catch (error) {
                    console.error("刪除資料時發生錯誤:", error);
                }
                this.venueIdToEdit = null;
                this.showEditModal = false;
            }
        },
    },
}

</script>

<style></style>