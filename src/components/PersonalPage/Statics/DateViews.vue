<template>
  <div class="chartCard">
    <div class="chartBox">
      <canvas id="myChart"></canvas>
    </div>
  </div>
</template>

<script setup>
// 七天內照片總瀏覽次數
import { useRoute } from "vue-router";
const route = useRoute();
const memberId = route.params.memberId;
let dated;

axios({
  method: "POST",
  url: "https://localhost:7259/api/Statistic/DateViews",
  data: { Id: memberId },
})
  .then((response) => {
    console.log(response.data);
    dated = response.data;
    // console.log(dated);

    const data = {
      labels: dated.date,
      datasets: [
        {
          label: "瀏覽次數",
          // Making each element take up full width, equally divided
          data: dated.dateViews,
          backgroundColor: "rgba(175, 199, 216,0.5)",
          borderColor: "rgba(175, 199, 216)",

          borderSkipped: false,
        },
      ],
    };

    let delayed;
    const config = {
      type: "line",
      data,
      options: {
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (
              context.type === "data" &&
              context.mode === "default" &&
              !delayed
            ) {
              delay = context.dataIndex * 100 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "七天內照片總瀏覽次數",
          },
        },
      },
    };

    // render init block
    const myChart = new Chart(
      document.getElementById("myChart").getContext("2d"),
      config
    );
  })
  .catch((error) => console.log(error));
</script>

<style scoped>
.chartCard {
  width: 100vw;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chartBox {
  width: 800px;
  padding: 20px;
}
</style>
