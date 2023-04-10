<template>
  <div class="container article_bannero">
    <div class="d-flex row">
      <div class="forum col-2">
        <div class="card forumRoll">
          <ul class="list-group list-group-flush">
            <li class="list-group-item forumall">
              <a class="fs-5 text-black">所有看板</a>
            </li>
            <!-- 所有看板列表 -->
            <li
              v-for="item in objforum"
              :key="item.id"
              class="list-group-item forumother"
            >
              <a
                href="#"
                class="forumLink"
                @click="callForumOnceApi(item.id)"
                >{{ item.name }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="col-10">
        <div class="article">
          <div class="card-header article_title">
            <div class="d-flex justify-content-between align-items-center">
              <a
                class="nav-link active fs-3 me-3"
                aria-current="true"
                @click.prevent="callPopularArticleApi"
                style="cursor: pointer"
                >全部文章</a
              >
              <select
                class="article_category form-select"
                v-model="changeArticle"
                @change="changeNewOld"
              >
                <option value="" class="choice" disabled>未選擇</option>
                <option class="choice">熱門</option>
                <option class="choice">最新</option>
              </select>
              <div class="articl_search">
                <input
                  v-model="inputTitle"
                  type="text"
                  class="article_texts form-control"
                  placeholder="輸入文章標題關鍵字..."
                  @keyup="callSearchApi"
                />
              </div>
            </div>
            <div class="article_change">
              <button
                class="article_create"
                v-if="!token"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                新增文章
              </button>
              <router-link to="/Forum/Create" v-else>
                <button class="article_create" @click="btncreateArticle">
                  新增文章
                </button>
              </router-link>
            </div>
          </div>
          <!-- 內容在這 -->
          <Forumarticle :parentArticles="showArticle"></Forumarticle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Forumarticle from "./Forum/Forumarticle.vue";
export default {
  name: "PopularArticle",
  data() {
    return {
      objforum: [],

      inputTitle: "",
      showArticle: [],

      changeArticle: "",
    };
  },
  created() {
    this.callForumallApi();
    this.callSearchApi();
  },
  mounted() {
    this.callSearchApi();
  },
  methods: {
    btncreateArticle() {},

    //全部看板
    async callForumallApi() {
      await axios
        .get("https://localhost:7259/api/Forum/ForumAll")
        .then((response) => {
          console.log(response.data);
          this.objforum = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //某看板
    async callForumOnceApi(id) {
      await axios
        .get(`https://localhost:7259/api/Article/ForumArticle?ForumId=${id}`)
        .then((response) => {
          console.log(id);
          console.log("搜尋某看板成功");
          this.showArticle = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //搜尋文章
    async callSearchApi() {
      await axios
        .get(
          `https://localhost:7259/api/Article/Search?title=${this.inputTitle}`
        )
        .then((response) => {
          console.log(response.data);
          this.showArticle = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //熱門文章
    async callPopularArticleApi() {
      await axios
        .get("https://localhost:7259/api/Article/PopularArticle")
        .then((response) => {
          console.log(response.data);
          this.showArticle = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //最新文章
    async callLatestArticleApi() {
      await axios
        .get("https://localhost:7259/api/Article/LatestArticle")
        .then((response) => {
          console.log(response.data);
          this.showArticle = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    changeNewOld() {
      if (this.changeArticle === "熱門") {
        this.callPopularArticleApi();
      } else {
        this.callLatestArticleApi();
      }
    },
  },

  components: {
    Forumarticle,
  },

  computed: {
    token() {
      return $.cookie("token");
    },
  },
};
</script>

<style scoped>
.forumLink {
  color: black;
  width: 100%;
  height: 100%;
}
.forumRoll {
  background-color: white;
  border-radius: 15px;
  border: 0;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.1);
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

header {
  background-color: #000001;
  color: #fff;
  padding: 20px;
}
a {
  text-decoration-line: none;
}
.forum {
  margin: 0 auto;
  display: flex;
  margin-top: 25px;
  margin-bottom: 20px;
}
.article_bannero {
  margin-top: 10px;
}

.forumall {
  text-align: center;
  padding: 37px 50px;
  border-bottom: 1px solid #d8d8d8;
  border-radius: 15px 15px 0 0;
}
.forumother {
  text-align: center;
  border-bottom: none;
  font-size: 18px;
  padding: 20px 0;
}
.forumother:hover {
  background-color: rgba(175, 199, 216, 0.5);
  transition: ease-in-out 0.3s;
}
.article {
  margin-top: 25px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}
.article_title {
  padding: 20px;
  background: none;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.article_change {
  display: flex;
  justify-content: center;
  align-items: center;
}
.article_category {
  width: 100px;
  padding: 5px 5px;
  margin-right: 20px;
}

/* .choice {
  margin-top: 20px;
} */
.articl_search {
  display: flex;
  justify-content: center;
  align-items: center;
}
.article_texts {
  width: 500px;
}

.article_create {
  border-radius: 0.375rem;
  width: 80px;
  margin-right: 5px;
  background: #a6b6b0;
  height: 35px;
  border: 0;
  color: #fff;
}
</style>
