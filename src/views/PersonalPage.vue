<template>
  <!-- Cover image -->
  <div class="bag">
    <!-- Personal information overlay -->
    <div class="about">
      <h4 class="text-light titleAni">關於</h4>
      <p class="text-light titleAni">
        {{ memberProfile.about }}
      </p>
    </div>
  </div>

  <!-- Two-column layout -->
  <div class="container-fluid">
    <div class="d-flex justify-content-center">
      <div class="p-4 content">
        <!-- 人 -->
        <div class="col-xl-3 col-lg-12 user titleAni">
          <div class="userInfo">
            <!-- Personal information goes here -->
            <div class="userText">
              <div class="userProfile">
                <img
                  v-if="memberProfile.source != null"
                  class="imgPhoto mb-3 mb-sm-3 me-md-3 me-xl-0 mb-lg-2"
                  :src="`https://localhost:7259/Images/${memberProfile.source}`"
                  :alt="memberProfile.source"
                />
                <img
                  v-else
                  class="imgPhoto mb-3 mb-sm-3 me-md-3 me-xl-0 mb-lg-2"
                  src="../assets/userPic.png"
                  alt="1"
                />
                <p class="fs-5 m-0">{{ memberProfile.name }}</p>
                <!-- <p>{{ memberProfile }}</p> -->
              </div>

              <div class="userBtn">
                <!-- v-if="登入memberId==此頁面memberId" -->
                <button
                  v-if="loginMemberId == memberId"
                  class="uploadPhotoBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#uploadPhotoModal"
                >
                  新增相片
                </button>
                <button
                  v-if="loginMemberId == memberId"
                  class="uploadAlbumBtn"
                  data-bs-toggle="modal"
                  data-bs-target="#uploadAlbumModal"
                  @click="albumGetPhotos"
                >
                  新增相簿
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Photos grid 相片相簿統計呈現 -->
        <div class="col-xl-9 gy-4 col-lg-12 photoGrid">
          <div class="row gy-4">
            <!-- 選單 切換component-->
            <div class="col-12 userLinkGroup titleAni">
              <RouterLink
                :to="`/Community/PersonalPage/${memberId}/Photos`"
                class="userLink"
                >相片</RouterLink
              >
              <RouterLink
                :to="`/Community/PersonalPage/${memberId}/Albums`"
                class="userLink"
                >相簿</RouterLink
              >
              <RouterLink
                v-if="loginMemberId == memberId"
                :to="`/Community/PersonalPage/${memberId}/Collections`"
                class="userLink"
                >收藏</RouterLink
              >
              <div class="dropdown" v-if="loginMemberId == memberId">
                <button
                  role="button"
                  class="userLink dropdown-toggle toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <RouterLink
                    :to="`/Community/PersonalPage/${memberId}/Statics/DateViews`"
                    class="link"
                    >統計</RouterLink
                  >
                </button>
                <ul class="dropdown-menu staticBtnGroup">
                  <li>
                    <RouterLink
                      :to="`/Community/PersonalPage/${memberId}/Statics/DateViews`"
                      >7天相片瀏覽</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      :to="`/Community/PersonalPage/${memberId}/Statics/CameraUse`"
                      >相機使用率</RouterLink
                    >
                  </li>
                  <li>
                    <RouterLink
                      :to="`/Community/PersonalPage/${memberId}/Statics/TopPhotoViews`"
                      >照片排名</RouterLink
                    >
                  </li>
                </ul>
              </div>
            </div>

            <!-- 呈現內容 component使用-->
            <RouterView
              :uploadProp="uploadReload"
              :uploadAlbumProp="uploadAlbumReload"
            ></RouterView>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 上傳相片的modal -->
  <div class="modal fade" tabindex="-1" id="uploadPhotoModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-bottom-0">
          <h5 class="modal-title">上傳相片</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input
            class="form-control fileContent"
            type="file"
            @change="showPhoto"
            id="formFile"
            accept="image/*"
            ref="uploadFile"
          />
          <div class="previewPhoto">
            <img :src="photoData" alt="XXXX" v-show="photoshow" />
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingTitle"
              v-model="title"
              placeholder="標題"
            />
            <label for="floatingTitle">標題</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingCamera"
              v-model="camera"
              placeholder="相機"
            />
            <label for="floatingCamera">相機</label>
          </div>
          <div class="d-flex justify-content-end">
            <button
              @click="goSubmit"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 上傳相簿的modal -->
  <div class="modal fade" tabindex="-1" id="uploadAlbumModal">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header border-bottom-0 d-block modalHeader">
          <div class="d-flex justify-content-between">
            <h5 class="modal-title mb-3">新增相簿</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="form-floating mb-3 d-flex">
            <input
              type="text"
              class="form-control"
              id="floatingAlbumTitle"
              placeholder="標題"
              v-model="albumTitle"
            />
            <label for="floatingAlbumTitle">相簿標題</label>
          </div>
        </div>
        <div class="modal-body">
          <div class="row gy-3 gx-3">
            <div
              class="col-12 col-sm-6 col-md-4 col-lg-3"
              v-for="item in allPhotos"
              :key="item.id"
            >
              <div class="card border-0 cardSize">
                <img
                  :src="`https://localhost:7259/Images/${item.source}`"
                  class="card-img-top rounded-bottom"
                  :alt="item.source"
                />
                <input
                  type="checkbox"
                  class="albumCheckbox"
                  v-model="albumCheckBox"
                  :value="item.id"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-top-0 p-2">
          <button
            @click="goAlbumSubmit"
            type="button"
            class="btn btn-secondary mt-3"
            data-bs-dismiss="modal"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
