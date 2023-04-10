<template>
  <div class="relative">
    <div v-show="!isempty && !isloading">
      <!-- <div class="content"> -->
      <div v-for="(items, month) in groupedEnroll" :key="month">
        <p class="month">{{ month }}</p>
        <div class="list">
          <div v-for="(item, index) in items" :key="index">
            <router-link :to="'/Activity/' + item.activityId">
              <div class="listContent">
                <div class="coverImg">
                  <img :src="item.coverImage" alt="活動圖" />
                </div>
                <div class="info">
                  <p class="activityName">{{ item.activityName }}</p>
                  <p class="description">
                    {{ item.description.slice(0, 20) }}...
                  </p>
                  <p class="date">
                    <i class="fa-solid fa-calendar-days"></i
                    >{{ item.gatheringTime }}
                  </p>
                </div>
              </div>

              <!-- 最後一筆資料不顯示分隔線 -->
              <div class="line" v-show="index + 1 < items.length"></div>
            </router-link>
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <div v-show="isempty && !isloading">沒有待參加的活動</div>
    <div v-show="isloading" class="image-container">
      <img src="../../assets/Spinner-1s-200px-2.gif" alt="" />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import utility from "./../../../public/utility.js";

//const route=useRoute();
export default {
  mixins: [utility],
  // setup() {
  //   const router = useRouter();
  //   console.log(router.path); //取得網址
  //   const currentRoute = router.currentRoute.value.path;
  //   console.log(currentRoute);

  //   return {
  //     currentRoute,
  //   };
  // },
  computed: {
    groupedEnroll() {
      //依照收藏月份分組
      const grouped = {};
      this.enrolledData.forEach((item) => {
        const month = item.dateJoined.substring(0, 7);
        if (!grouped[month]) {
          grouped[month] = [];
        }
        grouped[month].push(item);
      });
      return grouped;
    },
  },
  data() {
    return {
      enrolledData: [],
      isempty: false,
      isloading: true,
    };
  },
  mounted() {
    // this.scrollToTop();
    this.getActivityEnrolled();
  },
  methods: {
    async getActivityEnrolled() {
      this.isempty = false;
      this.isloading = true;
      let memberId = await this.fetchMemberId();
      const data = {
        memberId: memberId,
      };

      fetch("https://localhost:7259/api/ActivityRecord/Enrolled", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          this.isloading = false;
          console.log("Success:", data);
          if (data.length == 0) this.isempty = true;
          this.enrolledData = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style scoped>
@media (max-width: 576px) {
  .coverImg {
    display: none;
  }
}
a {
  text-decoration: none;
}
.line {
  height: 1px;

  background-color: #a3a3a3;
}
.relative {
  position: relative;
  /* height: 100%; */
}
.image-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-container img {
  width: 80%;
  height: auto;
  max-height: 80%;
}
.content {
  padding: 20px 50px;
}
.month {
  padding: 0px;
  margin: 0px;
  margin-bottom: 5px;
  font-size: 15px;
  color: #444;
}
.list {
  background-color: #b9c9d61d;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
}
.listContent {
  margin: 15px 0px 15px 0px;
  display: flex;
  align-items: center;
}
/* .info {
} */

.coverImg {
  width: 110px;
  height: 90px;
  margin-right: 20px;
}
.coverImg img {
  border-radius: 10px;
  border: 0.5px solid gray;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.activityName {
  padding: 0px;
  margin: 0px;
  font-size: 20px;
  font-weight: 500;
}
.description {
  padding: 0px;
  margin: 0px;
  color: gray;
}
.date i {
  color: #444;
  margin-right: 5px;
}
</style>
