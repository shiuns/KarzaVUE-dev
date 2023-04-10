<template>
  <div class="chartCard">
    <div class="chartBox">
      <canvas id="myChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const memberId = route.params.memberId;
let dated;

axios({
  method: "POST",
  url: "https://localhost:7259/api/Statistic/TopViews",
  data: { Id: memberId },
})
  .then((response) => {
    console.log(response.data);
    dated = response.data;
    // console.log(dated);

    const data = {
      labels: dated.photoTitle,
      datasets: [
        {
          label: "瀏覽次數",

          // Making each element take up full width, equally divided
          data: dated.photoViews,
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(211, 152, 153,0.5)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(20, 43, 152, 0.2)",
          ],
          borderRadius: 15,
          borderSkipped: false,
        },
      ],
    };

    let delayed;
    const config = {
      type: "bar",
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
              delay = context.dataIndex * 150 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "前五名瀏覽次數照片",
          },
          // Accessing labels and making them images
          labels: {
            render: "image",
            images: dated.photoSrc,
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
