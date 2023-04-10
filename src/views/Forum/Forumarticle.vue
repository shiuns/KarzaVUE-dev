<template>
  <div class="post" v-for="item in showArticle" :key="item.id">
    <div class="d-flex align-items-center mb-2 justify-content-between">
      <div class="d-flex align-items-center justify-content-center">
        <p class="m-0 me-2">
          <i class="fa-solid fa-user-large me-2 userHead"></i>
          {{ item.nickName }}
        </p>
      </div>
      <p class="m-0 ms-3">{{ item.time.replace("T", " ").slice(0, 18) }}</p>
    </div>
    <router-link
      :to="`/Forum/ArticleDetail/${item.articleId}`"
      class="detailLink fs-4"
      >{{ item.title }}

      <img
        class="imgsss"
        :src="`https://localhost:7259/Images/${item.articlePhoto}`"
        alt=""
      />
    </router-link>
    <span class="foremName">{{ item.forumName }}</span>
    <p class="content mb-2">{{ item.content }}</p>
    <!-- <p class="">留言數：{{ item }}</p> -->
  </div>
</template>

<script>
export default {
  name: "ForumArticle",
  props: ["parentArticles"],
  data() {
    return {
      showArticle: [],
    };
  },
  watch: {
    parentArticles() {
      this.showArticle = this.parentArticles;
    },
  },
};
</script>

<style scoped>
.foremName {
  margin: 0;
  background-color: #f6f6f6;
  padding: 5px;
  border-radius: 10px;
  font-size: 15px;
}
.userHead {
  color: #afc7d8;
}
.detailLink {
  color: #444444;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.imgsss {
  width: 200px;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
}
.post {
  padding: 20px 20px 10px 20px;
  border-bottom: 0.1px solid #f6f6f6;
  box-shadow: 0px 0px 5;
}
.post:hover {
  background-color: rgba(175, 199, 216, 0.2);
  border-radius: 8px;
  transition: ease-in-out 0.3s;
  border-bottom: 0.1px solid transparent;
}
.post p {
  margin-bottom: 5px;
}
a {
  text-decoration-line: none;
}
.contents {
  display: flex;
}
</style>
