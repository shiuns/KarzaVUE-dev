<template>
  <div class="content">
    <h4>我的活動報名</h4>
    <div class="line"></div>
    <div class="mt-3 mb-5">
      <RouterLink
        to="/Record/ActivityEnrolled"
        class="linkBtn me-3"
        exact
        active-class="active"
        >未舉辦</RouterLink
      >

      <RouterLink
        to="/Record/ActivityJoined"
        class="linkBtn"
        exact
        active-class="active"
        >已舉辦</RouterLink
      >
    </div>
    <RouterView />
  </div>
</template>

<script>

</script>
<style scoped>
.content {
  padding: 20px 50px;
}
.line {
  height: 1px;
  background-color: #a3a3a3;
}

a {
  text-decoration: none;
  color: gray;
}
.linkBtn {
  background-color: transparent;
  border: 0px;
  height: 50px;
  width: 80px;
  padding: 5px;
  margin-bottom: 10px;
}

.active {
  border-bottom: 2px solid #afc7d8;
  color: #070707;
}

</style>
