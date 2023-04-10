<script setup></script>

<template>
  <div>
    <!-- header -->
    <header class="w-100 overflow-hidden bg-white h100">
      <div class="container position-relative h-100">
        <div
          class="col-12 col-lg-8 mt-0 h-100 position-absolute top-0 end-0 bg-cover"
          data-aos="fade-left"
          data-aos-delay="200"
          style="
            background-image: url(https://images.pexels.com/photos/4318981/pexels-photo-4318981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
          "
        ></div>
        <div class="row">
          <div
            class="col-lg-7 py-vh-6 position-relative"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            <h1 class="display-1 fw-bold mt-5">KARZA!</h1>
            <p class="lead">為攝影愛好者們提供了一個開放、豐富和安全的平台</p>
            <p class="lead">學習、交流和分享攝影方面的知識和經驗。</p>
            <router-link
              to="/Register"
              class="btn btn-dark btn-xl shadow me-3 rounded-3 my-5 register"
              >免費加入</router-link
            >
          </div>
        </div>
      </div>
    </header>

    <div class="py-vh-4 w-100 overflow-hidden bg-white">
      <div class="container">
        <div class="row d-flex justify-content-between align-items-center">
          <div class="col-lg-6" data-aos="fade-right">
            <div
              class="shadow ratio rounded bg-cover mt-5 bp-center"
              data-aos="fade-left"
              style="
                background-image: url(https://images.pexels.com/photos/11120781/pexels-photo-11120781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
                --bs-aspect-ratio: 50%;
              "
            ></div>
          </div>
          <div class="col-lg-5" data-aos="fade-left">
            <h2 class="py-5 border-top border-dark" data-aos="fade-right">
              教學活動
            </h2>
            <div data-aos="fade-right" data-aos-delay="200">
              <p class="p-0 m-0">多種免費攝影教學活動</p>
              <p class="p-0 m-0">提升攝影技巧</p>
            </div>

            <p>
              <router-link
                to="/Activity"
                class="link-fancy link-dark mt-3"
                data-aos="fade-right"
                data-aos-delay="400"
                >查看更多
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 社群 -->
    <div class="py-vh-4 w-100 overflow-hidden bg-white">
      <div class="container">
        <div class="row d-flex justify-content-between align-items-center">
          <div class="col-lg-4">
            <h2 class="py-5 border-top border-dark" data-aos="fade-right">
              社群&論壇
            </h2>
            <div data-aos="fade-right" data-aos-delay="200">
              <p class="p-0 m-0">分享自己的攝影作品、紀錄生活。</p>
              <p class="p-0 m-0">
                透過不同角度看見其他用戶鏡頭下的世界，互相交流經驗、技巧和意見。
              </p>
              <p class="p-0 m-0">是攝影愛好者們必不可少的社群！</p>
            </div>

            <p>
              <router-link
                to="/Community"
                class="link-fancy link-dark mt-3"
                data-aos="fade-right"
                data-aos-delay="400"
                >查看更多
              </router-link>
            </p>
          </div>
          <div class="col-lg-6">
            <div class="row gx-5 d-flex">
              <div class="col-md-11">
                <div
                  class="shadow ratio ratio-16x9 rounded bg-cover bp-center align-self-end"
                  data-aos="fade-left"
                  style="
                    background-image: url(https://images.pexels.com/photos/590179/pexels-photo-590179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
                    --bs-aspect-ratio: 50%;
                  "
                ></div>
              </div>

              <div class="col-md-6">
                <div
                  class="col-12 shadow ratio rounded bg-cover mt-5 bp-center"
                  data-aos="fade-right"
                  style="
                    background-image: url(https://images.pexels.com/photos/2175952/pexels-photo-2175952.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
                    --bs-aspect-ratio: 150%;
                  "
                ></div>
              </div>
              <div class="col-md-5 offset-md-1">
                <div
                  class="shadow ratio ratio-1x1 rounded bg-cover mt-5 bp-center float-end"
                  data-aos="fade-up"
                  style="
                    background-image: url(https://images.pexels.com/photos/542515/pexels-photo-542515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商城 -->
    <div class="py-vh-5 w-100 overflow-hidden bg-white">
      <div class="container">
        <div class="row d-flex justify-content-between align-items-center">
          <div class="col-lg-4">
            <div class="">
              <h2 class="mb-5" data-aos="fade-down">商城</h2>
            </div>
            <div class="py-5 border-top border-dark" data-aos="fade-right">
              <p>提供您最全面的相機產品和配件。</p>

              <p>
                無論您是攝影愛好者、職業攝影師還是普通用戶，我們都能為讓您輕鬆選擇符合您需求的商品。
              </p>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="row">
              <div class="col-lg-6" data-aos="fade-up">
                <div class="display-1 fw-bold py-4">
                  <i class="fa-solid fa-tags textcolor"></i>
                </div>
                <p>加入會員即可獲得優惠券</p>
              </div>
              <div class="col-lg-6" data-aos="fade-up">
                <div class="display-1 fw-bold py-4 textcolor">+100</div>
                <p>超過100項商品，提供多種品牌、相關相關器材</p>
              </div>
              <p>
                <router-link
                  to="/Product"
                  class="link-fancy link-dark"
                  data-aos="fade-left"
                  data-aos-delay="100"
                  >查看更多
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.h100 {
  height: 90vh;
}
.textcolor {
  color: #040404;
}
</style>
n
