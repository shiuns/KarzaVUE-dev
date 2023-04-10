<template>
  <div class="container cash-view my-4 p-0">
    <div class="row p-4">
      <div class="col-8">
        <h5 @click="showdata" class="pb-2">購物車商品</h5>

        <div class="px-3" data-aos="fade-up">
          <!-- testtttt -->
          <div v-for="(item, i) in cartsSelect" :key="item.Id">
            <div class="row align-items-center mb-3 carset">
              <div class="col-6 d-flex align-items-center">
                <img class="pic me-3" :src="item.Cover" alt="" />
                <p class="fw-bold">
                  {{ item.Name }}
                </p>
              </div>
              <div class="col-2">
                <div class="d-flex align-items-center">
                  <p>${{ item.Price.toLocaleString() }}</p>
                </div>
              </div>
              <div class="col-3">
                <div
                  class="row align-items-center justify-content-evenly qtyField"
                >
                  <button
                    class="p-0 border-0 bg-transparent col-3 align-items-center justify-content-center"
                  >
                    <i
                      class="fa-solid fa-minus text-center"
                      @click.stop="addToCart(item, 1, `.count-input-${i}`)"
                    ></i>
                  </button>

                  <div class="col-6 align-items-center justify-content-center">
                    <input
                      class="qtyinput text-center"
                      :class="`count-input-${i}`"
                      v-model="item.Qty"
                      type="input"
                      @blur.stop="addToCart(item, 2, `.count-input-${i}`)"
                    />
                  </div>

                  <button
                    class="p-0 border-0 bg-transparent col-3 align-items-center justify-content-center"
                  >
                    <i
                      class="fa-solid fa-plus"
                      @click.stop="addToCart(item, 0, `.count-input-${i}`)"
                    ></i>
                  </button>
                </div>
              </div>

              <a class="col-1" @click.stop="removeCartItem(item)">
                <i class="fa-solid fa-trash" style="color: #d39899"></i>
              </a>
            </div>
          </div>
          <div v-show="cartsSelect.length == 0">
            <div class="text-center">購物車無商品</div>
          </div>
          <!-- testtttt -->
        </div>
      </div>
      <div class="col-4">
        <h5 class="pb-2">購買資訊</h5>
        <div class="buy row">
          <div>地址</div>

          <div>
            <VueTwZipCodeSelector
              @getSelectedZone="getSelectedZone"
              class="address-coustomize"
            />
          </div>
          <div>
            <input
              v-model="adressinput"
              type="text"
              class="buyinput"
              placeholder="住址"
              @blur="getAdressInput"
            />
          </div>
          <div class="mt-3">優惠券</div>
          <div class="">
            <input
              v-model="couponinput"
              @blur.stop="getCoupon"
              type="text"
              class="buyinput"
              placeholder="優惠券代碼"
            />
          </div>
          <div class="" v-html="couponmessage"></div>
        </div>

        <div class="col b-bottom">
          <div class="row my-3 align-items-center justify-content-between">
            <p class="col-5">優惠券折扣</p>
            <p class="col-3">
              {{ showdiscountprice }}
            </p>
          </div>
          <div class="row align-items-center justify-content-between mb-3">
            <p class="col-5">已折扣金額</p>
            <p class="col-3">${{ countedPrice }}</p>
          </div>
          <div class="row align-items-center justify-content-between">
            <p class="col-5">總金額</p>
            <p class="col-3">${{ this.getTotal }}</p>
          </div>
        </div>

        <button
          type="button"
          class="w-100 my-3 buybutton"
          @click.stop="cartSubmit"
        >
          購買
        </button>
      </div>
    </div>
  </div>
  <div v-html="paymentForm"></div>
  <loading :active="loading"></loading>
