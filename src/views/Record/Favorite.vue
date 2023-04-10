<template>
  <div>
    <div v-show="!isempty && !isloading">
      <div class="content">
        <h4>我的收藏商品</h4>
        <div class="line mb-4"></div>
        <div class="list">
          <div v-for="(item, index) in fav" :key="index">
            <router-link :to="'/Product/' + item.id">
              <div class="listContent">
                <div class="coverImg">
                  <img
                    :src="
                      'https://localhost:7027/ProductImgFiles/' + item.source
                    "
                    alt="封面圖"
                  />
                </div>
                <div class="info">
                  <p class="productName">{{ item.name }}</p>
                  <p class="price">NTD {{ item.price }}</p>
                </div>
              </div>

              <!-- 最後一筆資料不顯示分隔線 -->
              <div class="line" v-show="index + 1 < fav.length"></div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isempty && !isloading">
      <div class="content">
        <h4>我的收藏商品</h4>
        <div class="line mb-4"></div>
        沒有收藏的活動
      </div>
    </div>
    <div v-show="isloading" class="image-container">
      <img src="../../assets/Spinner-1s-200px-2.gif" alt="" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import utility from "../../../public/utility";
export default {
  mixins: [utility],
  data() {
    return {
      fav: [],
      isempty: false,
      isloading: true,
    };
  },
  created() {
    this.CallFavoriteAll();
  },
  methods: {
    async CallFavoriteAll() {
      this.isempty = false;
      this.loading = true;
      let fav = await this.fetchMemberId();
      await axios
        .get(
          `https://localhost:7259/api/Favorites/FavoritesAll?memberId=${fav}`
        )
        .then((response) => {
          this.isloading = false;
          this.fav = response.data;
          if (this.fav.length == 0) this.isempty = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.content {
  padding: 20px 50px;
}
.line {
  height: 1px;

  background-color: #a3a3a3;
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
.productName {
  padding: 0px;
  margin: 0px;
  font-size: 20px;
  font-weight: 500;
}
.price {
  padding: 0px;
  margin: 0px;
  font-size: 18px;
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
</style>
