<template>
  <!-- 呈現內容 component使用-->
  <TransitionGroup name="list">
    <div
      class="col-12 col-sm-6 col-md-4 col-lg-3"
      v-for="item in allAlbums"
      :key="item.albumId"
    >
      <div class="card cardSize">
        <RouterLink
          :to="`/Community/PersonalPage/${memberId}/Albums/${item.albumId}`"
          class="w-100 h-100"
        >
          <img
            :src="`https://localhost:7259/Images/${item.coverImg}`"
            class="card-img-top rounded-bottom"
            :alt="item.source"
          />
          <div class="albumTitle">{{ item.albumName }}</div>
        </RouterLink>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
const route = useRoute();
const allAlbums = ref([]);
const memberId = computed(() => route.params.memberId);

//上傳相簿刷新頁面用
const uploadAlbumProp = defineProps(["uploadAlbumProp"]);
watch(uploadAlbumProp, () => {
  console.log(uploadAlbumProp);
  if (uploadAlbumProp) {
    axios
      .get(
        `https://localhost:7259/api/Album/GetAlbums?memberId=${memberId.value}`
      )
      .then((response) => {
        allAlbums.value = response.data;
      })
      .catch((error) => console.log(error));
  }
});

// 撈相簿
axios
  .get(`https://localhost:7259/api/Album/GetAlbums?memberId=${memberId.value}`)
  .then((response) => {
    allAlbums.value = response.data;
  })
  .catch((error) => console.log(error));
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.photoGrid {
  margin-top: 230px;
  margin-left: 26px;
  height: 100%;
}
.card img {
  transform: scale(1, 1);
  transition: all 0.5s ease-out;
  object-fit: cover;
  height: 100%;
}

.card img:hover {
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

.cardSize:hover .albumTitle {
  width: 100%;
  padding: 8px 11px;
  visibility: visible;
  opacity: 1;
}

.albumTitle {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.6) 81%
  );
  border-radius: 0 0 4px 4px;
  border: 0;
  color: white;
  margin: 0;
  opacity: 0;
  visibility: hidden;
  -webkit-transition: visibility 0s, opacity 0.5s linear;
  transition: visibility 0s, opacity 0.5s linear;
  font-size: 15px;
}
@media (max-width: 1200px) {
  .photoGrid {
    margin: 0;
  }
}
</style>