</template>
<script>
import { useRouter, useRoute } from "vue-router";
import utility from "../../public/utility";
export default {
  mixins: [utility],
  data() {
    return {
      notFoundLink: "/notfound",
      MemberId: this.fetchMemberId(),
      headers: {},
      products: null,
      cartsSelect: [],
      searchText: "",
      paymentForm: "",
      adressval: null,
      adressinput: "",
      //折價券資料
      couponinput: "",
      couponmessage: "",
      coupondiscountdata: "",
      couponID: null,
      showdiscountprice: "$0",
      totalOrigin: 0,
      countedPrice: 0,
      // vue loading
      loading: false,
      // sweet alert訊息
      delSweetConfirm: {
        text: "要刪除此項目嗎",
        showCancelButton: true,
        confirmButtonText: "刪除",
        width: "220px",
      },
      buySweetConfirm: {
        text: "確定要購買嗎",
        showCancelButton: true,
        confirmButtonText: "購買",
        cancelButtonText: "取消",
        width: "220px",
      },
      successSweetAlert: {
        title: "成功",
        width: "220px",
        showConfirmButton: false,
        // timer: 2000,
      },
      errSweetAlert: {
        title: "錯誤",
        width: "220px",

        // timer: 2000,
      },
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const toNotFound = () => {
      router.push(`/notfound`);
    };

    return { toNotFound };
  },
  // 比mounted早 沒有html
  // created() {
  //   this.GetProducts();
  // },

  // 已經有html了
  mounted() {
    this.getStorageCart();
  },
  // 如果有反覆計算 不含複雜邏輯的地方 用computed效能比較高
  computed: {
    getTotal() {
      if (this.cartsSelect.length > 0) {
        let totalCount = this.cartsSelect
          .map((a) => a.Price * a.Qty) // 得到 price * qty 陣列 [100*2, 2000*5, 500 * 6]
          .reduce((a, b) => a + b); // 做累加 a累加值 b 下一個要累加的數 [200, 10000, 3000] => 200 + 10000 +300

        this.totalOrigin = totalCount;

        if (this.coupondiscountdata) {
          if (this.coupondiscountdata > 1) {
            totalCount = totalCount - parseInt(this.coupondiscountdata);
            this.showdiscountprice = `$ -${this.coupondiscountdata}`;
          } else {
            totalCount = parseInt(totalCount * this.coupondiscountdata);
            this.showdiscountprice = `${String(this.coupondiscountdata).slice(
              2
            )}折`;
          }
        }

        //加這個totalcount會變成零
        // if (this.coupondiscountdata < 1 ) {
        //      totalCount = totalCount * this.coupondiscountdata;
        //   }

        return totalCount;
      }
    },
  },
  methods: {
    /*================================== 公用函式  =================================== */

    showdata() {
      (this.couponinput = "frg582"), (this.adressinput = "精誠路24號五樓");
    },
    // 將物件轉JSON字串 存在指定localStorageName
    // saveName必須與data命名相同
    saveLocalStorage(saveName, val) {
      localStorage.setItem(saveName, JSON.stringify(val));
    },
    // 將localStorage 已存JSON字串轉回物件 存在指定data參數
    // saveName與data相同
    getlocalStorage(saveName) {
      this[saveName] = JSON.parse(localStorage.getItem(saveName)); // 與this.saveName相同
    },
    goNotFound() {
      this.toNotFound();
    },

    /*================================== 購物車行為及api  =================================== */

    //地址行為
    async getAdressInput() {
      console.log(this.adressinput);
    },

    async getSelectedZone(selc) {
      this.adressval = JSON.parse(JSON.stringify(selc.value));
      console.log(this.adressval);
    },

    //呼叫折價券api
    async getCoupon() {
      if (this.couponinput) {
        axios
          .get(
            `https://localhost:7259/api/ShoppingCart/CatchCoupon?CouponCode=${this.couponinput}`
          )
          .then((res) => {
            if (res.status == 204 || res.status == 200) {
              //折扣數
              this.coupondiscountdata = res.data.data.discount;
              this.couponmessage = `<span style="color: #8991a9;">${res.data.messsage}<\/span>`;
              this.couponID = res.data.data.id;
              this.countedPrice = this.totalOrigin - this.getTotal;
              // alert(`${this.couponID}`);
            }
          })
          .catch((err) => {
            this.couponmessage = `<span style="color: #d39899;">${err.response.data.messsage}<\/span>`;
            this.coupondiscountdata = "";
            this.couponinput = "";
            this.countedPrice = 0;
            this.showdiscountprice = "$0";
          });
      } else {
        this.coupondiscountdata = "";
        this.couponmessage = "";
        this.countedPrice = 0;
        this.showdiscountprice = "$0";
      }
    },

    // 從Storage取使用者購物車紀錄
    getStorageCart() {
      this.getlocalStorage("cartsSelect");
      // 防呆 假如storage沒存過 將值存為空陣列
      if (!this.cartsSelect) {
        this.cartsSelect = [];
      }
    },
    // 刪除使用者購物車紀錄
    rmStorageCart() {
      localStorage.removeItem("cartsSelect");
      this.cartsSelect = [];
    },

    // 加入購物車
    // 每次異動購物車都寫storage
    // mode: 0: 數量+1 1: 數量-1 2: 指定數量 3: 加入購物車
    async addToCart(item, mode, className) {
      // 點選 + - 或 直接輸入數量 (mode 0 1 2)
      if (mode != 3) {
        // 取得物件數量
        let input = document.querySelector(className);
        let count = input.value;
        // 此物件index
        let findIndex = this.cartsSelect.indexOf(item);

        console.log("findIndex", findIndex);
        console.log("input", input);
        console.log("count", count);

        // 假如數量 = 1 且按下-按鈕 (mode = 1)
        if (mode == 1 && count == 1) {
          // 刪除動作
          this.removeCartItem(item);
          return;
        }

        // 假如數量 = 1 指定數量為0 (mode = 2)
        if (mode == 2 && count == 0) {
          // 刪除動作
          this.removeCartItem(item, true);
          return;
        }

        // 依照mode改變數量
        switch (mode) {
          case 0:
            this.cartsSelect[findIndex].Qty++;
            break;
          case 1:
            this.cartsSelect[findIndex].Qty--;
            break;
          case 2:
            this.cartsSelect[findIndex].Qty = count;
            break;
        }

        // 儲存到storage
        this.saveLocalStorage("cartsSelect", this.cartsSelect);
      } else {
        // 點選加入購物車(mode 3)

        // 防呆 依id確認購物車有沒有商品 有的話更新陣列數量+1 沒有新增一筆
        let findProduct = this.cartsSelect.find((a) => a.Id == item.id);
        console.log("findProduct add", findProduct);

        if (findProduct) {
          // 已在購物車 找到index 修改物件值
          let index = this.cartsSelect.indexOf(findProduct);
          this.cartsSelect[index].Qty++;
        } else {
          // 未在購物車 加入陣列
          this.cartsSelect.push({
            Id: item.id,
            Qty: 1,
            Name: item.name,
            Price: item.price,
            Cover: `https://localhost:7027/ProductImgFiles/${item.source[0]}`,
          });
        }

        // 儲存到storage
        this.saveLocalStorage("cartsSelect", this.cartsSelect);
      }

      console.log(this.cartsSelect);
    },

    // 刪除購物車內容
    async removeCartItem(item, getDefaultVal) {
      let index = this.cartsSelect.indexOf(item);
      // 找不到index會是-1 找得到才刪
      if (index > -1) {
        // 確認刪除
        this.$swal.fire(this.delSweetConfirm).then((result) => {
          if (result.isConfirmed) {
            // 按下刪除
            this.cartsSelect.splice(index, 1); // 刪除陣列元素
            // 儲存到storage
            this.saveLocalStorage("cartsSelect", this.cartsSelect);
          } else {
            // 按下取消
            // 從storage取回預設值 (數量input blur後值會改變 所以要回歸預設值)
            if (getDefaultVal) {
              this.getlocalStorage("cartsSelect");
            }
          }
        });
      }
    },
    /*
      購物車提交:
      1. 將購物車提交至後端並儲存訂單、產生綠界付款需要的參數
      2. http狀態 200 得到付款參數 用付款參數組form
      3. 提交表單到綠界支付 並清空參數及購物車
    */
    async cartSubmit() {
      // 確認購買
      let id = await this.fetchMemberId();
      await this.$swal.fire(this.buySweetConfirm).then((result) => {
        if (result.isConfirmed) {
          if (
            !this.adressval ||
            !this.adressval.name ||
            !this.adressval.zipCode ||
            !this.adressval.county ||
            !this.adressval.countyName ||
            !this.adressinput
          ) {
            this.errSweetAlert.text = "請輸入完整地址";
            this.$swal.fire(this.errSweetAlert);
            this.errSweetAlert.text = "";
            return;
          }

          // 按下購買
          let model = {
            MemberId: id,
            State: 0,
            Total: this.getTotal,
            CartProducts: Array.from(this.cartsSelect),
            CouponCode: this.couponinput,
            CouponData: {
              UsedCouponID: this.couponID,
              CouponCode: this.couponinput,
              Discount: parseInt(this.coupondiscountdata),
            },
            Adress: {
              Name: this.adressval.name,
              ZipCode: this.adressval.zipCode,
              County: this.adressval.county,
              CountyName: this.adressval.countyName,
              InputRegion: this.adressinput,
            },
          };

          this.loading = true;
          axios
            .post(
              `https://localhost:7259/api/ShoppingCart/SaveShoppingCart`,
              model
            )
            .then((res) => {
              if (res.status == 204 || res.status == 200) {
                if ((res.data !== null) & (res.data !== undefined)) {
                  // 成功清購物車
                  this.rmStorageCart();
                  // alert訊息
                  this.successSweetAlert.text = res.data.messsage;
                  this.$swal.fire(this.successSweetAlert);
                  this.successSweetAlert.text = "";
                  /*
                    提交成功將後端產的付款參數組成form 並存在paymentForm
                    因為 <div v-html="paymentForm"></div> 使用v-html
                    用字串拼接的form將以html方式顯示在網頁
                  */
                  this.paymentForm = this.buildPaymentForm(
                    res.data.data.formData // 後端回傳付款參數
                  );
                  this.loading = false;
                  /*
                    Vue更新html並不會即時反應(因為他是操作虛擬Dom 不是直接操作Dom元素)，
                    若直接使用document.getElementById("payment")會抓不到
                    必須使用$nextTick: 在下次畫面更新後做事
                  */
                  this.$nextTick(() => {
                    // 將表單內容post到綠界金流
                    document.querySelector("#payment").submit();
                    this.paymentForm = "";
                  });
                }
              }
            })
            .catch((err) => {
              console.log(err.response.data);
              this.errSweetAlert.text =
                err.response.data.messsage || "其他錯誤";
              this.$swal.fire(this.errSweetAlert);
              this.errSweetAlert.text = "";
              this.loading = false;
            });
        }
      });
    },

    // 購買後將後端產的付款參數組成form post到綠界
    buildPaymentForm(trendModels) {
      let rtn = ``;
      rtn += `<form action="${trendModels.url}" method="post" id="payment">`;
      // 必要參數
      rtn += `<input type="hidden" name="MerchantID" value="${trendModels.merchantID}"\/>`;
      rtn += `<input type="hidden" name="MerchantTradeNo" value="${trendModels.merchantTradeNo}"\/>`;
      rtn += `<input type="hidden" name="MerchantTradeDate" value="${trendModels.merchantTradeDate}"\/>`;
      rtn += `<input type="hidden" name="PaymentType" value="${trendModels.paymentType}"\/>`;
      rtn += `<input type="hidden" name="TotalAmount" value="${trendModels.totalAmount}"\/>`;
      rtn += `<input type="hidden" name="TradeDesc" value="${trendModels.tradeDesc}"\/>`;
      rtn += `<input type="hidden" name="ItemName" value="${trendModels.itemName}"\/>`;
      rtn += `<input type="hidden" name="ReturnURL" value="${trendModels.returnURL}"\/>`;
      rtn += `<input type="hidden" name="ChoosePayment" value="${trendModels.choosePayment}"\/>`;
      rtn += `<input type="hidden" name="CheckMacValue" value="${trendModels.checkMacValue}"\/>`;
      rtn += `<input type="hidden" name="EncryptType" value="${trendModels.encryptType}"\/>`;
      // Optional
      if (trendModels.storeID) {
        rtn += `<input type="hidden" name="StoreID" value="${trendModels.storeID}"\/>`;
      }

      if (trendModels.clientBackURL) {
        rtn += `<input type="hidden" name="ClientBackURL" value="${trendModels.clientBackURL}"\/>`;
      }

      if (trendModels.itemURL) {
        rtn += `<input type="hidden" name="ItemURL" value="${trendModels.itemURL}"\/>`;
      }

      if (trendModels.remark) {
        rtn += `<input type="hidden" name="Remark" value="${trendModels.remark}"\/>`;
      }

      if (trendModels.chooseSubPayment) {
        rtn += `<input type="hidden" name="ChooseSubPayment" value="${trendModels.chooseSubPayment}"\/>`;
      }

      if (trendModels.orderResultURL) {
        rtn += `<input type="hidden" name="OrderResultURL" value="${trendModels.orderResultURL}"\/>`;
      }

      if (trendModels.needExtraPaidInfo) {
        rtn += `<input type="hidden" name="NeedExtraPaidInfo" value="${trendModels.needExtraPaidInfo}"\/>`;
      }

      if (trendModels.ignorePayment) {
        rtn += `<input type="hidden" name="IgnorePayment" value="${trendModels.ignorePayment}"\/>`;
      }

      if (trendModels.platformID) {
        rtn += `<input type="hidden" name="PlatformID" value="${trendModels.platformID}"\/>`;
      }

      if (trendModels.invoiceMark) {
        rtn += `<input type="hidden" name="InvoiceMark" value="${trendModels.invoiceMark}"\/>`;
      }

      if (trendModels.customField1) {
        rtn += `<input type="hidden" name="CustomField1" value="${trendModels.customField1}"\/>`;
      }

      if (trendModels.customField2) {
        rtn += `<input type="hidden" name="CustomField2" value="${trendModels.customField2}"\/>`;
      }

      if (trendModels.customField3) {
        rtn += `<input type="hidden" name="CustomField3" value="${trendModels.customField3}"\/>`;
      }

      if (trendModels.customField4) {
        rtn += `<input type="hidden" name="CustomField4" value="${trendModels.customField4}"\/>`;
      }

      if (trendModels.language) {
        rtn += `<input type="hidden" name="Language" value="${trendModels.language}"\/>`;
      }

      if (trendModels.unionPay) {
        rtn += `<input type="hidden" name="UnionPay" value="${trendModels.unionPay}"\/>`;
      }
      rtn += `</form>`;

      return rtn;
    },

    /*================================== 棄用但供參考函式  =================================== */

    // (棄用) 每案一次就post一次舊寫法 供參考
    // async addToCart(item, mode, className) {
    //   let input = document.querySelector(className);
    //   let count = document.querySelector(className).value;
    //   let qty = 1;

    //   if (mode == 1 && count == 1) {
    //     alert("數量不得為零");
    //     return;
    //   }

    //   if (mode == 2 && count == 0) {
    //     input.value = 1;
    //     alert("數量不得為零");
    //     return;
    //   }

    //   if (mode == 2) {
    //     qty = count;
    //   }

    //   let model = {
    //     Id: item.id,
    //     Qty: qty,
    //     Name: item.name,
    //   };

    //   await this.$axios
    //     .post(`api/ShoppingCart/AddToCart/1/${mode}`, model)
    //     .then((res) => {
    //       if (res.status == 204 || res.status == 200) {
    //         if ((res.data !== null) & (res.data !== undefined)) {
    //           this.cartsSelect = Array.from(res.data.data);
    //           alert(res.data.messsage);
    //           location.href = "homepage";
    //         }
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err.response.data);
    //       alert(err.response.data.messsage);
    //     });
    // },

    // (棄用)新寫法不用抓購物車資訊
    // async GetUsrCart() {
    //   await this.$axios
    //     .get(`api/ShoppingCart/GetUserCart?userId=1`)
    //     .then((res) => {
    //       if (res.data) {
    //         this.cartsSelect = Array.from(res.data.data);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(err.response.data);
    //     });
    // },
  },
  components: {},
};
</script>

