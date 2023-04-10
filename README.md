## 共用登入modal、alert

`npm install -S vue-sweetalert2`

在.vue中引用下方內容就可以使用
(路徑輸入相對位置)
```javascript

<script>

import utility from "@/public/utility.js"
export default {

  mixins: [utility],
  
}
</script>
```
### 使用方法

####   **登入**

點擊要顯示登入modal的按鈕：
`<button data-bs-toggle="modal"
                data-bs-target="#loginModal"></button>` 


####   **alert**
使用 `this.showAlert(string message)`

ex: `this.showAlert("成功加入購物車")`

在畫面下方會顯示傳入字串的alert

####   **memberId**
使用 `this.fetchMemberId()`

有登入回傳memberId，沒登入回傳0
