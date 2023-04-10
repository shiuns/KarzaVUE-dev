<template>
  <div class="container">
    <div class="searchPage">
      <h4 class="align-self-center mt-4">活動總覽</h4>
      <div class="row inputSearch">
        <div class="col-lg-3 col-md-4 col-12">
          <input
            v-model="input.activityName"
            @change="fetchActivityData"
            class="inputName"
            name="activityName"
            id="activityName"
            type="text"
            placeholder="輸入活動名稱關鍵字..."
            autocomplete="off"
          />
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <select
            @change="fetchActivityData"
            v-model="input.categoryId"
            class="inputCategory"
            name="categoryId"
            id="categoryId"
          >
            <option value="" disabled>選擇拍攝類型</option>
            <option value="0">所有拍攝類型</option>
            <option
              v-for="option in categoryOption"
              :key="option.categoryName"
              :value="option.id"
            >
              {{ option.categoryName }}
            </option>
          </select>
        </div>
        <div class="col-lg-2 col-md-4 col-6">
          <select
            @change="fetchActivityData"
            v-model="input.address"
            class="inputAddress"
            name="address"
            id="adress"
          >
            <option disabled>選擇地區</option>
            <option value="" selected>所有地區</option>
            <option value="基隆市">基隆市</option>
            <option value="台北市">台北市</option>
            <option value="新北市">新北市</option>
            <option value="桃園市">桃園市</option>
            <option value="新竹市">新竹市</option>
            <option value="新竹縣">新竹縣</option>
            <option value="苗栗縣">苗栗線</option>
            <option value="台中市">台中市</option>
            <option value="彰化縣">彰化縣</option>
            <option value="南投縣">南投縣</option>
            <option value="雲林縣">雲林縣</option>
            <option value="嘉義市">嘉義市</option>
            <option value="嘉義縣">嘉義縣</option>
            <option value="台南市">台南市</option>
            <option value="高雄市">高雄市</option>
            <option value="屏東縣">屏東縣</option>
            <option value="宜蘭縣">宜蘭縣</option>
            <option value="花蓮縣">花蓮縣</option>
            <option value="台東縣">台東縣</option>
            <option value="澎湖縣">澎湖縣</option>
            <option value="金門縣">金門縣</option>
            <option value="連江縣">連江縣</option>
          </select>
        </div>
        <div class="col-lg-5 col-md-12 col-12">
          <input
            @change="fetchActivityData"
            v-model="input.time"
            :min="minDate"
            class="inputTime"
            name="time"
            type="datetime-local"
            id="inputTime"
          />

          之後的活動
        </div>
      </div>

      <div v-show="!isempty && !isloading" class="row" id="resultCard">
        <div
          v-for="(card, index) in result"
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-xl-3"
        >
          <div class="card" :activityId="card.activityId">
            <div class="card-header">
              <router-link :to="'/Activity/' + card.activityId"
                ><img :src="card.coverImage" alt="cover"
              /></router-link>
            </div>
            <div class="card-body">
              <h5>{{ card.activityName }}</h5>
              <p>
                <i class="fa-solid fa-calendar-days"></i
                >{{ card.gatheringTime }}
              </p>
              <p>
                <i class="fa-solid fa-map-pin"></i
                ><a
                  @click="Citytag(card.city)"
                  class="addressTag"
                  :city="card.city"
                  >{{ card.city }}</a
                >
              </p>
              <span class="tag"
                ><a
                  @click="Categorytag(card.categoryId)"
                  class="categoryTag"
                  :categoryId="card.categoryId"
                  >{{ card.categoryName }}</a
                >
              </span>
            </div>
            <div class="info">
              <div class="enroll">
                <i class="fa-solid fa-user"></i>
                <p class="num">{{ card.numOfEnrolment }}</p>
              </div>

              <div class="save">
                <!-- 未登入 -->
                <button
                  v-if="this.input.memberId == 0"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                  type="button"
                  class="saveBtn1"
                  :activityId="card.activityId"
                >
                  <i class="fa-regular fa-bookmark"></i>
                </button>
                <!-- 登入沒收藏 -->
                <button
                  @click="
                    save($event, index, card.activityId, this.input.memberId)
                  "
                  v-else-if="card.statusId == 3 && this.input.memberId != 0"
                  type="button"
                  class="saveBtn"
                >
                  <i class="fa-regular fa-bookmark"></i>
                </button>
                <!-- 登入有收藏 -->
                <button
                  v-else-if="card.statusId == 4 && this.input.memberId != 0"
                  @click="unsave($event, index, card.unSaveId)"
                  type="button"
                  class="unsaveBtn"
                >
                  <i class="fa-solid fa-bookmark"></i>
                </button>

                <p class="num">{{ card.numOfCollections }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="isempty" class="nothingPage">找不到符合的資料</div>
      <div v-show="isloading" class="image-container">
        <img src="../../assets/Spinner-1s-200px-2.gif" alt="" />
      </div>
      <!-- <div class="d-flex justify-content-center"><loginModal /></div> -->
    </div>
  </div>
</template>
<script>
// import loginModal from "./../../components/loginModal.vue";
import utility from "./../../../public/utility.js";
export default {
  mixins: [utility],
  data() {
    return {
      input: {
        activityName: "",
        categoryId: 0,
        address: "",
        time: new Date(),
        memberId: 0,
      },
      result: [],
      minDate: new Date(),
      categoryOption: [],
      isloading: true,
      isempty: true,
      // isShow: false,
    };
  },
  mounted() {
    //取得memberId
    this.getMemberId();

    //滑到最上面
    //  this.scrollToTop();

    //取得分類選單
    this.getCategory();

    //設定日期最小值和預設值
    this.setTime();

    // 获取 JSON 数据
    this.fetchActivityData();

    //卡片上的address tag點到時
    this.$nextTick(() => {
      this.result.forEach((city) => {
        const button = this.$el.querySelector(".addressTag");
        button.addEventListener("click", () => {
          this.Citytag(city);
        });
      });
    });

    // 卡片上的categoryTag tag點到時
    this.$nextTick(() => {
      this.result.forEach((categoryId) => {
        const button = this.$el.querySelector(".categoryTag");
        button.addEventListener("click", () => {
          this.Categorytag(categoryId);
        });
      });
    });
  },
  methods: {
    //#region 取得活動資訊、設定搜尋結果狀態

    async fetchActivityData() {
      this.isloading = true;
      this.isempty = false;
      let memberId = await this.getMemberId();
      let queryParams = {
        activityName: this.input.activityName,
        categoryId: this.input.categoryId,
        address: this.input.address,
        time: this.input.time,
        memberId: memberId,
      };
      console.log(queryParams);
      let queryStr = "https://localhost:7259/api/Activity/Search?";
      if (queryParams.activityName !== "")
        queryStr += `activityName=${queryParams.activityName}&`;
      if (queryParams.categoryId !== 0)
        queryStr += `categoryId=${queryParams.categoryId}&`;
      if (queryParams.address !== "")
        queryStr += `address=${queryParams.address}&`;

      queryStr += `time=${queryParams.time}&`;
      queryStr += `memberId=${queryParams.memberId}`;
      console.log(queryStr);
      this.isempty = false;
      const response = await fetch(queryStr);
      const data = await response.json();
      this.isloading = false;
      this.result = data;

      if (data.length == 0) {
        this.isempty = true;
      }
    },
    //#endregion

    //#region 設定時間欄位得最大值和預設值
    setTime() {
      let now = new Date(); //取得目前時間
      let time = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        min: now.getMinutes(),
      };

      //拿到格式是xxxx-xx-xxTxx:xx:xx的日期字串
      if (time.month < 10) time.month = `0${time.month}`;
      if (time.day < 10) time.day = `0${time.day}`;
      if (time.hour < 10) time.hour = `0${time.hour}`;
      if (time.min < 10) time.min = `0${time.min}`;
      let timeStr = `${time.year}-${time.month}-${time.day}T${time.hour}:${time.min}`;

      this.input.time = timeStr;
      this.minDate = timeStr;
    },
    //#endregion

    //#region 點選地區tag時重設輸入欄位並重新取得資料
    Citytag(city) {
      this.input.address = city;
      this.input.activityName = "";
      this.input.categoryId = 0;
      this.setTime();
      this.fetchActivityData();
    },
    //#endregion

    //#region 點選分類tag時重設輸入欄位並重新取得資料
    Categorytag(categoryId) {
      this.input.address = "";
      this.input.activityName = "";
      this.input.categoryId = categoryId;
      this.setTime();
      this.fetchActivityData();
    },
    //#endregion

    //#region getMemberId()設定、回傳memberId 預設=0
    async getMemberId() {
      let Id = 0;
      let token = $.cookie("token");
      let options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        let response = await fetch(
          "https://localhost:7259/api/Members/Read",
          options
        );
        let data = await response.json();
        console.log(data);
        Id = data;
        this.input.memberId = Id;
        return Id;
      } catch (error) {
        console.log("未登入");
        this.input.memberId = Id;
        return Id;
      }
    },
    //#endregion

    //#region 取得分類
    async getCategory() {
      let response = await fetch(
        "https://localhost:7259/api/Activity/Category"
      );
      let data = await response.json();
      this.categoryOption = data;
    },
    //#endregion

    //#region 收藏活動
    save(event, index, activityId, memberId) {
      event.stopPropagation();
      //取得點到的按鈕
      let saveBtn;
      if (event.target.tagName.toLowerCase() === "button") {
        saveBtn = event.target;
      } else if (event.target.tagName.toLowerCase() === "i") {
        saveBtn = event.currentTarget;
      }
      //收藏數+1
      this.result[index].numOfCollections++;

      //更改按鈕圖示
      saveBtn.innerHTML = `<i style="width: 16px;
        color: #444;
        margin-right: 10px;"
        class="fa-solid fa-bookmark"></i>`;

      //收藏
      let saveData = {
        memberId: memberId,
        activityId: activityId,
      };
      fetch("https://localhost:7259/api/ActivitySave/Save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);

          //回傳成功收藏=>更改狀態
          if (data.result) {
            this.result[index].statusId = 4;
            this.result[index].unSaveId = data.activityCollectionId;
            this.showAlert(data.message);
          } else {
            this.showAlert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    //#endregion

    //#region 取消收藏活動
    unsave(event, index, deleteId) {
      event.stopPropagation();

      //收藏數減1
      this.result[index].numOfCollections--;
      let unsaveBtn;
      if (event.target.tagName.toLowerCase() === "button") {
        unsaveBtn = event.target;
      } else if (event.target.tagName.toLowerCase() === "i") {
        unsaveBtn = event.currentTarget;
      }

      unsaveBtn.innerHTML = `<i style="width: 16px;color: #444444;margin-right: 10px;" 
                                class="fa-regular fa-bookmark"></>`;

      fetch("https://localhost:7259/api/ActivitySave/UnSave/" + deleteId, {
        method: "Delete",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (data.result) {
            //更改狀態
            this.result[index].statusId = 3;
            this.result[index].unSaveId = 0;
            this.showAlert(data.message);
          } else {
            this.showAlert(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    //#endregion
  },
};
</script>

<style scoped>
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
.nothingPage {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchPage {
  display: flex;
  flex-direction: column;
}
.card {
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  border: 0px;
  box-shadow: 0;
  border: 1px solid #8991a947;
  /* height: 300px; */
}
.card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-out;
}
.card-header {
  width: 100%;
  height: 200px;
}
.card-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-header {
  padding: 0px;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px;
  overflow: auto;
  /* min-height: 200px;
  max-height:250px ; */
}
.card-body a {
  color: #070707;
  text-decoration: none;
  cursor: pointer;
}
.tag {
  background: #a6b6b0;
  border-radius: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #fff;
  padding: 1px 5px;
  cursor: pointer;
}
.tag a {
  color: #fff;
  text-decoration: none;
}

.info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
}
.info .enroll,
.info .save {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
p {
  padding: 0px;
  margin: 0%;
}

.saveBtn,
.unsaveBtn,
.saveBtn1 {
  padding: 0px;
  border: 0px;
  background-color: transparent;
}
i {
  width: 16px;
  color: #444444;
  margin-right: 10px;
}

/* search bar */
.inputSearch {
  border-radius: 10px;
  border: 1px solid #fcf7f0;
  background-color: #ffffffe2;
  max-width: 780px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto;
  min-height: 60px;
}
.inputName,
.inputCategory,
.inputAddress,
.inputTime {
  height: 40px;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  border: 0px;
  color: #444444;
}
.inputName {
  width: 200px;
}

/* result card */
</style>
