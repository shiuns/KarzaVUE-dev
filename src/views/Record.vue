<script>
import { RouterLink, RouterView } from "vue-router";
import utility from "../../public/utility";
export default {
  data() {
    return {
      profile: [],
    };
  },
  mixins: [utility],
  mounted() {
    this.getProfile();
  },
  methods: {
    async getProfile() {
      let id = await this.fetchMemberId();

      if (id != 0) {
        fetch(`https://localhost:7259/api/Members/Profile?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `bearer ${$.cookie("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            this.profile = data;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
};
</script>

<template>
  <div class="d-flex m-5 reordpanel">
    <nav class="nav">
      <div class="info">
        <img
          v-if="profile.photoSticker == null"
          src="../assets/userPic.png"
          alt=""
        />
        <img
          v-else
          :src="'https://localhost:7259/Images/' + profile.photoSticker"
          alt=""
        />
        <p class="nickName">{{ profile.nickName }}</p>
      </div>
      <div class="linklist">
        <RouterLink to="/Record/ActivitySaved">活動收藏</RouterLink>

        <RouterLink to="/Record/ActivityEnrolled">活動報名</RouterLink>

        <RouterLink to="/Record/Favorite">商品收藏</RouterLink>
        <RouterLink to="/Record/OrderPage">訂單記錄</RouterLink>
      </div>
    </nav>

    <div class="record">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.reordpanel {
  display: flex;
  justify-content: center;
}
.nav {
  margin-right: 80px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 180px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}
.nickName {
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}
.info img {
  width: 80px;
  height: 80px;

  border: 0.5px solid gray;
  border-radius: 50%;
  object-fit: cover;
}
.linklist {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.record {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  min-height: 80vh;
}
a {
  text-decoration: none;
  color: #444;
  padding: 5px;
}
a:hover {
  background-color: #8991a9;
  color: #fff;
  border-radius: 10px;
}
@media (max-width: 992px) {
  .reordpanel {
    flex-direction: column;
    background-color: #fff;
    margin: 0px;
    min-width: 170px;
    border-radius: 10px;
  }

  .nav {
    margin: 0px auto;
    width: 100%;
    height: fit-content;
  }
  .record {
    background-color: #fff;
    padding: 0px;
    border-radius: 0px;
    max-width: 100%;
    min-width: 100%;
    width: 100%;
  }
  .linklist {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
