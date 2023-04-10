<template>
  <div class="container mt-4">
    <!-- 搜尋 -->
    <div class="row fadeAni">
      <div
        class="col-12 d-flex justify-content-center align-items-center karzaFS"
      >
        KARZA!
      </div>
      <div class="col-12 searchBar">
        <div class="form-floating searchText">
          <input
            type="text"
            class="form-control searchContent"
            id="floatingSearch"
            placeholder="名字"
            v-model.trim="searchInput"
            @keyup="searchName()"
          />
          <label for="floatingSearch"
            ><i class="fa-solid fa-magnifying-glass"></i> 暱稱</label
          >
        </div>
      </div>
    </div>
    <div class="row gy-4 mb-4">
      <!-- 1張 -->
      <TransitionGroup name="list">
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3 user"
          v-for="item in allProfile"
          :key="item.id"
        >
          <RouterLink
            :to="`/Community/PersonalPage/${item.id}/Photos`"
            class="personlink"
          >
            <div class="rounded-3 p-5 userInfo">
              <!-- Personal information goes here -->
              <div class="userProfile">
                <img
                  v-if="item.source != null"
                  class="imgPhoto"
                  :src="`https://localhost:7259/Images/${item.source}`"
                  alt=""
                />
                <img
                  v-else
                  class="imgPhoto"
                  src="../assets/userPic.png"
                  alt=""
                />
                <h5>{{ item.name }}</h5>
              </div>
            </div>
          </RouterLink>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
const searchInput = ref("");
const allProfile = ref([]);
console.log(searchInput.value);
console.log(allProfile.value);

const searchName = () => {
  axios
    .get(
      `https://localhost:7259/api/Profile/GetAllMember?searchInput=${searchInput.value}`
    )
    .then((response) => {
      allProfile.value = response.data;
    })
    .catch((error) => console.log(error));
};

axios
  .get(
    `https://localhost:7259/api/Profile/GetAllMember?searchInput=${searchInput.value}`
  )
  .then((response) => {
    allProfile.value = response.data;
    console.log(allProfile.value);
  })
  .catch((error) => console.log(error));
</script>

<style scoped>
.fadeAni {
  animation: fade 0.5s;
}
@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transition: all 0.5s ease;
  }
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-leave-active {
  position: absolute;
}

.karzaFS {
  font-size: 80px;
  color: #808080;
}
.user {
  max-width: 360px;
  display: flex;
  justify-content: center;
}

.userInfo {
  height: 100%;
  /* background-color: #f6fafcf5; */
  background-color: white;
  box-shadow: 0 1px 5px 1px rgba(128, 128, 128, 0.144);
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 360px;
  transition: ease-in-out 0.3s;
}
.userInfo:hover {
  transform: translateY(3%);
  box-shadow: 0 1px 10px 1px rgba(128, 128, 128, 0.301);
}

.userProfile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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
.personlink {
  height: 100%;
  width: 100%;
  text-decoration: none;
  color: #070707;
}
.searchBar {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.searchText {
  height: 100%;
  width: 100%;
  max-width: 700px;
}
.searchContent {
  border: 0;
  box-shadow: 0 1px 2px rgba(25, 25, 25, 0.15);
}
.searchContent:hover {
  box-shadow: 0 1px 10px rgba(25, 25, 25, 0.15);
}

@media (max-width: 1200px) {
  .user {
    max-width: 100%;
  }
  .userInfo {
    height: fit-content;
    max-width: none;
  }
}
</style>
