<template>
    <div class="max-w-3xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-md p-6">
            <!-- 標題 -->
            <h2 class="text-2xl font-bold text-blue-500 mb-6">
                {{ actionIsEdit ? '編輯公告' : '新增公告' }}
            </h2>

            <!-- 表單 -->
            <form @submit.prevent>
                <div class="grid grid-cols-1 gap-6 mb-6">
                    <!-- 公告日期 -->
                    <div class="form-group">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            公告日期
                        </label>
                        <input type="datetime-local" v-model="news.date"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <!-- 公告內容 -->
                    <div class="form-group">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            公告內容
                        </label>
                        <textarea v-model="news.content" rows="4"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="請輸入公告內容"></textarea>
                    </div>

                    <!-- 發布日期 -->
                    <div class="form-group">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            發布日期
                        </label>
                        <input type="datetime-local" v-model="news.publishDate"
                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <!-- 提交按鈕 -->
                <div class="flex justify-end space-x-4">
                    <button type="button" @click="$router.push('/manage/news')"
                        class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        取消
                    </button>
                    <button v-if="actionIsEdit" type="submit" @click="openEditModal"
                        class="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                        確認編輯
                    </button>
                    <button v-else type="submit" @click="addNews"
                        class="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                        新增公告
                    </button>
                </div>
            </form>
        </div>

        <!-- 編輯確認 Modal -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-900">確認編輯</h3>
                        <button @click="showEditModal = false"
                            class="text-gray-400 hover:text-gray-600 transition-colors">
                            <span class="text-2xl">&times;</span>
                        </button>
                    </div>
                    <div class="mb-6">
                        <p class="text-gray-600">確定要編輯此公告嗎？</p>
                    </div>
                    <div class="flex justify-end space-x-4">
                        <button @click="showEditModal = false"
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            取消
                        </button>
                        <button @click="confirmEdit"
                            class="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                            確認編輯
                        </button>
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
    props: ['newsId'],

    data() {
        return {
            news: {
                date: new Date().toISOString().slice(0, 16), // 預設為今天
                content: "",
                publishDate: new Date().toISOString().slice(0, 16), // 預設為今天
            },
            showEditModal: false,
            actionIsEdit: this.newsId,
        };
    },

    async mounted() {
        if (this.newsId) {
            const docRef = doc(db, "news", this.newsId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                this.news = {
                    date: data.date,
                    content: data.content,
                    publishDate: data.publishDate,
                };
            } else {
                console.log("找不到該公告資料");
            }
        }
    },

    methods: {
        // 將日期時間格式化為 datetime-local 輸入框所需的格式
        formatDateTimeForInput(dateTimeStr) {
            const date = new Date(dateTimeStr);
            return date.toISOString().slice(0, 16); // 格式化為 YYYY-MM-DDTHH:mm
        },
        async addNews() {
            try {
                await addDoc(collection(db, "news"), {
                    date: this.news.date,
                    content: this.news.content,
                    publishDate: this.news.publishDate,
                });
                console.log("公告已新增");
                this.$router.push("/manage/news");
            } catch (error) {
                console.error("新增公告時發生錯誤:", error);
            }
        },

        openEditModal() {
            this.showEditModal = true;
        },

        async confirmEdit() {
            if (this.newsId) {
                try {
                    const docRef = doc(db, "news", this.newsId);
                    await setDoc(docRef, this.news, { merge: true });
                    console.log("公告已編輯");
                    this.$router.push("/manage/news");
                } catch (error) {
                    console.error("編輯公告時發生錯誤:", error);
                }
                this.showEditModal = false;
            }
        },
    },
};
</script>