const route = useRoute();
const allPhotos = ref([]);
const memberProfile = ref([]);
const uploadReload = ref(false);
const uploadFile = ref("uploadFile");
const uploadAlbumReload = ref(false);

// 上傳照片欄位缺 author=登入者
const photoData = ref("");
const photoshow = ref(false);
const photofile = ref({});
const title = ref("");
const camera = ref("");
// const author = ref("");

const memberId = computed(() => route.params.memberId);

//上傳相簿
const albumCheckBox = ref([]);
const albumTitle = ref("");

//token
const token = ref($.cookie("token"));
const loginMemberId = ref("");
//判斷登入者的id
axios
  .get("https://localhost:7259/api/Members/Read", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
  .then((response) => {
    loginMemberId.value = response.data;
    console.log("登入ID");
    console.log(loginMemberId.value);
  })
  .catch((error) => {
    console.log("MY未登入");
  });

//上傳照片預覽
const showPhoto = (event) => {
  const file = event.target.files[0];
  photofile.value = file;
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = () => {
    photoshow.value = true;
    console.log(reader.result);
    photoData.value = reader.result;
  };
};

// submit上傳照片功能
const goSubmit = async function () {
  console.log(photofile.value);
  console.log(title.value);
  console.log(camera.value);

  const formData = new FormData();
  formData.append("Id", 0);
  formData.append("File", photofile.value);
  // formData.append("Author", 1);
  //登入者的id author.value
  formData.append("Title", title.value);
  formData.append("Camera", camera.value);

  await axios
    .post("https://localhost:7259/api/Photo/Create", formData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    .then((response) => {
      console.log("上傳照片成功");
      uploadReload.value = true;
      photofile.value = null;
      title.value = "";
      camera.value = "";
      photoData.value = "";
      photoshow.value = false;
      uploadFile.value.value = "";
      // console.log(
      //   `photofile.value=${photofile.value},,${uploadFile.value.value}`
      // );
    })
    .catch((error) => {
      console.log(error);
    });
  uploadReload.value = false;
  console.log("上傳成功後value?" + uploadReload.value);
};

// submit上傳相簿
const goAlbumSubmit = function () {
  console.log(albumCheckBox.value);
  const newArray = albumCheckBox.value.slice();
  console.log(newArray);
  console.log(albumTitle.value);

  axios
    .post(
      `https://localhost:7259/api/Album/CreateAlbum`,
      {
        albumName: albumTitle.value,
        photoId: newArray,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
    .then((response) => {
      console.log("上傳相簿成功");
      uploadAlbumReload.value = true;
      albumTitle.value = "";
      albumCheckBox.value = [];
    })
    .catch((error) => console.log(error));

  uploadAlbumReload.value = false;
};

// 得到此頁面的profile
axios
  .get(`https://localhost:7259/api/Photo/GetProfile?memberId=${memberId.value}`)
  .then((response) => {
    memberProfile.value = response.data;
  })
  .catch((error) => console.log(error));

// 上傳相簿得到所有相片
const albumGetPhotos = () => {
  axios
    .get(
      `https://localhost:7259/api/Photo/AllPhotos?memberId=${memberId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
    .then((response) => {
      allPhotos.value = response.data;
    })
    .catch((error) => console.log(error));
};
// watch memberId
watch(memberId, () => {
  // console.log("watch");
  // console.log(route.params.memberId);
  // console.log(memberId.value);
  axios
    .get(
      `https://localhost:7259/api/Photo/GetProfile?memberId=${memberId.value}`
    )
    .then((response) => {
      memberProfile.value = response.data;
    })
    .catch((error) => console.log(error));
});
</script>

<style scoped>
.modalHeader {
  padding: 20px 15px 0 15px;
}
.cardSize {
  height: 150px;
  width: 100%;
}

.cardSize img {
  object-fit: cover;
  height: 100%;
}

.titleAni {
  animation: fade 0.5s;
}
@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }
  to {
    opacity: 1;
  }
}
.albumCheckbox {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 10px;
  border: 0;
  color: white;
  margin: 0;
}
.previewPhoto {
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.previewPhoto img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
}
.toggle {
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.link {
  z-index: 1;
  text-decoration: none;
  color: #444444;
  padding: 8px;
  width: 100%;
  text-align: center;
}
.bag {
  background-color: #afc7d8;
  width: 100%;
  height: 290px;
}

.imgPhoto {
  border: 3px solid #fff;
  box-shadow: 0 1px 5px rgba(25, 25, 25, 0.15);
  border-radius: 50%;
  width: 110px;
  height: 110px;
  margin-bottom: 20px;
  object-fit: cover;
}

.about {
  position: relative;
  left: 25%;
  top: 43%;
  word-wrap: break-word;
  max-width: 70%;
}

.uploadPhotoBtn {
  width: 130px;
  height: 45px;
  background-color: rgb(252, 233, 189);
  border: 2px solid #f6fafcf1;
  border-radius: 50px;
  margin-top: 12px;
}

.uploadPhotoBtn:hover {
  background-color: rgb(255, 250, 239);
  color: rgb(187, 140, 32);
  border: 2px solid rgb(252, 233, 189);
  transition: 0.3s;
}

.uploadAlbumBtn {
  margin-top: 12px;
  transition: 0.3s;
  border-radius: 50px;
  width: 130px;
  height: 45px;
  background-color: #f6fafcf1;
  border: 1px solid #afc7d8;
}

.uploadAlbumBtn:hover {
  background-color: white;
  border: 0;
  color: #afc7d8;
}

.content {
  position: relative;
  /* z-index: 1; */
  margin-top: -240px;
  /* background-color: #f6fafcf1; */
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.user {
  max-width: 360px;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 80px;
  /* left: 10px; */
  height: 100%;
}

.userInfo {
  height: 100%;
  background-color: #f6fafcf1;
  height: 430px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 360px;
  padding: 50px;
  border-radius: 10px;
}

.userText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.userProfile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.userBtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 55px;
}

.userLink {
  width: 80px;
  height: 40px;
  border: 0px;
  text-align: center;
  text-decoration: none;
  color: #444444;
  border-bottom: 1.5px solid #afc7d8;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userLink:hover {
  transition: 0.3s ease-in-out;
  border-radius: 15px;
  background-color: #dbe5e1eb;
  color: #444444;
}
.userLink.router-link-active,
.link.router-link-active {
  border-radius: 15px;
  background-color: #dbe5e1eb;
  color: #444444;
  border: 0;
}

.staticBtnGroup li .router-link-active {
  background-color: #dbe5e1eb;
  color: #444444;
}

.staticBtnGroup li:hover {
  background-color: #b6cac2eb;
}

.staticBtnGroup li {
  display: flex;
  justify-content: center;
}
.staticBtnGroup li a {
  text-decoration: none;
  color: #444444;
  width: 100%;
  text-align: center;
}

.userLinkGroup {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.photoGrid {
  margin-top: 230px;
  margin-left: 26px;
  height: 100%;
}

@media (max-width: 1200px) {
  .content {
    flex-direction: column;
    margin-top: 0;
  }

  .photoGrid {
    margin: 0;
  }

  .about {
    max-width: 90%;
    top: -10%;
    left: 0%;
  }

  .user {
    max-width: 100%;
    position: relative;
    top: 0;
  }

  .userText {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .userInfo {
    height: fit-content;
    max-width: none;
  }

  .followBtn,
  .followerBtns {
    margin-top: 0;
    margin-left: 10px;
  }

  .about {
    margin: 0;
    padding: 55px;
  }

  .userProfile {
    display: flex;
    flex-direction: row;
    /* min-width: 250px;  */
  }

  .userBtn {
    display: flex;
    flex-direction: row;
    margin-top: 0;
  }

  .userLinkGroup {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .userLink,
  .staticBtn {
    margin-top: 20px;
    margin-right: 0px;
  }

  .AllCollect {
    margin-top: 20px;
    margin-right: 0px;
  }
}

@media (max-width: 768px) {
  .userBtn {
    display: flex;
    flex-direction: column;
  }

  .userText {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .followBtn {
    margin-top: 25px;
  }
  .followerBtns {
    margin-top: 10px;
  }

  .userProfile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
