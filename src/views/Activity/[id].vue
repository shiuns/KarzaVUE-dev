<template>
  <div class="container">
    <div class="detailpage">
      <div v-show="!isloading && details.activityName != null">
        <div class="row justify-content-center m-4">
          <div class="col-12 col-md-6" id="activityimg">
            <img class="coverImage" :src="details.coverImage" alt="" />
          </div>
          <div class="col-12 col-md-6" id="activityinfo">
            <p class="activityName">{{ details.activityName }}</p>
            <p>拍攝類型：{{ details.categoryName }}</p>
            <p>建議器材：{{ details.recommendation }}</p>
            <p>活動時間：{{ details.gatheringTime }}</p>
            <p>
              集合地點：<span id="destination">{{ details.address }}</span>
            </p>
            <p>
              活動名額：{{ details.memberLimit }}人 || 剩餘<span
                style="color: #d39899"
                >{{ details.memberLimit - details.numOfEnrolment }}</span
              >人
            </p>
            <p>報名截止日：{{ details.deadline }}</p>
            <div class="buttonList mt-2">
              <!-- v-if -->
              <!-- 活動已舉辦、且未收藏 -->
              <button
                v-if="this.saveStatus.statusId == 2"
                class="saveBtn1"
                disabled
              >
                <i class="fa-regular fa-bookmark"></i>
              </button>
              <!-- 活動未舉辦可收藏 （有登入可收藏）-->
              <button
                v-else-if="this.saveStatus.statusId == 3 && this.memberId != 0"
                @click="save($event, this.saveStatus.activityId, this.memberId)"
                class="saveBtn"
              >
                <i class="fa-regular fa-bookmark"></i>
              </button>

              <!-- 活動未舉辦可收藏 （無登入可收藏）-->
              <button
                v-else-if="this.saveStatus.statusId == 3 && this.memberId == 0"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                type="button"
                class="saveBtn1"
              >
                <i class="fa-regular fa-bookmark"></i>
              </button>

              <!-- 活動未舉辦已收藏--><!-- 活動未舉辦已收藏-->
              <button
                v-else-if="
                  this.saveStatus.statusId == 4 || this.saveStatus.statusId == 5
                "
                @click="unsave($event, saveStatus.unSaveId)"
                type="button"
                class="unsaveBtn"
                :deleteId="saveStatus.unSaveId"
              >
                <i class="fa-solid fa-bookmark"></i>
              </button>

              <!-- v-if -->

              <button
                v-if="this.enrollStatus.statusId == 2"
                class="enrollBtn1"
                disabled
              >
                報名已截止
              </button>

              <button
                v-else-if="this.enrollStatus.statusId == 3"
                class="enrollBtn1"
                disabled
              >
                已額滿
              </button>

              <!-- 活動可報名未登入 -->
              <button
                v-else-if="
                  this.enrollStatus.statusId == 4 && this.memberId == 0
                "
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                type="button"
                class="enrollBtn1"
              >
                報名活動
              </button>

              <button v-else-if="this.enrollLoading" class="enrollBtn">
                <img
                  style="height: 100%; object-fit: cover"
                  src="../../assets/activity/Ellipsis-1s-200px.gif"
                  alt=""
                />
              </button>
              <!-- 活動可報名有登入 -->
              <button
                v-else-if="
                  this.enrollStatus.statusId == 4 && this.memberId != 0
                "
                type="button"
                class="enrollBtn"
                @click="enroll($event)"
              >
                報名活動
              </button>

              <!-- 已報名 -->
              <button
                v-else-if="this.enrollStatus.statusId == 5"
                type="button"
                class="unenrollBtn"
                :deleteId="this.enrollStatus.deleteId"
                @click="unenroll(this.enrollStatus.deleteId)"
              >
                取消報名（已報名）
              </button>
            </div>
          </div>
        </div>

        <div class="row justify-content-center m-4">
          <div class="col-12 col-md-6">
            <h5>活動說明</h5>
            <div id="description" class="description">
              {{ details.activityDescription }}
            </div>
          </div>
          <div class="col-12 col-md-6">
            <h5>講師資訊</h5>
            <div
              id="instructorCard"
              class="d-flex justify-content-center align-items-center"
            >
              <div class="instructorCard">
                <div
                  class="instructorPhoto d-flex justify-content-center align-items-center"
                >
                  <img
                    :src="details.resumePhoto"
                    alt=""
                    referrerpolicy="no-referrer"
                  />
                </div>
                <div
                  class="instructorInfo d-flex flex-column justify-content-around align-items-center"
                >
                  <p class="instrutorName">{{ details.instructorName }}</p>
                  <p class="instructorDes">
                    {{ details.instructorDescription }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center m-4">
          <div class="col">
            <h5 @click="demoMap">查看路線</h5>
            <div class="panel" id="floating-panel">
              <label for="mode">交通方式： </label>
              <select v-model="map.selectedMode" id="mode" class="mode">
                <option value="" selected disabled>選擇交通方式</option>
                <option value="DRIVING">開車</option>
                <option value="WALKING">走路</option>
                <option value="BICYCLING">腳踏車</option>
                <option value="TRANSIT">大眾運輸</option>
              </select>
              <!-- <label for="origin">出發地點： </label> -->
              <input
                placeholder="輸入出發地點..."
                v-model="map.origin"
                type="text"
                id="origin"
                class="origin"
                autocomplete="off"
              />
              <button class="geoBtn" @click="getLocation" id="geo">
                使用目前位置
              </button>
            </div>
            <div v-show="routes != ''" class="routes">{{ routes }}</div>
            <div id="map"></div>
          </div>
        </div>

        <div class="row justify-content-center m-4">
          <div class="col">
            <h5 @click="demoQ">問與答</h5>

            <div v-if="QandA.length > 0">
              <div
                v-for="(item, index) in QandA"
                :key="index"
                :qid="QandA.QId"
                class="QandA"
                id="question"
              >
                <div v-if="item.memberId != this.memberId" class="QAlist">
                  <div>
                    <div class="question">
                      <div class="user d-flex align-items-center">
                        <router-link
                          class="d-flex align-items-center"
                          :to="
                            '/Community/PersonalPage/' +
                            item.memberId +
                            '/Photos/'
                          "
                        >
                          <img
                            v-if="item.photoSticker"
                            class="quser"
                            :src="
                              'https://localhost:7259/Images/' +
                              item.photoSticker
                            "
                            alt=""
                          />
                          <img
                            v-else
                            class="quser"
                            src="../../../src/assets/userPic.png"
                            alt=""
                          />
                          <p class="ms-4">{{ item.nickName }}</p>
                        </router-link>
                      </div>

                      <div class="qcontent">
                        <p>{{ item.qContent }}</p>
                      </div>
                      <div class="date">{{ item.qDateCreated }}</div>
                    </div>
                  </div>
                  <div v-if="item.aId != null" class="answer mt-3">
                    回覆
                    <div class="acontent">
                      <p>{{ item.aContent }}</p>
                    </div>
                    <div class="date">{{ item.aDateCreated }}</div>
                  </div>
                </div>
                <div
                  v-else-if="item.memberId == this.memberId"
                  class="myQAlist"
                >
                  <div>
                    <div>
                      <div class="myquestion">
                        <div class="user d-flex align-items-center">
                          <router-link
                            class="d-flex align-items-center"
                            :to="
                              '/Community/PersonalPage/' +
                              item.memberId +
                              '/Photos/'
                            "
                          >
                            <img
                              v-if="item.photoSticker"
                              class="quser"
                              :src="
                                'https://localhost:7259/Images/' +
                                item.photoSticker
                              "
                              alt=""
                            />
                            <img
                              v-else
                              class="quser"
                              src="../../../src/assets/userPic.png"
                              alt=""
                            />
                            <p class="ms-4">{{ item.nickName }}</p>
                          </router-link>
                          <button
                            @click="deleteQ(item.qId, index)"
                            class="deleteQcontent"
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </div>

                        <div class="myqcontent">
                          <p>{{ item.qContent }}</p>
                        </div>
                        <div class="date">{{ item.qDateCreated }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.aId != null" class="myanswer mt-3">
                    回覆
                    <div class="myacontent">
                      <p>{{ item.aContent }}</p>
                    </div>
                    <div class="date">{{ item.aDateCreated }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="askInput d-flex mt-4">
              <textarea
                v-model="askContent"
                @keydown="errmsg"
                name="content"
                id="askcontent"
                class="askContent"
                maxlength="300"
                placeholder="提出和此活動有關的問題！"
              ></textarea>

              <button
                v-if="this.memberId != 0"
                @click="ask"
                class="askBtn"
                id="ask"
              >
                發問
              </button>
              <button
                v-else
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                class="askBtn"
                id="ask"
              >
                發問
              </button>
            </div>
            <p class="qerromsg">{{ qerromsg }}</p>
          </div>
        </div>

        <div class="row justify-content-center m-4">
          <div v-if="sameCategory.length > 0" class="col" id="sameCategory">
            <div>
              <h5>同類型推薦</h5>
            </div>
            <div class="row" id="sameCategoryCard">
              <div
                v-for="(e, index) in sameCategory"
                :key="index"
                class="col-12 col-md-6"
              >
                <router-link :to="'/Activity/' + e.activityId" class="sameLink">
                  <div class="sameList">
                    <div>
                      <img
                        class="sameImg"
                        :src="e.coverImage"
                        alt="活動封面圖"
                      />
                    </div>

                    <div class="sameInfo">
                      <p class="activityName">{{ e.activityName }}</p>
                      <p class="samedate">
                        <i class="fa-solid fa-calendar-days"></i
                        >{{ e.gatheringTime }}
                      </p>
                      <p class="ellipsis">{{ e.description.slice(0, 8) }}...</p>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="isloading" class="image-container">
        <img src="../../assets/Spinner-1s-200px-2.gif" alt="" />
      </div>
      <div v-if="!isloading && details.activityName == null">沒有此活動</div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import utility from "./../../../public/utility.js";
export default {
  mixins: [utility],
  watch: {
    $route(to, from) {
      // 當路由切換時，這個監聽器會被觸發
      // 可以在這裡執行某些操作，例如更新數據
      this.geo = null;
      this.map = {
        selectedMode: "TRANSIT",
        origin: null,
      };
      this.routes = "";
      this.initMap();
      // this.scrollToTop();
      this.getMemberId();
      this.fetchDetails();
      this.getEnroll();
      this.getSave();
      this.getQandA();
      this.getSameCategory();

      console.log("路由發生了變化：", to.path, from.path);
    },
  },
  data() {
    return {
      enrollLoading: false,
      details: {},
      saveStatus: {},
      enrollStatus: {},
      QandA: [],
      sameCategory: [],
      map: {
        selectedMode: "TRANSIT",
        origin: null,
      },
      memberId: 0,
      isloading: true,
      askContent: "",
      qerromsg: "",
      latitude: null,
      longitude: null,
      geo: null,
      routes: "",
    };
  },
  created() {
    // this.scrollToTop();
    this.getMemberId();

    this.fetchDetails();
    this.getEnroll();
    this.getSave();
    this.getQandA();
    this.getSameCategory();
  },
  mounted() {
    this.initMap();
  },
  methods: {
    //#region 取得memberId&activityId
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
        this.memberId = Id;
        return Id;
      } catch (error) {
        console.log("未登入");
        this.memberId = Id;
        return Id;
      }
    },
    //#endregion

    //#region 取得活動資訊
    async fetchDetails() {
      let activityId = this.$route.path.slice(10);
      let response = await fetch(
        "https://localhost:7259/api/Activity/Details/?activityId=" + activityId
      );
      let details = await response.json();
      let categoryId = parseInt(details.categoryId);
      //console.log(details);
      this.details = details;
      return categoryId;

      //console.log(this.categoryId)
    },
    //#endregion

    //#region 地圖
    async getLocation() {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.geo = pos;
          console.log(this.geo);
          this.map.origin = "使用目前位置";

          this.initMap();
        });
      } catch (error) {
        console.error("Geolocation is not supported by this browser.");
      }
    },
    initMap() {
      // 載入路線服務與路線顯示圖層
      const directionsRenderer = new google.maps.DirectionsRenderer();
      const directionsService = new google.maps.DirectionsService();

      // 初始化地圖
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 23.5, lng: 121 },
      });

      directionsRenderer.setMap(map);
      this.calculateAndDisplayRoute(directionsService, directionsRenderer);

      document
        .getElementById("floating-panel")
        .addEventListener("change", () => {
          this.calculateAndDisplayRoute(directionsService, directionsRenderer);
        });
      // document
      // .getElementById("geo")
      // .addEventListener("click", () => {
      //   this.calculateAndDisplayRoute(directionsService, directionsRenderer);
      // });
    },
    calculateAndDisplayRoute(directionsService, directionsRenderer) {
      const destination = this.details.address;
      let selectedMode = this.map.selectedMode;
      let origin = this.map.origin;
      //有開定位且沒輸入起點
      if (this.geo != null && this.map.origin == "使用目前位置") {
        origin = this.geo;
        console.log("使用目前位置");
      }

      // 繪製路線
      directionsService
        .route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode[selectedMode],
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          let legs = response.routes[0]["legs"][0];
          console.log(legs);
          let distance = legs.distance.text;
          let duration = legs.duration.text;
          console.log(distance, duration);
          this.routes = `距離${distance}，花費${duration}`;
        })
        .catch((e) =>
          console.log("Directions request failed due to " + status)
        );
    },
    //#endregion

    //#region 取得報名狀態
    async getEnroll() {
      this.isloading = true;
      let memberId = await this.getMemberId();
      const enrolldata = {
        memberId: memberId,
        activityId: this.$route.path.slice(10),
      };

      let response = await fetch(
        "https://localhost:7259/api/ActivityEnroll/EnrollStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enrolldata),
        }
      );
      let data = await response.json();
      this.isloading = false;
      console.log("報名狀態:", data);
      this.enrollStatus = data;
    },
    //#endregion

    //#region 取得收藏狀態
    async getSave() {
      const savedata = {
        memberId: await this.getMemberId(),
        activityId: this.$route.path.slice(10),
      };
      let response = await fetch(
        "https://localhost:7259/api/ActivitySave/SaveStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(savedata),
        }
      );
      let data = await response.json();

      console.log("Success:", data);
      this.saveStatus = data;
    },
    //#endregion

    //#region 取得問與答
    async getQandA() {
      let activityId = this.$route.path.slice(10);
      let response = await fetch(
        "https://localhost:7259/api/ActivityQnA/Get/" + activityId
      );
      let data = await response.json();
      this.QandA = data;

      console.log("問與答", data);
    },
    //#endregion

    //#region 問與答輸入提示在文字輸入時不顯示
    errmsg() {
      this.qerromsg = "";
    },
    //#endregion

    //#region 取得同類活動推薦
    async getSameCategory() {
      let categoryId = await this.fetchDetails();
      let memberId = await this.getMemberId();
      let categoryData = {
        memberId: memberId,
        categoryId: categoryId,
        activityId: this.$route.path.slice(10),
      };

      //console.log(categoryId);
      let response = await fetch(
        "https://localhost:7259/api/Activity/SameCategory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        }
      );
      let data = await response.json();
      this.sameCategory = data;

      console.log("相同類別的活動", data);
    },
    //#endregion

    //#region 收藏活動
    save(event, activityId, memberId) {
      event.stopPropagation();
      let saveBtn;
      if (event.target.tagName.toLowerCase() === "button") {
        saveBtn = event.target;
      } else if (event.target.tagName.toLowerCase() === "i") {
        saveBtn = event.currentTarget;
      }

      saveBtn.innerHTML = `<i style=" font-size: 25px;
  color: #e9ca89;"
        class="fa-solid fa-bookmark"></i>`;
      console.log(activityId);
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
          if (data.result) {
            this.saveStatus.statusId = 4;
            this.saveStatus.unSaveId = data.activityCollectionId;
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
    unsave(event, deleteId) {
      event.stopPropagation();

      let unsaveBtn;
      if (event.target.tagName.toLowerCase() === "button") {
        unsaveBtn = event.target;
      } else if (event.target.tagName.toLowerCase() === "i") {
        unsaveBtn = event.currentTarget;
      }
      console.log(unsaveBtn);
      unsaveBtn.innerHTML = `<i style=" font-size: 25px;
  color: #e9ca89;" class="fa-regular fa-bookmark"></>`;

      // console.log(deleteId);
      fetch("https://localhost:7259/api/ActivitySave/UnSave/" + deleteId, {
        method: "Delete",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          if (data.result) {
            this.saveStatus.statusId = 3;
            this.saveStatus.unSaveId = 0;
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

    //#region 發問
    ask() {
      let qcontent = this.askContent;
      this.qerromsg = "";

      //驗證輸入內容
      if (
        qcontent == null ||
        qcontent.length == 0 ||
        qcontent.trim().length < 1
      ) {
        this.qerromsg = "請輸入內容";
        return;
      }

      const askData = {
        memberId: this.memberId,
        activityId: this.details.activityId,
        content: this.askContent,
      };
      console.log(askData);
      this.askContent = "";
      fetch("https://localhost:7259/api/ActivityQnA/Ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(askData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          //新增發問內容
          this.QandA.push({
            nickName: data.nickName,
            photoSticker: data.photoSticker,
            activityId: data.activityId,
            qId: data.qId,
            qContent: data.qContent,
            qDateCreated: data.qDateCreated,
            memberId: this.memberId,
            aId: null,
            aContent: null,
            aDateCreated: null,
          });
          this.showAlert(data.message);
        });
    },
    //#endregion

    //#region 刪除發問
    deleteQ(deleteId, index) {
      //this.showConfirm("確定刪除發問？", true, this.delete(deleteId, index));
      //console.log(deleteId);
      this.$swal
        .fire({
          text: "確定刪除發問？",
          showCancelButton: true,
          width: "220px",
          focusCancel: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            fetch(
              "https://localhost:7259/api/ActivityQnA/DeleteQ/" + deleteId,
              {
                method: "Delete",
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.result) {
                  console.log("Success:", data);
                  this.QandA.splice(index, 1);
                  this.showAlert(data.message);
                } else {
                  this.showAlert(data.message);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
    },

    //#endregion

    //#region 報名
    enroll(event) {
      let enrollData = {
        memberId: this.memberId,
        activityId: this.$route.path.slice(10),
      };
      this.$swal
        .fire({
          text: "確定報名？",
          showCancelButton: true,
          width: "220px",
          focusConfirm: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.enrollLoading = true;
            fetch("https://localhost:7259/api/ActivtiyEnroll/Enroll", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(enrollData),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Success:", data);
                this.enrollLoading = false;
                if (data.result) {
                  this.enrollStatus.statusId = 5;
                  this.enrollStatus.deleteId = data.deleteId;
                  this.details.numOfEnrolment++;
                  this.showAlert(data.message);
                } else {
                  this.showAlert(data.message);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
    },
    //#endregion

    //#region  取消報名
    unenroll(deleteId) {
      this.$swal
        .fire({
          text: "取消報名？",
          showCancelButton: true,
          width: "220px",
          focusCancel: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            fetch(
              "https://localhost:7259/api/ActivtiyEnroll/CancelEnroll/" +
                deleteId,
              {
                method: "Delete",
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log("Success:", data);
                if (data.result) {
                  this.enrollStatus.statusId = 4;
                  this.enrollStatus.deleteId = 0;
                  this.details.numOfEnrolment--;
                  this.showAlert(data.message);
                } else {
                  this.showAlert(data.message);
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }
        });
    },
    //#endregion

    //#region demo用
    demoQ() {
      this.askContent = "你好\n請問有提供借用器材嗎？";
    },
    demoMap() {
      this.map.origin = "台北火車站";
      this.initMap();
    },
    //#endregion
  },
};
</script>

<style scoped>
.container {
  height: fit-content;
}
.detailpage {
  min-height: 100vh;
  background-color: #fff;
  width: 95%;
  /* box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1); */
  border-radius: 15px;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 0.75rem;
  position: relative;
}

.image-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.image-container img {
  width: 80%; /* 可根据需要进行调整 */
  height: auto;
  max-height: 80%; /* 可根据需要进行调整 */
}
h5 {
  text-decoration: 4px underline #afc7d8;
  margin-bottom: 30px;
  font-size: 22px;
}
p {
  margin: 1px;
}
a {
  text-decoration: none;
  color: #070707;
}
/* 問與答 */
.QAlist {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  padding: 1rem;
  /* border-bottom: 0.3px solid #afc7d8; */
}
.myQAlist {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 0.5rem;
  padding: 1rem;
  /* border-bottom: 0.3px solid #afc7d8; */
}
.askInput {
  border: 2px solid #afc7d8;
  border-radius: 15px;
}
.askContent {
  margin: 4px;
  resize: none;
  width: 100%;
  border: 0px;
}
.askContent:focus {
  outline: none; /* 外框效果 */
  box-shadow: none;
}
.askBtn {
  border: 0px;
  width: 60px;
  background-color: transparent;
  border-left: 2px solid #afc7d8;
}

.quser {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  object-fit: cover;
}
.qcontent {
  display: inline-block;
  max-width: 800px;
  padding: 20px;
  margin-top: 10px;
  border-radius: 30px;
  border-top-left-radius: 5px;
  background-color: #fcf7f0;
  white-space: pre-wrap;
}
.myqcontent {
  display: inline-block;
  max-width: 800px;
  padding: 20px;
  margin-top: 10px;
  border-radius: 30px;
  border-top-right-radius: 5px;
  background-color: #fcf7f0;
  white-space: pre-wrap;
}
.myquestion {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.date {
  color: #686868;
  margin-top: 3px;
  font-size: 12px;
}
.acontent {
  display: inline-block;
  max-width: 800px;
  padding: 20px;
  margin-top: 10px;
  border-radius: 30px;
  background-color: #fcf0f0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.myacontent {
  display: inline-block;
  max-width: 800px;
  padding: 20px;
  margin-top: 10px;
  border-radius: 30px;
  background-color: #fcf0f0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.qerromsg {
  color: #d39899;
}
.deleteQcontent {
  background-color: transparent;
  border: 0px;
  width: fit-content;
  height: fit-content;
  padding: 10px;
}
.deleteQcontent i {
  font-size: 14px;
  color: #d39899;
}
.answer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.myanswer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
/* 講師card */
.instructorPhoto img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #fcf7f0;
  object-fit: cover;
  padding: 3px;
}
.instructorCard {
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 3px solid #fcf7f0;
  border-radius: 10px;
  padding: 15px;
}
.instrutorName {
  font-size: 20px;
  color: #8991a9;
  margin-bottom: 20px;
}
.instructorDes,
.description {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 活動圖、活動資訊 */
#activityinfo {
  height: 350px;
  line-height: 40px;
  margin-top: 20px;
}
#activityimg {
  height: 350px;
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
}
.coverImage {
  width: 100%;
  height: 350px;
  object-fit: cover;
  flex-shrink: 1;
}

.activityName {
  border: 10px;
  font-size: 22px;
}

@media (max-width: 767px) {
  #activityinfo {
    height: fit-content;
    line-height: 30px;
  }
  #activityimg {
    height: fit-content;
    margin-bottom: 20px;
  }
  .coverImage {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}

/* 超小尺寸手機不顯示同類推薦圖 */
@media (max-width: 371px) {
  .sameImg {
    display: none;
  }
}
/* 收藏按鈕 */
.saveBtn,
.saveBtn1,
.unsaveBtn {
  background-color: transparent;
  border: 0px;
  width: fit-content;
  height: fit-content;
}
.saveBtn i,
.saveBtn1 i,
.unsaveBtn i {
  font-size: 25px;
  color: #e9ca89;
}
.unenrollBtn,
.enrollBtn,
.enrollBtn1 {
  height: 40px;
  margin-left: 20px;
  background-color: transparent;
  color: #8991a9;
  border: 1.5px solid #8991a9;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
}
.unenrollBtn,
.enrollBtn {
  height: 40px;
  margin-left: 20px;
  background-color: #8991a9;
  color: #fff;
  border: 0px;
  border-radius: 10px;
}

.buttonList {
  display: flex;
  align-items: center;
}

#description {
  margin-bottom: 20px;
}

/* 同類型推薦 */
.sameList {
  display: flex;
  border-radius: 10px;
  border: 1px solid #fcf7f0;
  margin-bottom: 10px;
}
.sameInfo {
  padding: 5px;
}
.sameImg {
  width: 100px;
  height: 100px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-right: 5px;
  object-fit: cover;
}
.sameLink {
  text-decoration: none;
}
.ellipsis {
  color: gray;
}
.samedate i {
  width: 16px;
  color: #444444;
  margin-right: 10px;
}

/* 地圖 */
#map {
  height: 400px; /* The height is 400 pixels */
  width: 100%; /* The width is the width of the web page */
  border-radius: 10px;
}

.mode,
.origin {
  outline: none;
  box-shadow: none;
  border: 0px;
  margin-right: 10px;
  height: 50px;
}
.panel {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0px;
}
.routes {
  display: inline-block;
  border: 1px solid #e9ca89;
  padding: 15px;
  border-radius: 15px;
  margin: 10px 0px;
}
.geoBtn {
  background-color: #a6b6b0;
  color: #fff;
  font-size: large;
  padding: 10px;
  border: 0px;
  border-radius: 15px;
}
.geoBtn ::hover {
  background-color: #fff;
  color: #a6b6b0;
  border: 1px solid #a6b6b0;
}
</style>
