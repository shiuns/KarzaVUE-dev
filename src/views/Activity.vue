<template>
  <div>
    <!-- 輪播圖 -->
    <div
      id="newActivity"
      class="carousel slide carousel-fade newActivityCarousel"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <div v-for="index in getNewSum" :key="index">
          <button
            v-if="index == 0"
            type="button"
            data-bs-target="#newActivity"
            class="active"
            aria-current="true"
            :data-bs-slide-to="index"
          ></button>
          <button
            v-else
            type="button"
            data-bs-target="#newActivity"
            :data-bs-slide-to="index"
          ></button>
        </div>
      </div>
      <div class="carousel-inner">
        <div v-for="(item, index) in this.newActivity" :key="index">
          <div
            v-if="index == 0"
            class="carousel-item carouselImg active"
            data-bs-interval="1500"
          >
            <router-link :to="'/Activity/' + item.activityId">
              <img :src="item.coverImage" alt="活動圖" />
              <!-- <div class="carousel-caption d-none d-md-block">
                <h5>{{ item.activityName }}</h5>
                <p>{{ item.description.slice(0, 10) }}...</p>
              </div> -->
            </router-link>
          </div>
          <div v-else class="carousel-item carouselImg" data-bs-interval="1500">
            <router-link :to="'/Activity/' + item.activityId">
              <img :src="item.coverImage" alt="活動圖" />
              <!-- <div class="carousel-caption d-none d-md-block">
                <h5>{{ item.activityName }}</h5>
                <p>{{ item.description.slice(0, 10) }}...</p>
              </div> -->
            </router-link>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#newActivity"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#newActivity"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- 介紹 -->
    <div class="py-vh-5 w-100 overflow-hidden">
      <div class="container">
        <div class="col-lg-8" data-aos="fade-down">
          <h4 class="display-6">”攝影教學，讓你學會用鏡頭捕捉生活的瞬間“</h4>
        </div>
        <div class="row d-flex align-items-center">
          <div
            class="col-md-6 col-lg-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span class="h4 fw-lighter">01.</span>
            <h4 class="py-5 border-top border-dark">免費課程</h4>
            <p>加入會員、並填寫資料，即可參加免費教學活動</p>
          </div>

          <div
            class="col-md-6 col-lg-4 py-vh-4 pb-0"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <span class="h4 fw-lighter">02.</span>
            <h4 class="py-5 border-top border-dark">多樣選擇</h4>
            <p>提供多樣的拍攝種類、時間、地區選擇</p>
            <p>透過問與答確認更多活動資訊，找到你有興趣的活動。</p>
          </div>

          <div
            class="col-md-6 col-lg-4 py-vh-6 pb-0"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <span class="h4 fw-lighter">03.</span>
            <h4 class="py-5 border-top border-dark">互動交流</h4>
            <p>與其他攝影愛好者進行互動，分享攝影經驗。</p>
            <p>建立人際關係，並且學習到更多不同的攝影風格和技巧。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ｓｗｉｐｅｒ -->
    <div class="swiperDiv" data-aos="fade-up">
      <div class="container">
        <h4 class="h4">熱門活動</h4>
        <!-- @swiper="onSwiper"
        @slideChange="onSlideChange" -->
        <swiper
          :modules="modules"
          :breakpoints="swiperOptions.breakpoints"
          navigation
          :pagination="{ clickable: true }"
          :scrollbar="{ draggable: true }"
          id="mySlider"
        >
          <swiper-slide v-for="(item, index) in popular" :key="index"
            ><div class="popularCard">
              <router-link
                :to="`/Activity/${item.activityId}`"
                class="popularCardBody"
              >
                <div class="info">
                  <img :src="item.coverImage" alt="" />
                  <div class="content">
                    <p class="activityName">{{ item.activityName }}</p>
                    <p class="description">
                      {{ item.description.slice(0, 15) }}...
                    </p>
                    <p class="date">
                      <i class="fa-solid fa-calendar-days"></i
                      >{{ item.gatheringTime }}
                    </p>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="progressBar">
                    <div :style="{ width: item.enrolmentRate + '%' }"></div>
                    <!-- <div></div> -->
                  </div>

                  <i
                    class="fa-solid fa-people-pulling fs-5"
                    style="color: #8991a9"
                  ></i>
                </div>
              </router-link></div
          ></swiper-slide>
        </swiper>
      </div>
    </div>

    <!-- ｓｗｉｐｅｒ -->
    <div class="swiperDiv" data-aos="fade-up">
      <div class="container">
        <h4 class="h4">即將舉辦</h4>
        <!-- @swiper="onSwiper"
        @slideChange="onSlideChange" -->
        <swiper
          :modules="modules"
          :breakpoints="swiperOptions.breakpoints"
          navigation
          :pagination="{ clickable: true }"
          :scrollbar="{ draggable: true }"
          id="mySlider"
        >
          <swiper-slide v-for="(item, index) in willbeheld" :key="index"
            ><div class="popularCard">
              <router-link
                :to="`/Activity/${item.activityId}`"
                class="popularCardBody"
              >
                <div class="info">
                  <img :src="item.coverImage" alt="" />
                  <div class="content">
                    <p class="activityName">{{ item.activityName }}</p>
                    <p class="description">
                      {{ item.description.slice(0, 15) }}...
                    </p>
                    <p class="date">
                      <i class="fa-solid fa-calendar-days"></i
                      >{{ item.gatheringTime }}
                    </p>
                  </div>
                </div>
              </router-link>
            </div></swiper-slide
          >
        </swiper>
      </div>
    </div>

    <!-- 更多活動 -->
    <div class="searchDiv">
      <div class="searchContent">
        <router-link to="/Activity/Search" class="searchActivity"
          >探索更多活動 <i class="fa-solid fa-magnifying-glass"></i
        ></router-link>
      </div>
    </div>
  </div>
