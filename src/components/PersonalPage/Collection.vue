<template>
  <!-- 呈現內容 component使用-->
  <TransitionGroup name="list">
    <div
      class="col-12 col-sm-6 col-md-4 col-lg-3"
      v-for="item in collections"
      :key="item.id"
      @click="photoModal(item)"
    >
      <div class="card cardSize">
        <img
          :src="`https://localhost:7259/Images/${item.source}`"
          class="card-img-top rounded-bottom"
          :alt="item.source"
          data-bs-toggle="modal"
          data-bs-target="#photoModal"
        />
        <button class="bookMarkBtn" @click.stop="collectPhoto(item)">
          <i
            class="fa-solid fa-bookmark text-light"
            v-if="item.isCollection"
          ></i>
          <i class="fa-regular fa-bookmark text-light" v-else></i>
        </button>
      </div>
    </div>
  </TransitionGroup>
  <!-- modal -->
  <div
    class="modal fade"
    id="photoModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div
          class="modal-header p-3 border-bottom-0 d-flex justify-content-between align-items-center"
        >
          <div
            class="photoModalProfile d-flex justify-content-center align-items-center"
          >
            <div
              data-bs-dismiss="modal"
              class="d-flex justify-content-center align-items-center"
            >
              <RouterLink
                :to="`/Community/PersonalPage/${photoFor.authorId}/Photos`"
                class="authorLink"
              >
                <img
                  class="imgPhoto me-3"
                  :src="`https://localhost:7259/Images/${photoFor.authorPhotoSticker}`"
                  :alt="photoFor.authorPhotoSticker"
                />
              </RouterLink>
              <RouterLink
                :to="`/Community/PersonalPage/${photoFor.authorId}/Photos`"
                class="authorLink"
              >
                <p class="m-0">{{ photoFor.author }}</p>
              </RouterLink>
            </div>
          </div>
          <div v-if="loginMemberId == photoFor.authorId">
            <!-- 選項 編輯/刪除相片 v-if="memberId==memberId" -->
            <div class="dropdown dropdown-center" v-if="!edit">
              <button
                type="button"
                class="photoModalMoreBtn"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fa-solid fa-ellipsis fs-3"></i>
              </button>
              <ul class="dropdown-menu moreUl">
                <li
                  data-bs-dismiss="modal"
                  class="w-100 h-100 d-flex justify-content-center deleteLi"
                  @click="deletePhoto(photoFor.id)"
                >
                  刪除
                </li>
                <li
                  class="w-100 h-100 d-flex justify-content-center editLi"
                  @click="editPhoto(photoFor)"
                >
                  編輯
                </li>
              </ul>
            </div>
            <!-- 修改按鈕 -->
            <button v-else class="editConfirm" @click="editComplete">
              修改
            </button>
          </div>
        </div>
        <div
          class="modal-body d-flex justify-content-center flex-column align-items-center p-0"
        >
          <div class="card photoModalImage">
            <img
              :src="`https://localhost:7259/Images/${photoFor.source}`"
              class="card-img-top rounded-0"
              :alt="photoFor.source"
            />
            <button class="bookMarkBtn" @click.stop="collectPhoto(photoFor)">
              <i
                class="fa-solid fa-bookmark text-light"
                v-if="photoFor.isCollection"
              ></i>
              <i class="fa-regular fa-bookmark text-light" v-else></i>
            </button>
          </div>
        </div>
        <div class="photoModalFooter" v-if="!edit">
          <p class="fw-bold">{{ photoFor.title }}</p>
          <p>
            <i class="fa-solid fa-camera-retro fs-5"></i>
            {{ photoFor.camera }}
          </p>
        </div>
        <!-- 編輯照片 -->
        <div class="photoModalFooter" v-else>
          <input
            type="text"
            class="form-control editModal"
            placeholder="標題"
            v-model="editTitle"
          />
          <input
            type="text"
            class="form-control editModal"
            placeholder="相機"
            v-model="editCamera"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";

const route = useRoute();
const collections = ref([]);
const photoFor = ref("");
const reload = ref(false);
const deleteReload = ref(false);
const edit = ref(false);
const editTitle = ref("");
const editCamera = ref("");
const memberId = computed(() => route.params.memberId);
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
    console.log(memberId);
  })
  .catch((error) => {
    console.log("MY未登入");
  });

// modal資料
const photoModal = (item) => {
  photoFor.value = item;
};

// 開啟編輯照片
const editPhoto = (item) => {
  edit.value = true;
  editTitle.value = photoFor.value.title;
  editCamera.value = photoFor.value.camera;
};
// 執行編輯相片
const editComplete = () => {
  console.log(`${photoFor.value.id},${editTitle.value},${editCamera.value}`);
  axios
    .patch(`https://localhost:7259/api/Photo/EditPhoto`, {
      photoId: photoFor.value.id,
      title: editTitle.value,
      camera: editCamera.value,
    })
    .then((response) => {
      console.log("編輯相片成功");
      // editReload.value = true;
      photoFor.value.camera = editCamera.value;
      photoFor.value.title = editTitle.value;
      edit.value = false;
      editTitle.value = "";
      editCamera.value = "";
    })
    .catch((error) => console.log(error));
};