<style>
.cash-view .address-coustomize select {
  height: 40px;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  border: 1px solid #44444462;
  margin: 0px;
  border-radius: 10px;
  color: #444444;
  width: 50%;
  padding: 5px;
}
.cash-view .address-coustomize select:nth-of-type(1) {
  margin-right: 15px;
}
.cash-view .address-coustomize select:focus {
  border: 2px solid #afc7d8;
}

.cash-view .address-coustomize {
  padding: 0;
}
</style>
<style scoped>
.cash-view {
  /* line-height: 1rem; */
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 15px;
  background-color: #ffffff;
}
.cash-view .pic {
  width: 110px;
  height: 90px;
  object-fit: cover;
}
.qtyField {
  border: 1px solid #44444462;
  border-radius: 10px;
  height: 40px;
  margin: 10px;
}
/* 數量 */
.qtyinput {
  width: 100%;
  padding: 0;
  margin: 0;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  border: 0;
}
.qtyinput:focus {
  border-radius: 2px;
  background-color: #44444462;
  color: #fff;
}
.carset {
  /* box-shadow: 0 0 15px rgba(0, 0, 0, 0.1); */
  border-radius: 15px;
  /* border: 0.4px solid #44444462; */
  background-color: #fff;
  padding: 20px;
}
.carset:hover {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

/* 購買資訊卡片 */
.buy {
  padding: 15px;
  position: relative;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  height: 300px;
  width: 100%;
}
.buyinput {
  height: 40px;
  width: 100%;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  border: 1px solid #44444462;
  /* opacity: 0.8; */
  border-radius: 10px;
  color: #444444;
}
.buyinput:focus {
  border: 2px solid #afc7d8;
}

.b-bottom {
  border-bottom: 1px solid #afc7d8;
  padding-bottom: 20px;
}
.cash-view p {
  margin: 0px;
}

.buybutton {
  background: #afc7d8;
  border: 0cm;
  border-radius: 15px;
  padding: 10px;
  height: 2.5rem;
  color: #fff;
}

/* 更改地址 */

@media screen and (max-width: 576px) {
  .cash-view .card-scroll-x {
    max-height: none;
    overflow-y: auto;
  }
}
</style>
