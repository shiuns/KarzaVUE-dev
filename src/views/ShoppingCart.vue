<template>
  <div class="container">
    <CashView ref="CashView"></CashView>
  </div>
</template>


<script>
export default {
  mounted() {
    // 查看是否有sessionStorage, 有的話加入購物車, 並清空sessionStorage
    let productItem = JSON.parse(sessionStorage.getItem("productSelItem"));

    if (productItem) {
      this.$refs.CashView.addToCart(productItem, 3);
      sessionStorage.removeItem("productSelItem");
    }
  },
};
</script>