</template>

<script>
//import { RouterLink } from "vue-router";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar } from "swiper";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
//import "swiper/css/scrollbar";
//import "swiper/css/navigation";
import "swiper/css/pagination";
import utility from "../../public/utility.js";
export default {
  mixins: [utility],
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    // const onSwiper = (swiper) => {
    //   console.log(swiper);
    // };
    // const onSlideChange = () => {
    //   console.log("slide change");
    // };

    return {
      // onSwiper,
      // onSlideChange,
      modules: [Navigation, Pagination, Scrollbar],
    };
  },
  data() {
    return {
      newActivity: [],
      popular: [],
      willbeheld: [],
      memberId: 0,
      carousel: [],
      swiperOptions: {
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          576: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },

          1200: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        },
      },
    };
  },
  computed: {
    getNewSum() {
      const carousel = [];
      let carouselItem = 0;
      this.newActivity.forEach((element) => {
        carousel.push(carouselItem);
        carouselItem++;
      });
      console.log(carousel);
      return carousel;
    },
  },
  mounted() {
    // this.scrollToTop();
    this.getNewActivity();
    this.getPopularActivity();
    this.getWillbeheld();
  },
  methods: {
    //#region 取得memberId
    async getMemberId() {
      let id = await this.fetchMemberId();
      this.memberId = id;
    },
    //#endregion

    //#region 取得最新活動（輪播圖用）
    getNewActivity() {
      fetch("https://localhost:7259/api/Activity/New")
        .then((response) => response.json())
        .then((data) => (this.newActivity = data));
    },
    //#endregion

    //#region 取得熱門活動
    async getPopularActivity() {
      fetch("https://localhost:7259/api/Activity/Popular")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.popular = data;
        });
    },
    //#endregion

    //#region 取得即將舉辦活動
    getWillbeheld() {
      fetch("https://localhost:7259/api/Activity/WillBeHeld")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.willbeheld = data;
        });
    },
    //#endregion
  },
};
</script>

<style>
.swiper-pagination {
  position: relative;
  margin-top: 10px;
}
.swiper-pagination-bullet-active {
  background-color: #e9ca89;
}
</style>
<style scoped>
.h500 {
  height: 300px;
}
.h4 {
  text-align: center;
  margin-bottom: 20px;
}

/* 輪播圖 start*/
.newActivityCarousel {
  height: 80vh;
}

.carouselImg img {
  width: 100%;
  height: 80vh;
  object-fit: cover;
}

/* 輪播圖 end*/

/* 熱門活動卡片 start */
.popularCard {
  background-color: #fff;
  height: 170px;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border: 0.5px solid #44444427;
  align-items: center;
}
.popularCard:hover {
  border: 2px solid #8991a947;
  transition: all 0.2s ease-out;
}
.popularCardBody {
  display: flex;
  flex-direction: column;
  width: 100%;
}

a {
  text-decoration: none;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.info img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 15px;
  margin-right: 20px;
}
.activityName {
  padding: 0;
  margin: 0;
  margin-bottom: 5px;
  font-size: 20px;
}
.description,
.date {
  padding: 0;
  margin: 0;
  color: gray;
  font-size: 14px;
}
.date {
  padding: 0;
  margin: 0;
  color: #444;
  font-size: 14px;
}
.date i {
  margin-right: 5px;
  color: #444;
  font-size: 14px;
}

.progressBar {
  background-color: #8991a947;
  height: 8px;
  border-radius: 5px;
  width: 95%;
  margin: 10px 10px 10px 0px;
}
.progressBar div {
  background-color: #8991a9;
  height: 8px;
  border-radius: 5px;
}

/* 熱門活動卡片 end */

.swiperDiv {
  /* background-color: #a6b6b0; */
  height: 350px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.searchDiv {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;

  /* height: 400px; */
  /* background-color: #fff; */
}
.searchDiv:before {
  content: " ";
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
  background-image: url("../assets/activity/pexels-mati-mango-6344884.jpg");
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: cover;
}
.searchContent {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}
.searchActivity {
  height: 100px;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  color: #444;
  font-size: 24px;
  text-align: center;
  background: linear-gradient(
    to right,
    #fcf7f0cb 50%,
    rgba(255, 255, 255, 0.523) 50%
  );
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.5s ease-out;
}

.searchActivity:hover {
  background-position: left bottom;
}
.searchActivity i {
  color: #444;
  padding: 10px;
}
</style>
