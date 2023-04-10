<template>
  <div class="container">
    <div class="content">
      <div class="insert_register">
        <div class="register_user">註冊會員</div>
        <div class="flex_middle">
          <label for="nickName" class="me-3">暱稱 :　</label>
          <input
            id="nickName"
            type="text"
            v-model="nickname"
            placeholder="請輸入暱稱"
            class="form-control"
            required
          />
        </div>
        <div class="flex_middle">
          <label for="account" class="me-3">帳號 :　</label>
          <input
            id="account"
            type="email"
            v-model="account"
            placeholder="請輸入Email"
            class="form-control"
            required
          />
        </div>
        <div class="flex_middle">
          <label for="password" class="me-3">密碼 :　</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="請輸入密碼"
            class="form-control"
            required
          />
        </div>
        <div class="flex_middle">
          <label for="passwordConfirm" class="text-nowrap me-1"
            >確認密碼：</label
          >
          <input
            id="passwordConfirm"
            type="password"
            v-model="confirmPassword"
            placeholder="請確認密碼"
            class="form-control"
            required
          />
        </div>
        <button @click="register" class="btn register_btn">註冊</button>
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
      account: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    };
  },
  mixins: [utility],
  methods: {
    register() {
      var regExp =
        /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      if (!regExp.test(this.account)) {
        this.showAlert("E-mail格式不正確");
      }
      if (this.password !== this.confirmPassword) {
        this.showAlert("密碼不相符");
      } else
        axios
          .post("https://localhost:7259/api/Members/SignUp", {
            EmailAccount: this.account,
            EncryptedPassword: this.password,
            ConfirmEncryptedPassword: this.confirmPassword,
            NickName: this.nickname,
          })
          .then((response) => {
            if (response.data === "無法註冊這個帳號") {
              this.showAlert("無法註冊這個帳號");
            } else {
              this.showAlert("註冊成功，請至信箱啟用帳戶");
              this.$router.push("/");
            }
            //console.log(response.data);
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
.insert_register {
  padding: 40px 60px 50px;
  border-radius: 20px;
}
.register_user {
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
.flex_middle label {
  width: 100px;
  letter-spacing: 1px;
}
.register_btn {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: #afc7d8;
  color: white;
  margin-top: 10px;
}
</style>
