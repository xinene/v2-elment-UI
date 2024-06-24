/*
 * @Author: huaxu huaxu@dgg.net
 * @Date: 2024-04-16 10:42:09
 * @LastEditors: huaxu huaxu@dgg.net
 * @LastEditTime: 2024-06-24 15:44:08
 * @FilePath: /v2-elment-UI/src/main/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.config.productionTip = false;

import baseui from "@/base-ui";
// import "kkw-base/css/index.css";
// import baseui from "v2-base-ui";

// 默认配置
const BASECONFIG = {
  // 查询默认length
  searchMaxlength: 5,
};
Vue.use(baseui,BASECONFIG);

Vue.use(ElementUI);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
