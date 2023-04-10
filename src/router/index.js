import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PhotoGrid from "../components/PersonalPage/PhotoGrid.vue";
import AlbumGrid from "../components/PersonalPage/AlbumGrid.vue";
import AlbumPhoto from "../components/PersonalPage/AlbumPhoto.vue";
import Collection from "../components/PersonalPage/Collection.vue";
import DateViews from "../components/PersonalPage/Statics/DateViews.vue";
import TopPhotoViews from "../components/PersonalPage/Statics/TopPhotoViews.vue";
import CameraUse from "../components/PersonalPage/Statics/CameraUse.vue";

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    //首頁
    {
      path: "/",
      name: "home",
      //適合一般靜態網頁
      component: HomeView,
    },
    {
      path: "/Product",
      name: "Product",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Show-product.vue"),
    },
    {
      path: "/Product/:id",
      name: "DetailProduct",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Product/DetailProduct.vue"),
    },
    {
      path: "/ShoppingCart",
      name: "ShoppingCart",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/ShoppingCart.vue"),
    },
    {
      path: "/CheckOutReport/:id",
      name: "CheckOutReport",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/CheckOutReport.vue"),
    },

    {
      path: "/Register",
      name: "Register",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Member/Register.vue"),
    },
    {
      path: "/Profile",
      name: "Profile",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Member/Profile.vue"),
    },
    {
      path: "/EditProfile",
      name: "EditProfile",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Member/EditProfile.vue"),
    },
    {
      path: "/ForgotPassword",
      name: "ForgotPassword",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Member/ForgotPassword.vue"),
    },
    {
      path: "/EditPassword",
      name: "EditPassword",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Member/EditPassword.vue"),
    },

    {
      path: "/Forum",
      name: "Forum",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Forum.vue"),
    },

    {
      path: "/Forum/Create",
      name: "Create",
      component: () => import("../views/Forum/CreateArticle.vue"),
    },

    {
      path: "/Forum/ArticleDetail/:Articleid",
      name: "Detail",
      component: () => import("../views/Forum/ArticleDetail.vue"),
      props: true,
    },

    {
      path: "/Activity",
      name: "Activity",
      //動態載入（有進到這裡才會載入資源，適合有串接api的元件）
      component: () => import("../views/Activity.vue"),
    },
    //活動詳細頁面(動態router
    {
      path: "/Activity/:id",
      name: "activityDetails",
      component: () => import("../views/Activity/[id].vue"),
    },
    //活動搜尋
    {
      path: "/Activity/Search",
      name: "activitySearch",
      component: () => import("../views/Activity/Search.vue"),
    },

    //我的紀錄
    {
      path: "/Record",
      name: "Record",
      component: () => import("../views/Record.vue"),
      children: [
        {
          path: "/Record/ActivitySaved",
          name: "ActivitySaveRecord",
          component: () => import("../views/Record/ActivitySaved.vue"),
        },
        {
          path: "/Record/ActivityRecord",
          name: "ActivityRecord",
          component: () => import("../views/Record/ActivityRecord.vue"),
          children: [
            {
              path: "/Record/ActivityEnrolled",
              name: "ActivityEnrolled",
              component: () => import("../views/Record/ActivityEnrolled.vue"),
            },
            {
              path: "/Record/ActivityJoined",
              name: "ActivityJoined",
              component: () => import("../views/Record/ActivityJoined.vue"),
            },
          ],
        },
        {
          path: "/Record/OrderPage",
          name: "OrderPage",
          component: () => import("../views/Record/OrderPage.vue"),
        },
        {
          path: "/Record/Favorite",
          name: "Favorite",
          component: () => import("../views/Record/Favorite.vue"),
        },
      ],
    },
    //社群主頁
    {
      path: "/Community",
      name: "Community",
      component: () => import("../views/Community.vue"),
    },
    //個人主頁
    {
      //這個直接導向notfound?
      name: "personalPage",
      path: "/Community/PersonalPage",
      component: () => import("../views/PersonalPage.vue"),
      children: [
        {
          path: "/Community/PersonalPage/:memberId/Photos",
          name: "photos",
          component: PhotoGrid,
        },
        {
          path: "/Community/PersonalPage/:memberId/Albums",
          name: "albums",
          component: AlbumGrid,
        },
        {
          path: "/Community/PersonalPage/:memberId/Albums/:albumId",
          name: "albumphoto",
          component: AlbumPhoto,
        },
        {
          path: "/Community/PersonalPage/:memberId/Collections",
          name: "collection",
          component: Collection,
        },
        {
          path: "/Community/PersonalPage/:memberId/Statics/DateViews",
          name: "dateViews",
          component: DateViews,
        },
        {
          path: "/Community/PersonalPage/:memberId/Statics/CameraUse",
          name: "cameraUse",
          component: CameraUse,
        },
        {
          path: "/Community/PersonalPage/:memberId/Statics/TopPhotoViews",
          name: "topPhotoViews",
          component: TopPhotoViews,
        },
      ],
    },

    //要在最後一個(可能被動態router攔截)
    // 網址錯誤會跑到404那頁
    {
      path: "/:domain(.*)*",
      name: "NotFound",
      component: () => import("../views/404.vue"),
    },
  ],
});

export default router;
