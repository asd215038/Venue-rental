<!-- Carousel.vue -->
<template>
    <div class="w-full flex justify-center">
        <div class="relative w-4/5 h-96 overflow-hidden ">
            <!-- Carousel container -->
            <div class="relative h-full">
                <!-- Slides -->
                <div v-for="(slide, index) in slides" :key="index"
                    class="absolute w-full h-full transition-transform duration-500 ease-in-out" :class="{
                        'translate-x-0': currentSlide === index,
                        'translate-x-full': currentSlide < index,
                        '-translate-x-full': currentSlide > index
                    }">
                    <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />
                    <!-- Caption -->
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                        <h3 class="text-xl font-semibold">{{ slide.title }}</h3>
                        <p class="text-sm">{{ slide.description }}</p>
                    </div>
                </div>

                <!-- Navigation buttons -->
                <button @click="prevSlide"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button @click="nextSlide"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <!-- Indicators -->
                <div class="absolute bottom-20 left-0 right-0 flex justify-center space-x-2">
                    <button v-for="(_, index) in slides" :key="index" @click="goToSlide(index)"
                        class="w-3 h-3 rounded-full focus:outline-none transition-colors duration-200"
                        :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Carousel',
    data() {
        return {
            currentSlide: 0,
            slides: [],
            autoplayInterval: null
        }
    },
    mounted() {
        this.getPictures();
        this.startAutoplay();
    },
    beforeDestroy() {
        this.stopAutoplay()
    },
    methods: {
        async getPictures() {
            try {
                // 取得所有圖片檔案
                const images = import.meta.glob('../assets/images/carousel/*.{png,jpg,jpeg,PNG,JPEG}', {
                    eager: true,
                    as: 'url'
                });

                // 處理每個圖片
                for (const path in images) {
                    // 從路徑中提取檔名
                    const fileName = path.split('/').pop(); // 獲取最後一個部分（檔名）
                    const title = fileName.split('.')[0]; // 移除副檔名

                    // 格式化標題（可選：將檔名格式化為更好看的標題）
                    const formattedTitle = title
                        .replace(/[-_]/g, ' ') // 將破折號和底線替換為空格
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');

                    // 添加到輪播清單
                    this.slides.push({
                        image: images[path],
                        title: formattedTitle,
                        description: `Image of ${formattedTitle}` // 您可以根據需要修改描述的格式
                    });
                }
            } catch (error) {
                console.error('Error loading images:', error);
            }
        },
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length
        },
        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
        },
        goToSlide(index) {
            this.currentSlide = index
        },
        startAutoplay() {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide()
            }, 5000) // Change slide every 5 seconds
        },
        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval)
            }
        }
    }
}
</script>