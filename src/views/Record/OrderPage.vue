<template>
  <div class="content">
    <h4>我的訂單紀錄</h4>
    <div class="line mb-4"></div>

    <div
      class="outline"
      v-for="(item, index) in orderdetail"
      :key="index"
      v-show="!isempty && !isloading"
    >
      <div
        class="prooutline container-fluid"
        data-bs-toggle="collapse"
        :data-bs-target="`#index${item.id}`"
      >
        <div class="row align-items-center">
          <div class="col-1"><i class="fa-solid fa-clipboard"></i></div>
        </div>
        <div class="row">
          <div class="col-1"></div>
          <div class="col-8">
            <p class="">訂單編號:{{ item.paymentId }}</p>
            <p class="">優惠券:{{ item.usedCoupon }}</p>

            <p class="">收件資訊: {{ item.address }}</p>
          </div>
          <div class="col-3">
            <p class="totalloca">總金額: ${{ item.total }}</p>
          </div>
        </div>
      </div>

      <div
        class="col prooutline2 container-fluid collapsing justify-content-center align-items-center"
        :id="`index${item.id}`"
      >
        <div
          class="row procard d-flex justify-content-center align-items-center"
          v-for="(orderitem, index) in item.orderItems"
          :key="index"
        >
          <div class="col-3">
            <img
              class="pic"
              :src="
                'https://localhost:7027/ProductImgFiles/' + orderitem.source
              "
              alt=""
            />
          </div>
          <div class="col-5">
            <p class="text-start">{{ orderitem.productName }}</p>
          </div>
          <div class="col-2">
            <p>數量:{{ orderitem.productNumber }}</p>
          </div>
          <div class="col-2">
            <p>${{ orderitem.productPrice }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-show="isempty && !isloading">目前沒有訂單~</div>
    <div v-show="isloading" class="image-container">
      <img src="../../assets/Spinner-1s-200px-2.gif" alt="" />
    </div>
  </div>
</template>

<script>
import utility from "../../../public/utility";
export default {
  mixins: [utility],
  data() {
    return {
      orderdetail: [],
      orderitems: [],
      orderid: 0,
      showprodu: "",
      noorder: "",
      itemid: "",
      isempty: false,
      isloading: true,
    };
  },

  mounted() {
    this.getOD();
    // this.getOI(id);
  },

  created() {},

  methods: {
    async getOD() {
      let memberId = await this.fetchMemberId();
      this.isloading = true;
      this.isempty = false;
      axios
        .get(
          `https://localhost:7259/api/OrderDetail/GetMemberOrder?memberid=${memberId}`
        )
        .then((res) => {
          this.isloading = false;
          if (res.data.length > 0) {
            console.log(res.data);
            this.orderdetail = res.data;
          } else {
            // this.noorder = "<span>目前暫無訂單~</span>";
            this.isempty = true;
          }
        })
        .catch((err) => {});
    },
  },
};
</script>

<style scoped>
.pic {
  width: 110px;
  height: 90px;
  margin-right: 20px;
}
.procard {
  width: 100%;

  display: block;
  margin-bottom: 1rem;
  padding: 10px;
  text-align: center;
}
.prooutline {
  background-color: #b9c9d61d;
  border-radius: 0.5rem;
  justify-content: center;
  align-items: center;
  word-wrap: normal;
  cursor: pointer;
  margin-bottom: 10px;
}
.prooutline2 {
  border-radius: 0.5rem;
  /* justify-content: center; */
  align-items: center;
  word-wrap: normal;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.073);
}
.line {
  height: 1px;
  background-color: #a3a3a3;
}
.image-container {
  position: absolute;
  top: 20%;
  left: 52%;
  /* transform: translate(-50%, -50%); */
}
.image-container img {
  width: 80%;
  height: auto;
  max-height: 80%;
}
.content {
  padding: 20px 50px;
}
</style>
