<template>
  <div class="container h-100 py-5">
    <!-- 輪播圖 -->
    <div
      id="newProduct"
      class="carousel slide carousel-fade newActivityCarousel"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <div>
          <button
            type="button"
            data-bs-target="#newProduct"
            class="active"
            aria-current="true"
            data-bs-slide-to="0"
          ></button>
          <button
            type="button"
            data-bs-target="#newProduct"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#newProduct"
            data-bs-slide-to="2"
          ></button>
          <button
            type="button"
            data-bs-target="#newProduct"
            data-bs-slide-to="3"
          ></button>
          <button
            type="button"
            data-bs-target="#newProduct"
            data-bs-slide-to="4"
          ></button>
          <button
            type="button"
            data-bs-target="#newProduct"
            data-bs-slide-to="5"
          ></button>
        </div>
      </div>
      <div class="carousel-inner">
        <div>
          <div class="carousel-item carouselImg active" data-bs-interval="1500">
            <router-link to="/Product/31">
              <img src="..\assets\ProEvent\01.png" alt="商城活動圖" />
            </router-link>
          </div>
          <div class="carousel-item carouselImg" data-bs-interval="1500">
            <router-link to="/Product/34">
              <img src="..\assets\ProEvent\02.jpg" alt="商城活動圖" />
            </router-link>
          </div>
          <div class="carousel-item carouselImg" data-bs-interval="1500">
            <router-link to="/Product/30">
              <img src="..\assets\ProEvent\03.jpg" alt="商城活動圖" />
            </router-link>
          </div>
          <div class="carousel-item carouselImg" data-bs-interval="1500">
            <router-link to="/Product/32">
              <img src="..\assets\ProEvent\04.jpg" alt="商城活動圖" />
            </router-link>
          </div>
          <div class="carousel-item carouselImg" data-bs-interval="1500">
            <router-link to="/Product/36">
              <img src="..\assets\ProEvent\05.jpg" alt="商城活動圖" />
            </router-link>
          </div>
          <div class="carousel-item carouselImg" data-bs-interval="1500">
            <router-link to="/Product/35">
              <img src="..\assets\ProEvent\06.jpg" alt="商城活動圖" />
            </router-link>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#newProduct"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#newProduct"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <!-- 新品 -->
    <div class="newproduct">新品上市</div>
    <!-- 新品CARD -->
    <div class="row d-flex justify-content-center">
      <NewProduct></NewProduct>
    </div>
    <!-- 產品全站篩選 -->
    <div class="search_div">
      <div class="d-flex justify-content-center">
        <select
          @change="CallSearchApi"
          name="type"
          class="type_select m-2"
          v-model="optionCate"
        >
          <option value="0">所有類別</option>
          <option
            v-for="cate in Categorylist"
            :key="cate.name"
            :value="cate.id"
          >
            {{ cate.name }}
          </option>
        </select>
        <select
          @change="CallSearchApi"
          name="brand"
          class="type_select m-2"
          v-model="optionbrand"
        >
          <option value="0">所有品牌</option>
          <option
            v-for="brand in Brandlist"
            :key="brand.name"
            :value="brand.id"
          >
            {{ brand.name }}
          </option>
        </select>
        <div class="search d-flex m-2">
          <!-- <div class="search_icon" @click="CallSearchApi">
              <i class="fa-solid fa-magnifying-glass"></i>
            </div> -->
          <input
            v-model="inputProName"
            type="text"
            placeholder="輸入商品關鍵字..."
            @keyup="CallSearchApi"
            class="search_input"
          />
        </div>
      </div>
    </div>

    <!-- 篩選在這 -->
    <div class="newproduct">
      <div v-show="priceS === 0">
        <button @click="OrderByPriceS" class="filter_btn">
          價格 <i class="fa-solid fa-arrow-up text-white"></i>
        </button>
        <button @click="OrderByPricedB" class="filter_btn">
          價格
          <i class="fa-solid fa-arrow-down text-white"></i>
        </button>
      </div>
      <!-- <button class="filter_btn border_btn ">最新*</button> -->
      <button v-show="priceS === 1" @click="OrderByPriceS" class="filter_btn">
        價格 <i class="fa-solid fa-arrow-up text-white"></i>
      </button>
      <button v-show="priceS === 2" @click="OrderByPricedB" class="filter_btn">
        價格
        <i class="fa-solid fa-arrow-down text-white"></i>
      </button>
    </div>

    <!-- 全部Card在這 -->

    <div class="row m-3">
      <AllProduct :parentProduct="ProductResult"></AllProduct>
    </div>
  </div>
</template>

<script>
import NewProduct from "./Product/NewProduct.vue";
import AllProduct from "./Product/AllProduct.vue";
import utility from "../../public/utility";

export default {
  components: {
    NewProduct,
    AllProduct,
  },
  mixins: [utility],
  name: "AllProducts",
  data() {
    return {
      Categorylist: [],
      Brandlist: [],
      optionCate: "0",
      optionbrand: "0",
      inputProName: "",
      ProductResult: [],
      priceS: 0,
    };
  },

  created() {
    this.scrollToTop();
    this.CallCategorylistApi();
    this.CallBrandlistApi();
    this.CallSearchApi();
  },
  methods: {
    async CallCategorylistApi() {
      await axios
        .get("https://localhost:7259/api/Category/Categorylist")
        .then((response) => {
          console.log(response.data);

          this.Categorylist = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async CallBrandlistApi() {
      await axios
        .get("https://localhost:7259/api/Brands/Brandlist")
        .then((response) => {
          console.log(response);
          this.Brandlist = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async CallSearchApi() {
      console.log(this.optionCate, this.optionbrand, this.inputProName);
      await axios
        .get(
          `https://localhost:7259/api/Product/Search?name=${this.inputProName}&categoryId=${this.optionCate}&brandId=${this.optionbrand}`
        )
        .then((response) => {
          console.log(response.data);
          this.ProductResult = response.data;
          this.priceS = 0;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    OrderByPriceS() {
      let OrderByPriceS = [];
      OrderByPriceS = this.ProductResult.sort((a, b) => {
        return a.price - b.price;
      });
      this.ProductResult = OrderByPriceS;
      this.priceS = 2;
    },
    OrderByPricedB() {
      let OrderByPricedB = [];
      OrderByPricedB = this.ProductResult.sort((a, b) => {
        return b.price - a.price;
      });
      this.ProductResult = OrderByPricedB;
      this.priceS = 1;
    },
  },
};
</script>

<style scoped>
.carouselImg img {
  width: 100%;
}
.search_div {
  border-radius: 10px;
  border: 1px solid #fcf7f0;
  background-color: #ffffffbb;
  max-width: 800px;
  display: flex;

  justify-content: center;
  margin: 20px auto;
}

.newproduct {
  color: #fff;
  border-radius: 5px;
  font-size: 22px;
  padding: 5px 65px;
  font-weight: 800;
  background: #afc7d8;
  margin-top: 10px;
  margin-bottom: 20px;
}
.search {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search_input {
  background: none;
  border: none;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  margin-left: 50px;
}
.type_select {
  background: none;
  padding: 10px 15px;
  border: none;
  outline: none;
  box-shadow: none;
  background-color: transparent;
}
.filter_btn {
  border: none;
  background: none;
  padding: 3px 15px;
  font-weight: 800;
  color: #fff;
}
</style>
