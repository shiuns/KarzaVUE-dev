<template>
  <div class="container">
    <div class="row d-flex justify-content-center align-items-center w-100">
      <div class="content col-9">
        <h1 class="titleColor m-0">個人資訊</h1>
        <div class="profile_header">
          <img :src="showPhoto" alt="" class="profileImg" />
          <div class="info">
            <p>姓名 : {{ users.realName }}</p>
            <p>暱稱 : {{ users.nickName }}</p>
            <p>帳號 : {{ users.emailAccount }}</p>
            <p>
              密碼 : ．．．
              <RouterLink to="/EditPassword" class="btn edit_password_btn"
                ><i class="fa-solid fa-pencil text-light"> </i> 變更</RouterLink
              >
            </p>

            <p>手機 : {{ users.mobile }}</p>
            <p>生日 : {{ users.birthOfDate }}</p>
            <p>地址 : {{ users.address }}</p>
            <p>關於 : <br />{{ users.about }}</p>
            <div class="d-flex justify-content-end">
              <RouterLink to="/EditProfile" class="btn profile_edit_btn"
                >編輯資料</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utility from "../../../public/utility.js";
// import axios from 'axios'

export default {
  data() {
    return {
      users: {},
      showPhoto: "",
    };
  },
  mixins: [utility],
  async created() {
    let id = await this.fetchMemberId();

    axios
      .get(`https://localhost:7259/api/Members/Profile?id=${id}`, {
        headers: {
          Authorization: "Bearer " + $.cookie("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        this.users = response.data;
        if (response.data.birthOfDate)
          this.users.birthOfDate = this.users.birthOfDate.substring(0, 10);
        this.showPhoto = `https://localhost:7259/Images/${response.data.photoSticker}`;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.info {
  font-size: 18.5px;
  line-height: 50px;
  margin-top: 50px;
  margin-left: 60px;
}
p {
  margin: 0;
}
.titleColor {
  color: #8991a9;
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
.profile_header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.profile_edit_btn {
  text-decoration: none;
  border: none;
  background: #afc7d8;
  border-radius: 5px;
  color: #ffffff;
}

.profileImg {
  border: 3px solid #fff;
  box-shadow: 0 1px 5px rgba(25, 25, 25, 0.15);
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
}
.edit_password_btn {
  background: rgba(211, 152, 153, 0.8);
  border: none;
  border-radius: 5px;
  color: #ffffff;
  height: 30px;
  text-align: center;
  padding: 5px;
}
</style>
