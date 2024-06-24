/*
 * @Author: huaxu huaxu@dgg.net
 * @Date: 2024-04-16 10:42:09
 * @LastEditors: huaxu huaxu@dgg.net
 * @LastEditTime: 2024-06-24 14:50:52
 * @FilePath: /v2-elment-UI/src/lib.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//全局注册base-ui
import BaseTable from "@/base-ui/table/src/table.vue";
import BaseForm from "@/base-ui/form/src/form.vue";
import BaseDialog from "@/base-ui/dialog/src/dialog.vue";
import BaseSearch from "@/base-ui/search/src/search.vue";
import { copyField, BASECONFIG, reset, importComponents } from "@/base-ui/utils";

const files = require.context("@/base-ui", true, /\.vue$/);
const modules = importComponents(files);
const install = (Vue, opts = {}) => {
  // 默认配置
  Vue.prototype.$BASECONFIG = { ...BASECONFIG, ...opts };

  Object.keys(modules).map((component) => {
    modules[component].name &&
      Vue.component(modules[component].name, modules[component]);
  });
};

// 判断是否是直接引入文件
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  copyField,
  reset,
  BASECONFIG,
  BaseTable,
  BaseForm,
  BaseDialog,
  BaseSearch,
};
