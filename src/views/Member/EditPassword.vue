<template>
  <section>
    <div class="container">
      <div class="content">
        <div class="insert_editpassword">
          <div class="editpassword_user">變更密碼</div>
          <div class="flex_middle">
            <label for="passwordOld" class="editpassword_text form-label"
              >輸入舊密碼 :　</label
            >
            <input
              id="passwordOld"
              type="password"
              v-model="oldpassword"
              placeholder=""
              class="form-control"
              required
            />
          </div>
          <div class="flex_middle">
            <label for="passwordNew" class="editpassword_text form-label"
              >輸入新密碼 :　</label
            >
            <input
              id="passwordNew"
              type="password"
              v-model="password"
              placeholder=""
              class="form-control"
              required
            />
          </div>
          <div class="flex_middle">
            <label for="passwordConfirm" class="editpassword_text form-label"
              >確認新密碼 :　</label
            >
            <input
              id="passwordConfirm"
              type="password"
              v-model="confirmpassword"
              placeholder=""
              class="form-control"
              required
            />
          </div>

          <button class="btn editpassword_btn" @click="editpassword">
            送出
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import utility from "../../../public/utility";
export default {
  mixins: [utility],
  data() {
    return {
      oldpassword: "",
      password: "",
      confirmpassword: "",
    };
  },
  methods: {
    editpassword() {
      if (!this.oldpassword || !this.password || !this.confirmpassword) {
        this.showAlert("必須填入密碼");
        return;
      }

      if (this.password !== this.confirmpassword) {
        this.showAlert("兩次密碼不一樣");
      } else
        axios
          .post(
            "https://localhost:7259/api/Members/EditPassword",
            {
              OldEncryptedPassword: this.oldpassword,
              EncryptedPassword: this.password,
              ConfirmEncryptedPassword: this.confirmpassword,
            },
            {
              headers: {
                Authorization: "Bearer " + $.cookie("token"),
              },
            }
          )
          .then((response) => {
            if (response.data === "密碼有誤") {
              this.showAlert("密碼有誤");
            } else {
              this.showAlert("密碼已修改");
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
.insert_editpassword {
  padding: 40px 60px 50px;
  border-radius: 20px;
}
.editpassword_user {
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
  width: 230px;
  padding: 5px 10px;
}

.editpassword_text {
  font-size: 16px;
}

.editpassword_btn {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: #afc7d8;
  color: white;
  margin-top: 10px;
}
</style>
