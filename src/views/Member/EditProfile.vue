<template>
  <div class="container">
    <div class="row d-flex justify-content-center align-items-center w-100">
      <div class="content col-9">
        <div class="edit_profile_header">
          <h1 class="m-0">編輯資訊</h1>
        </div>
        <div class="edit_profile">
          <div
            class="d-flex flex-column justify-content-center align-items-end"
          >
            <img :src="photoData" class="profileImg" />
            <button for="" class="btn file-label" @click="uploadpicture">
              <i class="fa-solid fa-pencil text-light"></i>
            </button>
            <input
              id="file-input"
              class="file-input"
              type="file"
              ref="fileSticker"
              @change="handleFileChange"
            />
          </div>

          <div class="edit_profile_right">
            <div class="mb-3 d-flex align-items-center mt-5">
              <label for="floatingInputRealname" class="w-25">姓名：</label>
              <input
                type="text"
                class="form-control"
                id="floatingInputRealname"
                placeholder=""
                v-model="realname"
              />
            </div>
            <div class="mb-3 d-flex align-items-center">
              <label for="floatingInputNickname" class="w-25">暱稱：</label>
              <input
                type="text"
                class="form-control"
                id="floatingInputNickname"
                placeholder=""
                v-model="nickname"
              />
            </div>
            <div class="mb-3 d-flex align-items-center">
              <label for="floatingInputBirthday" class="w-25">生日：</label>
              <input
                type="text"
                class="form-control"
                id="floatingInputBirthday"
                placeholder=""
                v-model="birthday"
              />
            </div>

            <div class="mb-3 d-flex align-items-center">
              <label for="floatingInputMobile" class="w-25">手機：</label>
              <input
                type="text"
                class="form-control"
                id="floatingInputMobile"
                placeholder=""
                v-model="mobile"
              />
            </div>

            <div class="mb-3 d-flex align-items-center">
              <label for="floatingInputAddress" class="w-25">地址：</label>
              <input
                type="text"
                class="form-control"
                id="floatingInputAddress"
                placeholder=""
                v-model="address"
              />
            </div>

            <div class="mb-3 d-flex">
              <label for="textareaAbout" class="form-label w-25">關於：</label>
              <textarea
                class="form-control"
                id="textareaAbout"
                rows="5"
                v-model="about"
              ></textarea>
            </div>
            <div class="d-flex justify-content-end">
              <button class="btn edit_profile_submit_btn" @click="submitForm">
                送出
              </button>
            </div>
          </div>
        </div>
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
      realname: "",
      nickname: "",
      birthday: "",
      mobile: "",
      address: "",
      about: "",
      selectedFile: null,
      photoData: {},
    };
  },
  mixins: [utility],
  async created() {
    let id = await this.fetchMemberId();

    await axios
      .get(`https://localhost:7259/api/Members/Profile?id=${id}`, {
        headers: {
          Authorization: "Bearer " + $.cookie("token"),
        },
      })
      .then((response) => {
        if (response.data.birthOfDate)
          this.birthday = response.data.birthOfDate.substring(0, 10);

        if (response.data.realName === null) this.realname = "";
        else this.realname = response.data.realName;
        
        if (response.data.mobile === null) this.mobile = "";
        else this.mobile = response.data.mobile;

        this.nickname = response.data.nickName;

        if (response.data.address === null) this.address = "";
        else this.address = response.data.address;

        if (response.data.about === null) this.about = "";
        else this.about = response.data.about;

        if (response.data.photoSticker)
          this.photoData = `https://localhost:7259/Images/${response.data.photoSticker}`;
        else
          this.photoData = new URL("../../assets/userPic.png", import.meta.url);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    uploadpicture() {
      this.$refs.fileSticker.click();
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.photoData = reader.result;
      };
    },
    async submitForm() {
      if (!this.nickname) {
        this.showAlert("要有暱稱唷!");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile);
      formData.append("RealName", this.realname);
      formData.append("NickName", this.nickname);
      formData.append("birthOfDate", this.birthday);
      formData.append("Mobile", this.mobile);
      formData.append("Address", this.address);
      formData.append("About", this.about);

      try {
        const response = await axios.post(
          "https://localhost:7259/api/Members/EditProfile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + $.cookie("token"),
            },
          }
        );

        this.$router.go(0);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.aboutLabel {
  width: 95px;
}
.content {
  height: fit-content;
  border-radius: 15px;
  background-color: white;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #c7cad6;
  margin: 50px 0px;
  padding: 50px 50px 50px 50px;
}
.edit_profile_header {
  color: #8991a9;
}
.edit_profile {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.profileImg {
  border: 3px solid #fff;
  box-shadow: 0 1px 5px rgba(25, 25, 25, 0.15);
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
}
.edit_profile_right {
  width: 300px;
  color: #8991a9;
  font-size: 18.5px;
}

.edit_profile_submit_btn {
  background: #afc7d8;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  color: #ffffff;
}

.file-label {
  background: #afc7d8;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  width: fit-content;
  height: fit-content;
}
.file-input {
  display: none;
}

.text_about {
  display: block;
  width: 370px;
  height: 100px;
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.text_about:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