// 收藏
const collectPhoto = (collectPhoto) => {
  axios
    .post(
      `https://localhost:7259/api/Collection/Collect`,
      {
        Id: 1,
        photoId: collectPhoto.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
    .then((response) => {
      console.log("收藏api成功");
      reload.value = true;
      console.log(reload);
      collectPhoto.isCollection = !collectPhoto.isCollection;
    })
    .catch((error) => console.log(error));
};

//收藏後重撈
watch(reload, () => {
  if (reload.value) {
    axios
      .post(
        "https://localhost:7259/api/Photo/CollectionPhoto",
        {
          id: memberId.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      )
      .then((response) => {
        collections.value = response.data;
        reload.value = false;
      })
      .catch((error) => console.log(error));
  }
});

// 刪除相片
const deletePhoto = function (photoId) {
  axios
    .delete(`https://localhost:7259/api/Photo/DeletePhoto?photoId=${photoId}`)
    .then((response) => {
      console.log("刪除照片成功");
      deleteReload.value = true;
    })
    .catch((error) => {
      console.log(error);
    });
};

// 刪除相片重整
watch(deleteReload, () => {
  if (deleteReload.value) {
    axios
      .post(
        "https://localhost:7259/api/Photo/CollectionPhoto",
        {
          id: memberId.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      )
      .then((response) => {
        collections.value = response.data;
        deleteReload.value = false;
      })
      .catch((error) => console.log(error));
  }
});

// 撈某人的收藏
axios
  .post(
    "https://localhost:7259/api/Photo/CollectionPhoto",
    {
      id: memberId.value,
    },
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  )
  .then((response) => {
    collections.value = response.data;
    reload.value = true;
    // console.log(collections.value);
  })
  .catch((error) => console.log(error));

// 撈此頁面所有照片
watch(memberId, () => {
  // console.log("watch");
  // console.log(route.params.memberId);
  // console.log(memberId.value);
  axios
    .post(
      "https://localhost:7259/api/Photo/CollectionPhoto",
      {
        id: memberId.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
    .then((response) => {
      collections.value = response.data;
      reload.value = true;
      // console.log(collections.value);
    })
    .catch((error) => console.log(error));
});
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.authorLink {
  text-decoration: none;
  color: black;
}
.authorLink:hover {
  color: gray;
  transition: ease-in-out 0.3s;
}
.editModal {
  height: 30px;
  width: 250px;
}
.editConfirm {
  width: 80px;
  height: 40px;
  border-radius: 15px;
  border: 4px solid #dbe5e1eb;
  background-color: #dbe5e1eb;
}

.editConfirm:hover {
  transition: 0.3s ease-in-out;
  background-color: white;
}

.deleteLi,
.editLi {
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}
.deleteLi:hover {
  background-color: #d39899;
  color: white;
  transition: ease-in-out 0.3s;
}
.editLi:hover {
  background-color: #a6b6b0;
  color: white;
  transition: ease-in-out 0.3s;
}

.moreUl {
  min-width: 40px;
  width: 60px;
  padding: 0;
  border: 1px solid black;
  border-radius: 3px;
}
.photoModalFooter {
  border-top: 0;
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
}
.photoModalFooter p {
  margin: 0;
}
.imgPhoto {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
}
.photoModalImage img {
  object-fit: cover;
}
.photoModalMoreBtn {
  border: 0;
  background-color: transparent;
}
.photoModalMoreBtn:hover {
  color: gray;
  transition: ease-in-out 0.3s;
}

.photoModalImage {
  border: 0;
  width: fit-content;
  height: fit-content;
}
.photoGrid {
  margin-top: 230px;
  margin-left: 26px;
  height: 100%;
}
.cardSize img {
  transform: scale(1, 1);
  transition: all 0.5s ease-out;
  object-fit: cover;
  height: 100%;
}

.cardSize img:hover {
  transform: scale(1.2, 1.2);
}

.cardSize {
  overflow: hidden;
  height: 250px;
  width: 100%;
  position: relative;
  float: left;
  /* margin-right: 10px; */
  transition: 0.5s ease;
  border: 0;
}

.cardSize:hover .bookMarkBtn,
.photoModalImage:hover .bookMarkBtn {
  width: 40px;
  padding: 10px 7px;
  visibility: visible;
  opacity: 1;
}

.bookMarkBtn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    to bottom right,
    transparent 0%,
    rgba(127, 127, 127, 0.6) 81%
  );
  border-radius: 0 0 4px 4px;
  border: 0;
  color: white;
  margin: 0 0px 0px 0;
  opacity: 0;
  visibility: hidden;
  -webkit-transition: visibility 0s, opacity 0.5s linear;
  transition: visibility 0s, opacity 0.5s linear;
  font-size: 20px;
}
@media (max-width: 1200px) {
  .photoGrid {
    margin: 0;
  }
}
</style>
