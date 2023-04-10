<template>
  <div class="container">
    <div class="content">
      <div class="insert_forgotpassword">
        <div class="forgotpassword_user">忘記密碼</div>
        <!-- <div class="flex_middle">
          <label for="name" class="forgotpassword_text">姓名 :　</label>
          <input
            id="name"
            type="text"
            v-model="realname"
            placeholder="請輸入姓名"
            class="form-control"
            required
          />
        </div> -->
        <div class="flex_middle">
          <label for="account" class="forgotpassword_text">帳號 :　</label>
          <input
            id="account"
            type="email"
            v-model="account"
            placeholder="請輸入Email"
            class="form-control"
            required
          />
        </div>
        <!-- <div class="flex_middle">
          <label for="phone" class="forgotpassword_text">電話 :　</label>
          <input
            id="phone"
            type="text"
            v-model="mobilenumber"
            placeholder="請輸入手機號碼"
            class="form-control"
            required
          />
        </div> -->
        <button @click="forgotpassword" class="btn forgotpassword_btn">
          送出
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import utility from "../../../public/utility.js";
import axios from "axios";
export default {
  data() {
    return {
      // realname: "",
      // mobilenumber: "",
      account: "",
    };
  },
  mixins: [utility],
  methods: {
    forgotpassword() {
      axios
        .post("https://localhost:7259/api/Members/ForgotPassword", {
          // RealName: this.realname,
          // Mobile: this.mobilenumber,
          EmailAccount: this.account,

        })
        .then((response) => {
          if (response.data === "資料有誤") {
            this.showAlert("資料有誤");
          } else {
            this.showAlert("請至信箱查看新密碼");
            this.$router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.content {
  margin: 69px auto;
  width: 450px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #c7cad6;
}
.insert_forgotpassword {
  padding: 40px 60px 50px;
  border-radius: 20px;
}
.forgotpassword_user {
  text-align: center;
  font-size: 30px;
  margin-bottom: 35px;
  letter-spacing: 1.5px;
}
.flex_middle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
}

.flex_middle input {
  width: 280px;
  padding: 5px 10px;
}
.forgotpassword_text {
  font-size: 16px;
}
.register_text {
  font-size: 16px;
  font-weight: bolder;
  color: #8991a9;
}
.forgotpassword_btn {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: #afc7d8;
  color: white;
  margin-top: 10px;
}
</style>
