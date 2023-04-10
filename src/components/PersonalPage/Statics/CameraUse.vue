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
// 某人相機使用率
let dated;
axios({
  method: "POST",
  url: "https://localhost:7259/api/Statistic/CameraCount",
  data: { Id: memberId },
})
  .then((response) => {
    console.log(response.data);
    dated = response.data;
    // console.log(dated);

    const data = {
      labels: dated.cameraCategory,
      datasets: [
        {
          label: "上傳次數",
          // Making each element take up full width, equally divided
          data: dated.cameraCount,
          backgroundColor: [
            "rgba(54, 162, 235, 0.5)",
            "rgba(211, 152, 153,0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(0, 0, 0, 0.5)",
            "rgba(20, 43, 152, 0.5)",
          ],
          borderRadius: 10,
        },
      ],
    };

    let delayed;
    const config = {
      type: "doughnut",
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
              delay = context.dataIndex * 90 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "相機使用率",
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
  width: 550px;
  padding: 20px;
}
</style>
