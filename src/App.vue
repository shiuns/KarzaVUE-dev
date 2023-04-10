<script>
import utility from "./../public/utility.js";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    // const currentRoute = router.currentRoute.value.path;
    // console.log(currentRoute);
    const navigateTo = () => {
      router.go(0);
    };
    return {
      navigateTo,
      // currentRoute,
    };
  },
  // watch: {
  //   $route(to, from) {
  //     // 當路由切換時，這個監聽器會被觸發
  //     // 可以在這裡執行某些操作，例如更新數據
  //     this.getMemberId();
  //     console.log("路由發生了變化：", to.path, from.path);
  //   },
  // },
  data() {
    return {
      isLogin: null,
      user: {
        email: "",
        password: "",
        erromsg: "",
      },
      memberId: 0,
    };
  },
  mounted() {
    this.checkToken();
    // this.getMemberId();
    this.setPhoto();
    //導覽列變化
    window.addEventListener("DOMContentLoaded", () => {
      let scrollPos = 0;
      const mainNav = document.getElementById("mainNav");
      const headerHeight = mainNav.clientHeight;
      window.addEventListener("scroll", function () {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
          // Scrolling Up
          if (currentTop > 0 && mainNav.classList.contains("is-fixed")) {
            mainNav.classList.add("is-visible");
          } else {
            //console.log(123);
            mainNav.classList.remove("is-visible", "is-fixed");
          }
        } else {
          // Scrolling Down
          mainNav.classList.remove(["is-visible"]);
          if (
            currentTop > headerHeight &&
            !mainNav.classList.contains("is-fixed")
          ) {
            mainNav.classList.add("is-fixed");
          }
        }
        scrollPos = currentTop;
      });
    });
  },
  mixins: [utility],

  methods: {
    demoLogin() {
      this.user.email = "eva890706@gmail.com";
      this.user.password = "123";
    },
    checkToken() {
      let isLogin = false;
      let token = $.cookie("token");
      if (token) isLogin = true;
      this.isLogin = isLogin;
    },

    async setPhoto() {
      let id = await this.fetchMemberId();
      this.memberId = id;
      if (id != 0) {
        fetch(`https://localhost:7259/api/Members/Profile?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `bearer ${$.cookie("token")}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            //console.log(data);
            if (data.photoSticker != null)
              $(".userButton").css(
                "background-image",
                `url(https://localhost:7259/Images/${data.photoSticker})`
              );
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    logout() {
      document.cookie =
        "token=''; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.$router.go(0);
    },
    userLogin() {
      if (!this.user.email && !this.user.password) {
        this.user.erromsg = "記得輸入帳號密碼";
        return;
      } else if (!this.user.email) {
        this.user.erromsg = "記得輸入帳號";
        return;
      } else if (!this.user.password) {
        this.user.erromsg = "記得輸入密碼";
        return;
      } else {
        console.log(this.user.email);
        let account = this.user.email;
        let password = this.user.password;
        console.log(account, password);
      }

      //console.log(account)
      fetch(
        `https://localhost:7259/api/Members/JwtLogin?account=${this.user.email}&password=${this.user.password}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.text())
        .then((response) => {
          console.log(response);
          if (
            response == "帳號密碼錯誤" ||
            response == "帳號尚未啟用，請至信箱查看。" ||
            response == "此帳戶已是黑名單"
          ) {
            this.user.erromsg = response;
          } else {
            var d = new Date();
            d.setTime(d.getTime() + 2 * 24 * 60 * 60 * 1000);
            var expires = "expires=" + d.toUTCString();

            document.cookie = `token=${response}; ${expires}; path=/;`;
            this.navigateTo();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // alert("Failure");
        });
    },
  },
};
</script>

<template>
  <div data-bs-spy="scroll" data-bs-target="#mainNav">
    <nav
      id="mainNav"
      class="navbar navbar-expand-lg navbar-light fixed-top"
      tabindex="0"
    >
      <div
        class="container-fluid d-flex align-items-center justify-content-between"
      >
        <!-- Navbar toggler 漢堡選單按鈕-->
        <button
          class="navbar-toggler border-0 px-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i class="fa-solid fa-bars-staggered fs-4"></i>
        </button>

        <router-link to="/" class="navbar-brand m-0">
          <span class="ms-1 fw-bolder fs-4">KARZA!</span></router-link
        >

        <!-- （有登入）lg以下顯示 訊息、通知、個人選單  -->
        <div
          class="d-lg-none d-flex align-items-center justify-content-between"
        >
          <!-- 登入 -->
          <div v-if="!isLogin" class="btn-group">
            <button
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              type="button"
              class="loginBtn"
            >
              登入
            </button>
          </div>

          <!-- 個人資料下拉選單（登入後顯示頭像）(mobile) -->
          <div v-else-if="isLogin" class="btn-group">
            <button
              type="button"
              class="userButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="background-image: url(/src/assets/userPic.png)"
            ></button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <RouterLink to="/Profile" class="dropdown-item personalList"
                  >帳戶管理</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/Record/ActivitySaved"
                  class="dropdown-item personalList"
                  >我的紀錄</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  :to="'/Community/PersonalPage/' + this.memberId + '/Photos'"
                  class="dropdown-item personalList"
                  >個人主頁</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/ShoppingCart"
                  class="dropdown-item personalList"
                  >購物車</RouterLink
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink
                  to=""
                  class="dropdown-item personalList"
                  href="#"
                  @click="logout"
                  >登出</RouterLink
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Navbar collapse -->
        <div
          class="collapse navbar-collapse align-items-center"
          id="navbarCollapse"
        >
          <!-- Navbar nav -->
          <ul class="navbar-nav me-3 ms-3">
            <li class="nav-item">
              <RouterLink
                exact
                active-class="active1"
                to="/Activity"
                class="nav-link navLink"
                >教學活動</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink
                exact
                active-class="active1"
                to="/Product"
                class="nav-link navLink"
                >商城</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink
                exact
                active-class="active1"
                to="/Community"
                class="nav-link navLink"
                >社群</RouterLink
              >
            </li>

            <li class="nav-item">
              <RouterLink
                exact
                active-class="active1"
                to="/forum"
                class="nav-link navLink"
                >論壇</RouterLink
              >
            </li>
          </ul>
          <!--（有登入）lg以上 顯示 訊息、通知、個人選單 -->
          <div
            class="d-lg-block d-none d-flex justify-content-between align-items-center ms-auto"
          >
            <!-- 登入(沒登入前顯示) -->
            <div v-if="!isLogin" class="btn-group">
              <button
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                type="button"
                class="loginBtn"
              >
                登入
              </button>
            </div>

            <!-- 個人資料下拉選單（登入後顯示頭像） -->
            <div v-else-if="isLogin" class="btn-group">
              <button
                type="button"
                class="userButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="background-image: url(/src/assets/userPic.png)"
              ></button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <RouterLink to="/Profile" class="dropdown-item personalList"
                    >帳戶管理</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/Record/ActivitySaved"
                    class="dropdown-item personalList"
                    >我的紀錄</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    :to="'/Community/PersonalPage/' + this.memberId + '/Photos'"
                    class="dropdown-item personalList"
                    >個人主頁</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/shoppingCart"
                    class="dropdown-item personalList"
                    >購物車</RouterLink
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <RouterLink
                    to=""
                    class="dropdown-item personalList"
                    @click="logout"
                    >登出</RouterLink
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main><RouterView /></main>

    <!-- login modal -->
    <div
      class="modal fade"
      id="loginModal"
      tabindex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modalcenter">
        <div class="modal-content Mcontent">
          <h3 @click="demoLogin">登入會員使用更多功能！</h3>
          <div class="modal-body Mbody">
            <div class="loginInput" @keydown.enter="userLogin">
              <div class="form-floating mb-3">
                <input
                  v-model="user.email"
                  name="account"
                  class="form-control Mcontrol"
                  id="loginEmail"
                  type="email"
                  placeholder="電子郵件"
                />
                <label for="loginEmail">電子郵件</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  v-model="user.password"
                  name="password"
                  class="form-control Mcontrol"
                  id="loginPassword"
                  type="password"
                  placeholder="密碼"
                />
                <label for="loginPassword">密碼</label>
                <span class="loginErroMsg">{{ user.erromsg }}</span>
              </div>

              <div>
                <input
                  @click="userLogin"
                  id="login"
                  class="login"
                  type="submit"
                  value="登入"
                />
              </div>
              <router-link to="/ForgotPassword" class="mt-3"
                ><span class="forgetpassword" data-bs-dismiss="modal"
                  >忘記密碼？</span
                ></router-link
              >
            </div>
          </div>

          <p>
            還沒加入會員？<router-link to="/Register"
              ><span class="rigister" data-bs-dismiss="modal"
                >註冊</span
              ></router-link
            >
          </p>
        </div>
      </div>
    </div>
    <!-- 以下會是點了連結之後的內容渲染 -->
    <footer
      class="footer border-top d-flex justify-content-center align-items-center me-0"
    >
      <p class="p-0 m-0 text-white">
        <i class="fa-regular fa-copyright text-white"></i>2023 KARZA!
      </p>
    </footer>
  </div>
</template>

<style>
* {
  font-family: "Noto Serif TC", serif;
  color: #070707;
}
body {
  background-color: #fcf7f0;
  /* height: 300vh; */
}
.btn,
.nav-link.collapsed,
.navbar,
.navbar-collapse.collapse.show,
.navbar-collapse.collapsing,
.scrolled,
.shadow,
a,
img {
  transition: all 0s ease-in-out 0s;
}
main {
  min-height: 100vh;
  padding-bottom: 70px;
  position: relative;
  top: 70px;
}
#mainNav {
  padding-top: 10px;
  padding-bottom: 10px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background: #ffffff;
}
.navLink {
  color: #070707;
}
@media (min-width: 992px) {
  #mainNav {
    background: #ffffff;
    transition: background-color 0.5s;
    /* Force Hardware Acceleration in WebKit */
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .navLink:hover,
  .navLink:active {
    border-bottom: 2px solid #afc7d8;
  }

  #mainNav.is-fixed {
    /* 往下滑時navbar固定在網頁上方隱藏 */
    position: fixed;
    top: -70px;
    transition: transform 0.5s;
  }

  #mainNav.is-visible {
    /* 變化滑動方向時顯示出navbar */

    background-color: #ffffffc0;
    transform: translate3d(0, 100%, 0);
  }
  .active1 {
    border-bottom: 2px solid #afc7d8;
  }
}

.userButton {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 0;
  background-size: cover;
}

.loginBtn {
  width: 70px;
  height: 50px;
  border-radius: 10%;
  background-color: #afc7d8;
  border: 0;
  font-size: 18px;
  color: #ffffff;
}

.personalList:hover,
.personalList:active {
  background-color: #afc7d8;
  color: #fff;
  /* transition: transform 0.01s; */
}

.footer {
  position: relative;
  height: 100px;
  bottom: 0px;
  background-color: #8991a9;
}

.Mcontent {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 0px;
  max-height: 85vh;
  min-width: 40vh;
  width: 450px;
  padding: 60px 50px;
}
.Mbody {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginInput {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.Mcontrol {
  border: 0px;
  border-radius: 0px;
  outline: 0;
  border-bottom: 1px solid #444;
  color: gray;
  width: 100%;
}
.Mcontrol:focus {
  outline: none; /* 外框效果 */
  box-shadow: none;
  border-bottom: 2.5px solid #8991a9;
}
/* modal上的登入鈕 */
.login {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 0px;
  background: #afc7d8;
  color: #fff;
}
.Mcontent a,
.rigister,
.forgetpassword {
  text-decoration: none;
  color: #8991a9;
}

.modalcenter {
  display: flex;
  justify-content: center;
}
.loginErroMsg {
  color: #d39899;
}
/* modal end */
</style>
