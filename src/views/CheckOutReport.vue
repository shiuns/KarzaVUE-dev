<template>
  <div class="my-3 justify-content-center d-flex align-item-center">
    <div class="card col-6 shadow-lg">
      <div class="row p-2 mt-3 justify-content-between mx-sm-2">
        <div class="col-4"></div>
        <div class="col-4">
          <div
            class="col justify-content-center align-items-center titletextset"
          >
            <h3 class="w-100">結帳結果頁</h3>
          </div>
        </div>
        <div class="col-4">
          <h4 class="irc_mi img-fluid bell">Karza!</h4>
        </div>
      </div>
      <div class="row mx-auto justify-content-center text-center">
        <div class="col-12 mt-3">
          <nav aria-label="breadcrumb" class="second"></nav>
        </div>
      </div>

      <div class="d-flex flex-column justify-content-around align-items-center">
        <div class="col-6">
          <div class="card border-0">
            <div class="card-header pb-0">
              <p class="text-muted mt-4 space">訂單資訊</p>
              <hr class="my-2" />
            </div>
            <div class="card-body">
              <div class="row justify-content-between">
                <div class="col-auto mt-0">
                  <div>付款編號:</div>

                  <div>{{ paymentID }}</div>
                  <br />
                  <div>結帳日期:</div>
                  <div>
                    {{ foramtDateTime(orderDetail.orderDate) }}
                  </div>
                  <br />
                  <div>訂單狀態:</div>
                  <div>{{ getOrderState }}</div>
                  <br />
                  <div>運送地址:</div>
                  <div>{{ orderDetail.address }}</div>
                </div>
                <div class="col-auto"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="card border-0">
            <div class="card-header">
              <p class="card-text text-muted mt-4 space">商品明細</p>
              <hr class="my-2" />

              <div class="">
                <div v-for="item in orderItems.$values" :key="item.orderId">
                  <div>名稱: {{ item.productName }}</div>
                  <br />

                  <div>數量: {{ item.productNumber }}</div>
                  <br />

                  <div>金額: {{ item.productPrice * item.productNumber }}</div>

                  <br />
                </div>
                <div>原價: {{ paymentData.toatalBefore }}</div>
                <br />

                <div>折扣金額: {{ paymentData.minusAmount }}</div>
                <br />

                <div>總金額: {{ orderDetail.total }}</div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router";

export default {
  data() {
    return {
      orderDetail: {},
      orderItems: {},
      // vue loading
      loading: false,
      hasTakeDatas: false,
      paymentData: {},
      errSweetAlert: {
        title: "錯誤",
        icon: "error",
        confirmButtonText: "確定",
        confirmButtonColor: "#41b882",
        // timer: 2000,
      },
      successSweetAlert: {
        title: "成功",
        icon: "success",
        confirmButtonText: "確定",
        confirmButtonColor: "#41b882",
        // timer: 2000,
      },
    };
  },
  // setup() {
  //   const router = useRouter();
  //   const route = useRoute();

  //   const toHomePage = () => {
  //     router.push(`/homepage`);
  //   };
  //   return { toHomePage };
  // },
  async created() {
    console.log(this.paymentID);
    await this.GetPaymentResult();
    this.orderDetail = this.paymentData.orderDetail;
    this.orderItems = this.orderDetail.orderItems;
    console.log(this.orderItems);
  },
  computed: {
    paymentID() {
      return this.$route.params.id;
    },
    getOrderState() {
      let StateName = "";
      if (this.paymentData) {
        if (this.paymentData.orderDetail) {
          switch (this.paymentData.orderDetail.state) {
            case -1:
              StateName = "待付款";
              break;
            case 0:
              StateName = "未出貨";
              break;
            case 1:
              StateName = "已出貨";
              break;
            case 2:
              StateName = "運送中";
              break;
            case 3:
              StateName = "已簽收";
              break;
            case 4:
              StateName = "已完成";
              break;
          }
        }
      }
      return StateName;
    },
  },

  methods: {
    /*================================== 公用函式  =================================== */
    // 格式化Datime
    foramtDateTime(str) {
      let dateTime = new Date(str);

      let year = dateTime.getFullYear();
      let month = dateTime.getMonth();
      let day = dateTime.getDate();
      let h = dateTime.getHours();
      let m = dateTime.getMinutes();
      let s = dateTime.getSeconds();

      return `${year}/${month}/${day}/ ${h}:${m}:${s}`;
    },
    /*================================== 結帳行為及api  =================================== */
    async GetPaymentResult() {
      console.log(this.paymentID);
      await axios
        .get(
          `https://localhost:7259/api/ShoppingCart/GetPaymentResult?paymentId=${this.paymentID}`
        )
        .then((res) => {
          if (res.data) {
            this.paymentData = res.data.data;
            console.log(this.paymentData);
            // 有資料才show
            this.hasTakeDatas = true;
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          this.errSweetAlert.text = error.response.data.messsage || "其他錯誤";
          this.$swal.fire(this.errSweetAlert);
          this.errSweetAlert.text = "";
        });
    },
  },
  components: {},
};
</script>
<style scoped>
.space {
  letter-spacing: 0.8px !important;
}

.second a:hover {
  color: rgb(92, 92, 92);
}

.titletextset {
  text-align: center;
}

a {
  text-decoration: none !important;
  color: #aaa;
}

.btn-lg,
.form-control-sm:focus,
.form-control-sm:active,
a:focus,
a:active {
  outline: none !important;
  box-shadow: none !important;
}

.form-control-sm:focus {
  border: 1.5px solid #4bb8a9;
}

.btn-group-lg > .btn,
.btn-lg {
  padding: 0.5rem 0.1rem;
  font-size: 1rem;
  border-radius: 0;
  color: white !important;
  background-color: #4bb8a9;
  height: 2.8rem !important;
  border-radius: 0.2rem !important;
}

.btn-group-lg > .btn:hover,
.btn-lg:hover {
  background-color: #26a69a;
}

.btn-outline-primary {
  background-color: #fff !important;
  color: #4bb8a9 !important;
  border-radius: 0.2rem !important;
  border: 1px solid #4bb8a9;
}

.btn-outline-primary:hover {
  background-color: #4bb8a9 !important;
  color: #fff !important;
  border: 1px solid #4bb8a9;
}

.card-2 {
  margin-top: 40px !important;
}

.card-header {
  background-color: #fff;
  border-bottom: 0px solid #aaaa !important;
}

p {
  font-size: 13px;
}

.small {
  font-size: 9px !important;
}

.form-control-sm {
  height: calc(2.2em + 0.5rem + 2px);
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.boxed {
  padding: 0px 8px 0 8px;
  background-color: #4bb8a9;
  color: white;
}

.boxed-1 {
  padding: 0px 8px 0 8px;
  color: black !important;
  border: 1px solid #aaaa;
}

.bell {
  opacity: 0.5;
  cursor: pointer;
  text-align: end;
}

@media (max-width: 767px) {
  .breadcrumb-item + .breadcrumb-item {
    padding-left: 0;
  }
}
</style>
