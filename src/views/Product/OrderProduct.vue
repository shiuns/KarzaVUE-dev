<template>
   <div class="newproduct">
          <button class="filter_btn border_btn ">最新*</button>
          <button  @click="CallOrderByPriceS" class="filter_btn border_btn">價格*</button>
          <button class="filter_btn">價格*</button>
        </div>
</template>

<script>
import axios from "axios"
export default {
    data() {
    return {
        orders: null
         
    };
  },
  created(){
    this.CallOrderByPriceS()
  },
 methods: {
      async CallOrderByPriceS(){
        await axios.get("https://localhost:7259/api/OrderByPriceS")
        .then(response=>{
          this.orders = response.data
        })
        .catch(error => {
          console.log(error);
        })
      }
  },
}
</script>

<style scoped>
.filter_btn{
  border: none;
  background: none;
  padding: 3px 8px;
  font-weight: 800;
}
</style>