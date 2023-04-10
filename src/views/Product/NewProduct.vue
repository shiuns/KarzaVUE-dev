<template>
  <div
    class="col-md-3 justify-content-center"
    v-for="item in products"
    :key="item.id"
  >
    <div class="card card1">
      <router-link :to="/Product/ + item.id">
        <div class="card-img-top">
          <img
            class="d-block w-100 h-236px"
            :src="'https://localhost:7027/ProductImgFiles/' + item.source"
            style="width: 100%; object-fit: cover"
            alt=""
          />
        </div>
        <!-- <img class="card-img-top d-block w-100 h200px object-fit-cover" src="./BS02/DQS-1.webp" alt=""> -->
        <div class="card-body fs-5">{{ item.name.slice(0, 18) }}...</div>
        <div class="card-footer bg-white border-top-0 price">
          <div class="me-3 fs-5">NTD {{ item.price.toLocaleString() }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: null,
    };
  },
  created() {
    this.CallNewProductsApi();
  },
  methods: {
    async CallNewProductsApi() {
      await axios
        .get("https://localhost:7259/api/Product/NewProducts")
        .then((response) => {
          this.products = response.data;
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
  color: #070707;
}
.card {
  margin-bottom: 45px;

  padding: 0;
}
.card1 img {
  transition: all 0.2s;
}
/* 放大效果 */
.card1:hover {
  transform: scale(1.1);
}
.price {
  display: flex;
  justify-content: end;
}
</style>
