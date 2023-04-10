<template>
  <div class="container article_bannerss">
    <div class="row justify-content-center">
      <div class="article_insert">
        <div class="card-header d-flex justify-content-between article_title">
          <div class="d-flex align-items-center mb-2">
            <img
              class="content_img"
              :src="`https://localhost:7259/Images/${objArticleDetail.photoSticker}`"
              alt=""
            />
            <p class="m-0 ms-3">{{ objArticleDetail.nickName }}</p>
            <p class="ms-2">
              {{ objArticleDetail.time.replace("T", " ").slice(0, 18) }}
            </p>
            <p class="ms-2 foremName">{{ objArticleDetail.forumName }}</p>
          </div>
          <div>
            <a href="#contentid" class="mylink">撰寫留言</a>
          </div>
        </div>
        <div class="post">
          <div class="align-items-center mb-2">
            <div class="d-flex justify-content-between">
              <h2>{{ objArticleDetail.title }}</h2>
              <!-- 刪除文章 -->
              <button
                v-if="this.userMemberId === this.objArticleDetail.memberId"
                type="button"
                class="btn"
                @click="removeArticle($event, $route.params.Articleid)"
              >
                <i class="fa-solid fa-trash fs-3" style="color: #d39899"></i>
              </button>
            </div>

            <div class="mt-3">
              <p class="m-0 changerow">{{ objArticleDetail.content }}</p>
            </div>
            <div class="imgate">
              <img
                :src="`https://localhost:7259/Images/${objArticleDetail.articlePhoto}`"
                alt=""
              />
            </div>

            <!-- <div>
              <p class="comments">共XX則留言</p>
            </div> -->
          </div>
        </div>
        <p class="comment_title">留言區</p>

        <div
          class="contents_area"
          ref="commentall"
          v-for="item in objArticleDetail.messageComment"
          :key="item.id"
        >
          <div class="comment">
            <div class="ms-3 d-flex align-items-center">
              <img
                class="contentmessage_img"
                :src="`https://localhost:7259/Images/${item.photoSticker}`"
                alt=""
              />
              <p class="ms-3 me-1">{{ item.nickName }} :</p>
              <p class="m-0 commentContent">{{ item.content }}</p>
            </div>

            <div class="d-flex align-items-center">
              <!-- v-if="memberid==item.memberId"  登入的人是留言者，就可以刪除這則留言 -->
              <button
                v-if="
                  this.userMemberId === item.memberId ||
                  this.userMemberId === this.objArticleDetail.memberId
                "
                type="button"
                class="btndelete"
                @click="removeMessage($event, item.id)"
              >
                刪除
              </button>
              <p class="ms-3">{{ item.time.replace("T", " ").slice(0, 18) }}</p>
            </div>
          </div>
          <!-- Insert -->
          <!-- <div class="comment">
              <div class="ms-3 d-flex">
                <p class="me-1">A :</p>
                <p>123</p>
              </div>
              <button type="button" class="btn btn-danger delete_btn" @click="removeMessage">刪除</button>
            </div> -->
        </div>
        <div class="comment_contents" id="contentid">
          <div>
            <img
              class="content_img"
              :src="`https://localhost:7259/Images/${userSticker}`"
              alt=""
            />
          </div>
          <input
            v-if="!token"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
            class="comment_contents_input form-control"
            type="text"
            placeholder="留言..."
            v-model="createMessage"
          />
          <input
            v-else
            class="comment_contents_input form-control"
            type="text"
            placeholder="留言..."
            v-model="createMessage"
          />
          <div class="btnbox">
            <button
              v-if="!token"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              type="button"
              class="btn_submit"
            >
              送出
            </button>
            <button
              v-else
              type="button"
              class="btn_submit"
              @click="clickMessage"
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleDetail",
  props: ["Articleid"],
  data() {
    return {
      objArticleDetail: {},
      // objArticleComment: {},
      createMessage: "",
      count: 0,
      objArticleDelete: {},
      objMembers: {},
      userSticker: "",
      userNickname: "",
      userMemberId: "",
    };
  },
  created() {
    this.callArticleDetailApi();
    this.callMembersProfileApi();
    // this.callArticleCommentApi()
    this.getMemberProfile();
  },

  methods: {
    async getMemberProfile() {
      await axios
        .get(`https://localhost:7259/api/Members/Read`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          this.userMemberId = response.data;
        })
        .catch((error) => {
          console.log(error);
          console.log("沒登入");
        });

      await axios
        .get(
          `https://localhost:7259/api/Members/Profile?id=${this.userMemberId}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.userSticker = response.data.photoSticker;
          this.userNickname = response.data.nickName;
        })
        .catch((error) => {
          console.log(error);
          console.log("沒登入");
        });
    },

    async callMembersProfileApi() {},

    async clickMessage() {
      console.log(this.createMessage);
      await axios
        .post(`https://localhost:7259/api/Message/CreateComment`, {
          content: this.createMessage,
          // 是誰留言的 要登入
          memberId: this.userMemberId,
          articleId: this.objArticleDetail.articleId,
        })
        .then((response) => {
          console.log("新增留言成功");
          // const allComment = {
          //   id: response.data,
          //   time: new Date().toLocaleString(),
          //   memberId: this.userMemberId,
          //   nickName: this.userNickname,
          //   content: this.createMessage,
          // };
          // this.objArticleDetail.messageComment.push(allComment);

          this.createMessage = "";
        });

      await axios
        .get(
          `https://localhost:7259/api/Article/ArticleDetails?ArticleId=${this.Articleid}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.objArticleDetail = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // async callArticleCommentApi(){
    //       await axios.get(`https://localhost:7259/api/Article/ArticleComment?messageId=${this.Articleid.messageid}`)
    //       .then(response=> {
    //           console.log(response.data)
    //           this.objArticleComment = response.data
    //       })
    //       .catch(error=> {
    //           console.log(error)
    //       })
    //   },
    async removeArticle(event, articleid) {
      await axios
        .delete(
          `https://localhost:7259/api/Article/DeleteArticle?articleid=${articleid}`
        )
        .then((response) => {
          console.log("刪除文章成功");
          event.target.parentNode.remove();
          this.$router.push("/Forum");
        });
    },

    async removeMessage(event, id) {
      console.log(id);
      await axios
        .delete(
          `https://localhost:7259/api/Message/DeleteComment?messageid=${id}`
        )
        .then((response) => {
          console.log("刪除留言成功");
          event.target.parentNode.parentNode.remove();
        });
    },

    // async clickMessage() {
    //     //console.log(this.createMessage)
    //     //console.log(this.$refs.commentall)
    //     const node = document.createElement("div")
    //     node.setAttribute("class", "comment")
    //     node.innerHTML = `
    //       <div class="ms-3 d-flex">
    //         <p class="me-1">A :</p>
    //         <p>${this.createMessage}</p>
    //       </div>
    //       <button type="button" class="btn btn-danger delete_btn" id="btn${this.count}">刪除</button>
    //     `
    //     this.$refs.commentall.appendChild(node);
    //     document.getElementById(`btn${this.count}`).addEventListener("click", this.removeMessage)
    //     this.createMessage = ""
    //     this.count++;
    // },

    async callArticleDetailApi() {
      await axios
        .get(
          `https://localhost:7259/api/Article/ArticleDetails?ArticleId=${this.Articleid}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.objArticleDetail = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  computed: {
    token() {
      return $.cookie("token");
    },
  },
};
</script>

<style scoped>
.changerow {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.btndelete {
  background-color: #d39899;
  padding: 6px 12px;
  border-radius: 15px;
  border: none;
  /* font-size: 17px; */
  color: #fff;
  height: 45px;
}
.foremName {
  margin: 0;
  background-color: #f6f6f6;
  padding: 5px;
  border-radius: 10px;
  font-size: 15px;
}
.commentContent {
  word-break: break-all;
}

.mylink {
  color: #8991a9;
}

.imgate img {
  width: 500px;
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
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

header {
  background-color: #000001;
  color: #fff;
  padding: 20px;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

nav li {
  margin-right: 20px;
}

nav li:last-child {
  margin-right: 0;
}

nav a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post {
  padding: 20px 20px 10px 20px;
  box-shadow: 0px 0px 5;
}
.post p {
  margin-bottom: 5px;
}
a {
  text-decoration-line: none;
}

.article_bannerss {
  margin-top: 10px;
  padding: 0px;
}
.contents_area {
  margin-top: 30px;
}
.article_insert {
  margin: 10px 0px;
  padding: 20px 70px 20px 70px;
  background-color: white;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.1);
  border: 0.5px solid #c7cad6;
  border-radius: 15px;
}
.article_title {
  padding: 5px 20px;
  background: none;
  /* border-bottom: 1px solid #d8d8d8; */
}
.comment_title {
  padding: 15px;
  background-color: rgba(175, 199, 216, 0.3);
  border-radius: 15px;
}
.comment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.comment_contents {
  padding: 0px;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.comment_contents_input {
  width: 85%;
  height: 45px;
  border-radius: 15px;
  padding-left: 15px;
}

.contentmessage_img {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid white;
  object-fit: cover;
}
.content_img {
  width: 60px;
  height: 60px;
  border-radius: 50px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid white;
  object-fit: cover;
}
.btnbox {
  margin-left: 10px;
}
.btn_submit {
  background: #a6b6b0;
  padding: 6px 12px;
  border-radius: 15px;
  border: none;
  /* font-size: 17px; */
  color: #fff;
  height: 45px;
}
</style>
