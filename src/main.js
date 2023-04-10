import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
//組件區
import CashView from "./components/CashView.vue";

//購物車區
//地址組件
import "@andy922200/vue-tw-zip-code-selector/dist/vue-tw-zip-code-selector.css";
import VueTwZipCodeSelector from "@andy922200/vue-tw-zip-code-selector";

//引入sweetalert2 設定
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const options = {
  confirmButtonColor: "#afc7d8",
  cancelButtonColor: "#D39899",
  confirmButtonText: "確定",
  cancelButtonText: "取消",
};

//回到最上一頁
router.afterEach((to, from, next) => {
  window.scrollTo({ top: 0, behavior: "instant" });
});

const app = createApp(App);
app.component("CashView", CashView);
app.use(VueSweetalert2, options);
app.use(VueTwZipCodeSelector);
app.use(router);

app.mount("#app");
